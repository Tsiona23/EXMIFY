const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT (if not already in use)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Pass plain password; the User model's pre-save hook will hash it exactly once.
    const user = await User.create({
      name: name?.trim(),
      email: normalizedEmail,
      password: password.trim(), // Pass plain password to the model
      role: role || 'student'
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Find user and explicitly select hidden password field
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user || !(await bcrypt.compare(cleanPassword, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Placeholder for updateProfile (assuming it exists)
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (updatedUser) {
      res.json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PASSWORD (Admin/User)
const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    // Find the user and explicitly select the password field.
    // This is required to update fields marked as 'select: false'.
    const user = await User.findById(req.user._id || req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Assign plain password; the pre-save hook in the User model will hash it.
    user.password = password.trim();
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error during password update." });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  updatePassword,
};