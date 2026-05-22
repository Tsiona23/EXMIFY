import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function Review() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      const res = await api.get(`/results/${id}`);
      setResult(res.data);
    };

    fetchResult();
  }, [id]);

  if (!result) return <div className="p-10 animate-pulse text-gray-400">Loading Review...</div>;
  
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-soft border border-beige dark:border-dark mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-dark dark:text-beige leading-tight tracking-tight">
                Review: <span className="text-primary">{result.exam.title}</span>
              </h1>
              <p className="text-primary/70 dark:text-beige/70 font-medium mt-1">Detailed performance analysis</p>
            </div>
            <div className="bg-beige dark:bg-dark px-8 py-4 rounded-3xl text-center border border-primary/10 dark:border-beige/10">
              <p className="text-xs font-bold text-primary/70 dark:text-beige/70 uppercase tracking-widest mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary dark:text-beige">{result.score}<span className="text-primary/30 dark:text-beige/30 text-2xl mx-1">/</span>{result.totalQuestions}</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {result.answers.map((a, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-surface-light dark:bg-surface-dark p-8 rounded-2xl border-2 shadow-sm ${
                a.isCorrect ? "border-emerald-200 dark:border-emerald-800" : "border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-dark dark:text-beige">
                  Question {index + 1}
                </h3>
                <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  a.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}>
                  {a.isCorrect ? <FiCheckCircle /> : <FiXCircle />}
                  {a.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Correct Solution</p>
                  <p className="text-emerald-700 dark:text-emerald-300 font-bold text-lg leading-snug">{a.correctAnswer}</p>
                </div>

                <div className={`${a.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'} p-5 rounded-2xl border`}>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${a.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                    Your Response
                  </p>
                  <p className={`font-bold text-lg leading-snug ${a.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                    {a.selectedAnswer || "No answer provided"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}