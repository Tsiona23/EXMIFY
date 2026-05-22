import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiChevronRight, FiPieChart, FiSearch } from "react-icons/fi";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await api.get("/results/my-results");
        setResults(res.data);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter(r => 
    r.exam?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgScore = results.length > 0 
    ? Math.round((results.reduce((acc, r) => acc + (r.score / r.totalQuestions), 0) / results.length) * 100)
    : 0;

  if (loading) return <div className="p-10 animate-pulse text-center text-slate-500 font-black uppercase tracking-widest">Aggregating records...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Certification <span className="text-primary">History</span></h1>
          <p className="text-slate-500 dark:text-[#94A3B8] font-medium">Review your past performances and detailed breakdowns</p>
        </div>
        
        <div className="bg-white dark:bg-[#0F172A]/75 border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-8 shadow-soft">
           <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] mb-1">Total Exams</p>
              <p className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">{results.length}</p>
           </div>
           <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
           <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] mb-1">Avg Score</p>
              <p className="text-2xl font-black text-[#22D3EE]">{avgScore}%</p>
           </div>
        </div>
      </div>

      <div className="relative mb-8">
        <FiSearch className="absolute left-4 top-4 text-slate-400 dark:text-[#3B82F6]/40" />
        <input 
          type="text"
          placeholder="Search by exam title..."
          className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredResults.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#0F172A]/75 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
            <FiAward className="mx-auto text-4xl text-primary/20 mb-4" />
            <p className="text-slate-500 dark:text-[#94A3B8] font-bold">No examination records found</p>
          </div>
        ) : (
          filteredResults.map((r, i) => {
            const percentage = Math.round((r.score / r.totalQuestions) * 100);
            return (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#0F172A]/75 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg hover:border-[#3B82F6]/30 transition-all group flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl border-2 ${
                     percentage >= 70 ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                     percentage >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' :
                     'bg-red-500/10 border-red-500/20 text-red-600'
                   }`}>
                     {percentage}%
                   </div>
                   <div>
                     <h2 className="text-xl font-black text-slate-900 dark:text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">{r.exam?.title}</h2>
                     <div className="flex items-center gap-4 mt-1 text-slate-500 dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1"><FiCalendar /> {new Date(r.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><FiPieChart /> {r.score}/{r.totalQuestions} Points</span>
                     </div>
                   </div>
                </div>

                <Link
                  to={`/review/${r._id}`}
                  className="w-full md:w-auto bg-[#3B82F6] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#3B82F6]/90 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Detailed Review <FiChevronRight />
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}