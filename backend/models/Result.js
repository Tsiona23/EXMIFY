const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
  score: Number,
  totalQuestions: Number,
  answers: [
    {
      questionId: String,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Result", resultSchema);