const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String], // ["A", "B", "C", "D"]
  correctAnswer: String,
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  duration: {
    type: Number, // in minutes
    required: true,
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Exam", examSchema);