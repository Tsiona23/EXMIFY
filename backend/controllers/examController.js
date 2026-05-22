const Exam = require("../models/Exam");

// CREATE EXAM (Admin)
const createExam = async (req, res) => {
  try {
    const { title, description, duration, questions, attemptsAllowed } = req.body;

    const exam = await Exam.create({
      title,
      description,
      duration,
      attemptsAllowed: attemptsAllowed || 1,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Exam created successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL EXAMS (Students)
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find().select("-questions.correctAnswer");

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE EXAM (Take Exam)
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // hide correct answers for students
    const examData = {
      _id: exam._id,
      title: exam.title,
      description: exam.description,
      duration: exam.duration,
      attemptsAllowed: exam.attemptsAllowed,
      questions: exam.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      })),
    };

    res.json(examData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE EXAM QUESTIONS (Admin) - Replaces the entire questions array
const updateExamQuestions = async (req, res) => {
  try {
    const { questions } = req.body; // Expects the full, updated array of questions

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    exam.questions = questions; // Replace the entire questions array

    await exam.save();

    res.json({
      message: "Exam questions updated successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EXAM (Admin)
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExamQuestions,
  deleteExam,
};