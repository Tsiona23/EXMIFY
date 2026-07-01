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
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between lg:mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl font-['Sora']">
            System <span className="bg-gradient-to-r from-[#3B82F6] to-[#22D3EE] bg-clip-text text-transparent">Control</span>
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-[#94A3B8]">
            Real-time system overview
          </p>
        </div>

        <Link
          to="/admin/create-exam"
          className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] active:scale-95 sm:w-auto sm:px-8 lg:px-10 lg:py-5"
        >
          <FiPlus /> New Exam
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[1.5rem] border border-white/5 bg-[#0F172A]/75 p-6 shadow-soft backdrop-blur-sm sm:rounded-[2rem] sm:p-8"
          >
            <card.icon className="mb-4 text-2xl text-[#22D3EE]" />
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">{card.title}</p>
            <p className="text-3xl font-black text-[#F8FAFC]">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <p className="opacity-60">Loading exams...</p>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft transition-all hover:border-[#3B82F6]/30 dark:border-white/10 dark:bg-[#0F172A]/75 sm:rounded-[2rem] sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-[#F8FAFC]">{exam.title}</h2>
                <span className="text-xs font-black uppercase tracking-widest text-[#3B82F6]">
                  {exam.duration} min
                </span>
              </div>

              <p className="mt-2 text-sm opacity-70">{exam.description}</p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs opacity-60">{exam.students?.length || 0} candidates</span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => deleteExam(exam._id)}
                    className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                  <Link
                    to={`/admin/exam/${exam._id}/questions`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] transition-all hover:bg-[#3B82F6] hover:text-white"
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