const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");

// @route   GET /api/profile/me
router.get("/me", protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar,
    preferences: req.user.preferences,
  });
});

// @route   PUT /api/profile/preferences
router.put("/preferences", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.preferences.darkMode = req.body.darkMode ?? user.preferences.darkMode;
    user.preferences.notificationsEnabled = req.body.notificationsEnabled ?? user.preferences.notificationsEnabled;
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      preferences: updatedUser.preferences
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;