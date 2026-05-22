import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications"; // Import useNotifications

export default function QuestionBuilder() {
  const { id } = useParams();

  const { showNotification } = useNotifications(); // Initialize useNotifications
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [question, setQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });
  const [isSaving, setIsSaving] = useState(false); // New loading state for save/delete operations

  // Function to fetch data, wrapped in useCallback for stability
  const fetchData = useCallback(async (signal) => { // Accept AbortSignal
    try {
      const res = await api.get(`/exams/${id}`, { signal }); // Pass signal to axios
      setExamTitle(res.data.title);
      setQuestions(res.data.questions || []);
    } catch (err) {
      if (err.name !== 'CanceledError') { // Ignore if request was cancelled due to component unmount
        console.error("Failed to fetch exam details:", err);
        showNotification("Error", "Failed to load exam details.", "error");
      }
    }
  }, [id, showNotification]);

  // LOAD EXAM + QUESTIONS
  useEffect(() => {
    const controller = new AbortController();
    const loadQuestions = async () => {
      // fetchData is already wrapped in useCallback, so it's stable.
      // Calling it here makes the linter happy by not directly calling setState in the effect body.
      await fetchData(controller.signal);
    };
    loadQuestions();
    return () => controller.abort(); // Abort the request if the component unmounts or dependencies change
  }, [fetchData]); // fetchData is stable due to useCallback

  const handleOptionChange = (index, value) => {
    const updated = [...question.options];
    updated[index] = value;
    setQuestion({ ...question, options: updated });
  };

  // SELECT QUESTION (EDIT MODE)
  const selectQuestion = (index) => {
    setSelectedIndex(index);
    setQuestion(questions[index]);
  };

  // SAVE (ADD OR UPDATE)
  const saveQuestion = async () => {
    if (
      !question.questionText ||
      !question.correctAnswer ||
      question.options.some((o) => !o)
    ) {
      showNotification("Validation Error", "Please fill all fields before saving.", "error");
      return;
    }

    setIsSaving(true); // Start loading

    try {
      let questionsToSend = [...questions];
      if (selectedIndex !== null) {
        questionsToSend[selectedIndex] = question; // UPDATE existing question
      } else {
        questionsToSend.push(question); // ADD new question
      }

      await api.put(`/exams/${id}/questions`, { // Send the updated array to backend
        questions: questionsToSend,
      });

      showNotification("Success", "Question saved successfully!", "success");
      await fetchData(); // Re-fetch data to ensure client state is in sync with backend

      // Reset form
      setQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
      setSelectedIndex(null);

    } catch (err) {
      console.error("Failed to save question:", err);
      showNotification("Error", err.response?.data?.message || "Failed to save question.", "error");
    } finally {
      setIsSaving(false); // End loading
    }
  };

  const deleteQuestion = async (index) => {
    setIsSaving(true); // Start loading

    try {
      const updatedQuestions = questions.filter((_, i) => i !== index);

      await api.put(`/exams/${id}/questions`, { // Send the updated array to backend
        questions: updatedQuestions,
      });

      showNotification("Success", "Question deleted successfully!", "success");
      await fetchData(); // Re-fetch data to ensure client state is in sync with backend

      // Reset form
      setSelectedIndex(null);
      setQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      });
    } catch (err) {
      console.error("Failed to delete question:", err);
      showNotification("Error", err.response?.data?.message || "Failed to delete question.", "error");
    } finally {
      setIsSaving(false); // End loading
    }
  };

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">

      {/* LEFT PANEL */}
      <div className="w-1/3 bg-white dark:bg-[#0F172A]/75 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg">
        <button
          onClick={() => {
            setSelectedIndex(null);
            setQuestion({
              questionText: "",
              options: ["", "", "", ""],
              correctAnswer: "",
            });
          }}
          disabled={isSaving} // Disable button while saving
          className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-black py-3 rounded-xl mb-4 transition-all shadow-lg shadow-blue-500/20"
        >
          + New Question
        </button>

        <div className="space-y-2">
          {questions.map((q, i) => (
            <div
              key={i}
              onClick={() => selectQuestion(i)}
              className={`p-3 rounded-xl cursor-pointer border ${
                selectedIndex === i
                  ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-md"
                  : "border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              {i + 1}. {q.questionText}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
            Question <span className="text-[#22D3EE]">Builder</span>
          </h1>
          <p className="text-slate-500 dark:text-[#94A3B8] font-medium mt-1">
            Exam: <b className="text-[#3B82F6]">{examTitle}</b>
          </p>
        </div>

        <motion.div className="bg-white dark:bg-[#0F172A]/75 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl">

          {/* QUESTION */}
          <textarea
            className="w-full p-3 border rounded-xl mb-4"
            placeholder="Question text"
            value={question.questionText}
            onChange={(e) =>
              setQuestion({ ...question, questionText: e.target.value })
            }
          />

          {/* OPTIONS */}
          {question.options.map((opt, i) => (
            <input
              key={i}
              className="w-full p-3 border rounded-xl mb-2"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
            />
          ))}

          {/* CORRECT */}
          <input
            className="w-full p-3 border rounded-xl mb-4"
            placeholder="Correct Answer"
            value={question.correctAnswer}
            onChange={(e) =>
              setQuestion({ ...question, correctAnswer: e.target.value })
            }
          />

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={saveQuestion}
              disabled={isSaving} // Disable button while saving
              className="flex-1 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              {isSaving ? "Saving..." : <><FiPlus /> Save</>}
            </button>

            {selectedIndex !== null && (
              <button
                onClick={() => deleteQuestion(selectedIndex)}
                disabled={isSaving} // Disable button while saving
                className="bg-red-500 text-white px-4 rounded-xl"
              >
                <FiTrash2 />
              </button>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}