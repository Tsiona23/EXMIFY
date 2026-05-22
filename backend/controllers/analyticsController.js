const Result = require("../models/Result");
const Exam = require("../models/Exam");

const getAnalytics = async (req, res) => {
  try {
    const totalExams = await Exam.countDocuments();
    const totalResults = await Result.countDocuments();

    const results = await Result.find();

    const averageScore =
      results.reduce((acc, r) => acc + r.score, 0) /
      (results.length || 1);

    const passRate =
      (results.filter(
        (r) => r.score / r.totalQuestions >= 0.7
      ).length /
        (results.length || 1)) *
      100;

    res.json({
      totalExams,
      totalResults,
      averageScore: averageScore.toFixed(2),
      passRate: passRate.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };