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
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-dark dark:text-beige">Available Exams</h1>
          <p className="mt-2 font-medium text-primary/70 dark:text-beige/70">
            Select an assessment to begin your certification
          </p>
        </div>
        <Link
          to="/results"
          className="flex items-center justify-center gap-2 rounded-2xl border border-beige bg-surface-light px-6 py-3 font-bold text-primary/70 shadow-soft transition-all hover:bg-beige/50 dark:border-dark dark:bg-surface-dark dark:text-beige/70 dark:hover:bg-dark/50"
        >
          <FiBookOpen /> My Results
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {exams.map((exam, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={exam._id}
            className="group relative overflow-hidden rounded-2xl border border-beige bg-surface-light p-6 shadow-soft transition-all hover:shadow-lg dark:border-dark dark:bg-surface-dark sm:p-8"
          >
            <div className="absolute -mr-16 -mt-16 h-32 w-32 rounded-bl-full bg-primary/10 transition-transform group-hover:scale-110" />

            <div className="relative z-10">
              <div className="mb-6 flex items-start justify-between">
                <div className="rounded-2xl bg-primary p-3 text-white shadow-burgundy">
                  <FiBookOpen className="text-2xl" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-beige px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary/70 dark:bg-dark dark:text-beige/70">
                  <FiClock /> {exam.duration} MINS
                </div>
              </div>

              <h2 className="mb-3 text-2xl font-bold leading-tight text-dark transition-colors group-hover:text-primary dark:text-beige">
                {exam.title}
              </h2>

              <p className="mb-8 line-clamp-2 font-medium leading-relaxed text-primary/70 dark:text-beige/70">
                {exam.description}
              </p>

              <div className="border-t border-beige pt-6 dark:border-dark">
                <Link
                  to={`/exam/${exam._id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-burgundy transition-all group-hover:-translate-y-1 hover:bg-primaryHover"
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