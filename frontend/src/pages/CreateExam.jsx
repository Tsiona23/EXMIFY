import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiType, FiAlignLeft, FiClock, FiRotateCcw } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

export default function CreateExam() {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();

  const [exam, setExam] = useState({
    title: "",
    description: "",
    duration: "",
    attemptsAllowed: 1,
  });

  const createExam = async () => { // Changed to async function
    try {
      const res = await api.post(
        "/exams",
        {
          ...exam,
          questions: [], // Initialize with empty questions array
        }
      );
      showNotification("Success", `Exam "${res.data.exam.title}" created!`, "success");
      navigate("/admin");
    } catch (err) {
      console.error("Failed to create exam:", err);
      showNotification("Error", err.response?.data?.message || "Failed to create exam.", "error");
    }
  };

  return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">Create New Exam</h1>
          <p className="text-slate-500 dark:text-[#94A3B8] font-medium">Define the core details of your assessment</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#0F172A]/75 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-lg border border-slate-200 dark:border-white/10"
        >
          <div className="space-y-8">
            <div className="relative">
              <label className="block text-xs font-black text-slate-500 dark:text-[#94A3B8] uppercase tracking-widest mb-3 ml-1">Exam Title</label>
              <div className="relative">
                <FiType className="absolute left-4 top-4 text-slate-400 dark:text-[#94A3B8] text-xl" />
                <input
                  className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#3B82F6] p-4 pl-12 rounded-xl transition-all text-lg font-bold text-slate-900 dark:text-[#F8FAFC] outline-none"
                  placeholder="e.g. Advanced JavaScript Certification"
                  value={exam.title}
                  onChange={(e) => setExam({ ...exam, title: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-black text-slate-500 dark:text-[#94A3B8] uppercase tracking-widest mb-3 ml-1">Description</label>
              <div className="relative">
                <FiAlignLeft className="absolute left-4 top-4 text-slate-400 dark:text-[#94A3B8] text-xl" />
                <textarea
                  className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#3B82F6] p-4 pl-12 rounded-xl transition-all font-medium text-slate-900 dark:text-[#F8FAFC] outline-none"
                  placeholder="What should students expect from this exam?"
                  rows="4"
                  value={exam.description}
                  onChange={(e) => setExam({ ...exam, description: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-black text-slate-500 dark:text-[#94A3B8] uppercase tracking-widest mb-3 ml-1">Time Limit (Minutes)</label>
              <div className="relative">
                <FiClock className="absolute left-4 top-4 text-slate-400 dark:text-[#94A3B8] text-xl" />
                <input
                  type="number"
                  className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#3B82F6] p-4 pl-12 rounded-xl transition-all text-lg font-bold text-slate-900 dark:text-[#F8FAFC] outline-none"
                  placeholder="60"
                  value={exam.duration}
                  onChange={(e) => setExam({ ...exam, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-black text-slate-500 dark:text-[#94A3B8] uppercase tracking-widest mb-3 ml-1">Attempts Allowed</label>
              <div className="relative">
                <FiRotateCcw className="absolute left-4 top-4 text-slate-400 dark:text-[#94A3B8] text-xl" />
                <input
                  type="number"
                  className="w-full bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-[#3B82F6] p-4 pl-12 rounded-xl transition-all text-lg font-bold text-slate-900 dark:text-[#F8FAFC] outline-none"
                  placeholder="1"
                  value={exam.attemptsAllowed}
                  onChange={(e) => setExam({ ...exam, attemptsAllowed: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <button
              onClick={createExam}
              className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95 text-lg"
            >
              <FiPlus className="text-2xl" /> Initialize Exam
            </button>
          </div>
        </motion.div>
      </div>
  );
}