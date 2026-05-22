import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiBook, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

export default function AdminExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotifications();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get("/exams");
        setExams(res.data);
      } catch (err) {
        console.error("Failed to fetch exams", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this whole assessment? This action cannot be undone.")) return;
    try {
      await api.delete(`/exams/${id}`);
      setExams(exams.filter(exam => exam._id !== id));
      showNotification("Success", "Exam deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete exam", err);
      showNotification("Error", "Failed to delete exam.", "error");
    }
  };

  if (loading) return <div className="p-10 animate-pulse text-[#3B82F6]/30 font-black uppercase tracking-widest text-center">Synchronizing Library...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-10 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tighter">Assessment <span className="text-[#22D3EE]">Inventory</span></h1>
          <p className="text-slate-500 dark:text-[#94A3B8] font-bold uppercase text-[10px] tracking-widest">Manage and monitor your assessment content</p>
        </div>
        <Link
          to="/admin/create-exam"
          className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white px-8 py-4 rounded-3xl shadow-xl shadow-blue-500/20 flex items-center gap-2 font-black transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <FiPlus /> Create Exam
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-[#0F172A] rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/5">
            <FiBook className="mx-auto text-4xl text-[#3B82F6]/20 mb-4" />
            <p className="text-slate-500 dark:text-[#94A3B8] font-bold">No exams created yet.</p>
          </div>
        ) : (
          exams.map((exam, i) => (
            <motion.div
              key={exam._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#0F172A]/75 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl hover:border-[#3B82F6]/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B82F6]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="mb-4">
                <span className="bg-[#3B82F6]/10 text-[#22D3EE] text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/5">
                  {exam.duration}m Duration
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] mb-3 group-hover:text-[#22D3EE] transition-colors leading-tight">{exam.title}</h2>
              <p className="text-slate-600 dark:text-[#94A3B8] text-sm line-clamp-2 mb-8 font-medium leading-relaxed">{exam.description}</p>
              
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-white/5">
                <Link
                  to={`/admin/exam/${exam._id}/questions`}
                  className="flex-1 bg-[#3B82F6] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-[#3B82F6]/80 transition-all shadow-lg shadow-blue-500/10"
                >
                  <FiEdit /> Manage Questions
                </Link>
                <button
                  onClick={() => handleDelete(exam._id)}
                  className="bg-red-500/10 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}