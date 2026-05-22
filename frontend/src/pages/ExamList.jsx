import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlay, FiClock, FiBookOpen, FiChevronRight } from "react-icons/fi";

export default function ExamList() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      const res = await api.get("/exams");
      setExams(res.data);
    };

    fetchExams();
  }, []);

  return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-dark dark:text-beige tracking-tight">Available Exams</h1>
            <p className="text-primary/70 dark:text-beige/70 mt-2 font-medium">Select an assessment to begin your certification</p>
          </div>
          <Link to="/results" className="bg-surface-light dark:bg-surface-dark border border-beige dark:border-dark text-primary/70 dark:text-beige/70 px-6 py-3 rounded-2xl shadow-soft hover:bg-beige/50 dark:hover:bg-dark/50 transition-all font-bold flex items-center gap-2">
            <FiBookOpen /> My Results
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {exams.map((exam, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={exam._id}
              className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border border-beige dark:border-dark shadow-soft hover:shadow-lg transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-primary text-white p-3 rounded-2xl shadow-burgundy">
                    <FiBookOpen className="text-2xl" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-beige dark:bg-dark px-4 py-1.5 rounded-full text-xs font-bold text-primary/70 dark:text-beige/70 uppercase tracking-widest">
                    <FiClock /> {exam.duration} MINS
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-dark dark:text-beige mb-3 group-hover:text-primary transition-colors leading-tight">
                  {exam.title}
                </h2>
                
                <p className="text-primary/70 dark:text-beige/70 mb-8 line-clamp-2 leading-relaxed font-medium">
                  {exam.description}
                </p>

                <div className="pt-6 border-t border-beige dark:border-dark">
                  <Link
                    to={`/exam/${exam._id}`}
                    className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform group-hover:-translate-y-1 shadow-burgundy"
                  >
                    <FiPlay /> Start Assessment <FiChevronRight />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
  );
}