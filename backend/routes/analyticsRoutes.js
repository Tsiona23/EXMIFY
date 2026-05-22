const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/resultController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @route   GET /api/analytics/stats
// Only admins should see global system stats
router.get("/stats", protect, adminOnly, getStats);

module.exports = router;