import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiBook } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.get(`/exams/${id}`);
        setExam(res.data);
        setTimeLeft(res.data.duration * 60);
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      }
    };

    fetchExam();
  }, [id]);

  const submitExam = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formattedAnswers = Object.keys(answersRef.current).map((qId) => ({
      questionId: qId,
      selectedAnswer: answersRef.current[qId],
    }));

    try {
      const res = await api.post("/results/submit", {
        examId: id,
        answers: formattedAnswers,
      });

      showNotification("Assessment Finished", `You scored ${res.data.score}/${res.data.totalQuestions}`, "success");
      
      // Direct redirect to the specific review for the attempt
      navigate(`/review/${res.data.result._id}`);
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
      showNotification("Error", "Failed to submit exam. Please try again.", "error");

      setIsSubmitting(false);
    }
  }, [id, isSubmitting, navigate, showNotification]);

  useEffect(() => {
  if (!exam || isSubmitting) return;

  if (timeLeft <= 0) {
    const timeout = setTimeout(() => {
      submitExam();
    }, 0);

    return () => clearTimeout(timeout);
  }

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, exam, isSubmitting, submitExam]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showNotification("Warning", "Tab switching is monitored. Please stay on the page.", "error");
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [showNotification]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const toggleReview = (idx) => {
    const newReview = new Set(markedForReview);

    if (newReview.has(idx)) {
      newReview.delete(idx);
    } else {
      newReview.add(idx);
    }

    setMarkedForReview(newReview);
  };

  if (!exam) {
    return <p className="p-10">Loading exam...</p>;
  }

  const currentQ = exam.questions[currentIdx];

  return (
    <div className="p-6 min-h-screen text-slate-900 dark:text-[#F8FAFC]">
      <h1 className="text-3xl font-black mb-6 tracking-tight">{exam.title}</h1>

      <div className="mb-6 flex items-center gap-3 text-slate-600 dark:text-[#94A3B8] font-bold">
        <FiClock className="text-[#3B82F6]" />
        <span>
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-[#0F172A]/75 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-lg border border-slate-200 dark:border-white/10"
        >
          <h2 className="text-2xl font-black mb-8 text-slate-900 dark:text-[#F8FAFC]">
            {currentQ.questionText}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(currentQ._id, opt)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 font-medium ${
                  answers[currentQ._id] === opt
                    ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-md shadow-blue-500/20"
                    : "bg-slate-50 dark:bg-[#070B14] text-slate-700 dark:text-[#CBD5E1] border-slate-200 dark:border-white/10 hover:border-[#3B82F6]/50"
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${answers[currentQ._id] === opt ? "bg-white/20 border-white/20" : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-10">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              className="bg-slate-100 dark:bg-[#070B14] text-slate-700 dark:text-[#F8FAFC] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/5 transition-all disabled:opacity-50 border border-slate-200 dark:border-white/10"
            >
              Previous
            </button>

            <button
              onClick={() => toggleReview(currentIdx)}
              className={`px-6 py-3 rounded-xl transition-all border ${markedForReview.has(currentIdx) ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30" : "bg-slate-100 dark:bg-[#070B14] text-slate-700 dark:text-[#F8FAFC] border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/5"}`}
            >
              <FiBook />
            </button>

            <button
              disabled={currentIdx === exam.questions.length - 1}
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="bg-slate-100 dark:bg-[#070B14] text-slate-700 dark:text-[#F8FAFC] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/5 transition-all disabled:opacity-50 border border-slate-200 dark:border-white/10"
            >
              Next
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={submitExam}
        disabled={isSubmitting}
        className="mt-10 w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] text-white font-black py-5 rounded-[2rem] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 text-sm uppercase tracking-[0.2em]"
      >
        {isSubmitting ? "Submitting..." : "Submit Exam"}
      </button>
    </div>
  );
}