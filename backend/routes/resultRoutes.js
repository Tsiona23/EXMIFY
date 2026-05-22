const express = require("express");
const router = express.Router();

const resultController = require("../controllers/resultController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// STUDENT ROUTES

router.post("/submit", protect, resultController.submitExam);

router.get("/my-results", protect, resultController.getMyResults);

router.get("/:id", protect, resultController.getResultById);


// ADMIN ROUTE

router.get(
  "/stats/analytics",
  protect,
  adminOnly,
  resultController.getStats
);

module.exports = router;