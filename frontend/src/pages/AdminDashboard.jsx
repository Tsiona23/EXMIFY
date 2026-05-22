import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiBook,
  FiUsers,
  FiBarChart2,
  FiChevronRight,
  FiTrash2,
} from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    avgScore: 0,
  });
  const { showNotification } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/exams");

        const examData = res.data || [];

        setExams(examData);

        // REAL derived stats (safe fallback)
        setStats({
          totalExams: examData.length,
          totalStudents: examData.reduce(
            (acc, e) => acc + (e.students?.length || 0),
            0
          ),
          avgScore: 0, // replace when backend supports results
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
      showNotification("Error", "Failed to load dashboard data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showNotification]);

  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam and all related candidate results?")) return;
    try {
      await api.delete(`/exams/${id}`);
      const updatedExams = exams.filter(e => e._id !== id);
      setExams(updatedExams);
      setStats({
        ...stats,
        totalExams: updatedExams.length,
        totalStudents: updatedExams.reduce((acc, e) => acc + (e.students?.length || 0), 0)
      });
      showNotification("Success", "Exam deleted successfully!", "success");
    } catch (err) {
      console.error("Dashboard delete failed:", err);
      showNotification("Error", "Failed to delete exam.", "error");
    }
  };

  const statCards = [
    {
      title: "Total Assessments",
      value: stats.totalExams,
      icon: FiBook,
    },
    {
      title: "Total Candidates",
      value: stats.totalStudents,
      icon: FiUsers,
    },
    {
      title: "Average Performance",
      value: stats.avgScore ? `${stats.avgScore}%` : "N/A",
      icon: FiBarChart2,
    },
  ];

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-black text-[#F8FAFC] tracking-tight font-['Sora']">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]">Control</span>
          </h1>
          <p className="text-sm font-bold text-[#94A3B8] uppercase tracking-[0.2em] mt-2">
            Real-time system overview
          </p>
        </div>

        <Link
          to="/admin/create-exam"
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] active:scale-95 text-sm uppercase tracking-widest"
        >
          <FiPlus /> New Exam
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-[#0F172A]/75 border border-white/5 backdrop-blur-sm shadow-soft"
          >
            <card.icon className="text-2xl mb-4 text-[#22D3EE]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mb-1">{card.title}</p>
            <p className="text-3xl font-black text-[#F8FAFC]">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="opacity-60">Loading exams...</p>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A]/75 backdrop-blur-sm shadow-soft transition-all hover:border-[#3B82F6]/30"
            >
              <div className="flex justify-between">
                <h2 className="font-black text-xl text-slate-900 dark:text-[#F8FAFC]">{exam.title}</h2>
                <span className="text-xs font-black text-[#3B82F6] uppercase tracking-widest">
                  {exam.duration} min
                </span>
              </div>

              <p className="text-sm opacity-70 mt-2">
                {exam.description}
              </p>

              <div className="flex justify-between mt-4">
                <span className="text-xs opacity-60">
                  {exam.students?.length || 0} candidates
                </span>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => deleteExam(exam._id)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                  <Link
                    to={`/admin/exam/${exam._id}/questions`}
                    className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center hover:bg-[#3B82F6] hover:text-white transition-all"
                  >
                    <FiChevronRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}