import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { motion } from "framer-motion";
import { FiActivity } from "react-icons/fi";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/analytics/stats");

        console.log("Analytics response:", res.data);

        setData(res.data);
      } catch (err) {
        console.error("Analytics error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading analytics...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  if (!data) {
    return <p className="text-center mt-10">No analytics data found</p>;
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-dark dark:text-beige tracking-tight flex items-center gap-3">
          <FiActivity className="text-primary" />
          System <span className="text-primary">Analytics</span>
        </h1>

        <p className="text-primary/70 dark:text-beige/70 mt-1 text-sm font-medium">
          Real-time performance metrics across all active assessments.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Exams"
          value={data.totalExams ?? 0}
        />

        <StatCard
          title="Total Submissions"
          value={data.totalResults ?? 0}
        />

        <StatCard
          title="Average Score"
          value={`${data.averageScore ?? 0}%`}
        />

        <StatCard
          title="Overall Pass Rate"
          value={`${data.passRate ?? 0}%`}
        />
      </motion.div>
    </>
  );
}