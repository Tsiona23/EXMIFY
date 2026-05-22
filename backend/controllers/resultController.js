const Exam = require("../models/Exam");
const Result = require("../models/Result");

const submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // Check attempt limit
    const attemptCount = await Result.countDocuments({ user: req.user.id, exam: examId });
    if (exam.attemptsAllowed && attemptCount >= exam.attemptsAllowed) {
      return res.status(403).json({
        message: "Maximum attempt limit reached for this exam.",
      });
    }

    let score = 0;

    const evaluatedAnswers = exam.questions.map((question) => {
      const userAnswer = answers.find(
        (a) => a.questionId === question._id.toString()
      );

      const isCorrect =
        userAnswer &&
        userAnswer.selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score++;
      }

      return {
        questionId: question._id,
        selectedAnswer: userAnswer
          ? userAnswer.selectedAnswer
          : null,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const result = await Result.create({
      user: req.user.id,
      exam: examId,
      score,
      totalQuestions: exam.questions.length,
      answers: evaluatedAnswers,
    });

    res.status(201).json({
      message: "Exam submitted successfully",
      score,
      totalQuestions: exam.questions.length,
      result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({
      user: req.user.id,
    })
      .populate("exam", "title duration")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("exam");

    if (!result) {
      return res.status(404).json({
        message: "Result not found",
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ADMIN ANALYTICS
const getStats = async (req, res) => {
  try {
    const totalResults = await Result.countDocuments();

    const stats = await Result.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" },
          maxScore: { $max: "$score" },
        },
      },
    ]);

    res.json({
      totalResults,
      avgScore: stats[0]?.avgScore || 0,
      maxScore: stats[0]?.maxScore || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  submitExam,
  getMyResults,
  getResultById,
  getStats,
};