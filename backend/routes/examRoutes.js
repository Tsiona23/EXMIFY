const express = require("express");
const router = express.Router();

const {
  createExam,
  getExams,
  getExamById,
  updateExamQuestions,
  deleteExam,
} = require("../controllers/examController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// CREATE EXAM
router.post("/", protect, adminOnly, createExam);

// GET ALL EXAMS
router.get("/", protect, getExams);

// GET SINGLE EXAM
router.get("/:id", protect, getExamById);

// UPDATE QUESTIONS for an exam
router.put("/:id/questions", protect, adminOnly, updateExamQuestions);

// DELETE EXAM
router.delete("/:id", protect, adminOnly, deleteExam);

module.exports = router;