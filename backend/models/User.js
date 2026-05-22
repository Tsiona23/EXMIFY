const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // AUTH
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // PROFILE
    avatar: {
      type: String,
      default: "",
    },

    // SETTINGS (IMPORTANT FOR YOUR APP)
    preferences: {
      darkMode: {
        type: Boolean,
        default: false,
      },

      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
    },

    // NOTIFICATIONS SYSTEM (SAAS FEATURE)
    notifications: [
      {
        type: {
          type: String,
          default: "info",
        },
        title: String,
        message: String,
        read: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);