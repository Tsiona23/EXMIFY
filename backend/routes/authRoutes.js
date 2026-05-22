const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController'); // Assuming this path
const { protect } = require('../middleware/authMiddleware'); // Assuming protect middleware

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.put('/profile', protect, authController.updateProfile);
router.put('/password', protect, authController.updatePassword);

module.exports = router;