import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    try { 
      await api.post("/auth/register", form);

      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-beige dark:bg-dark transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-light dark:bg-surface-dark p-10 lg:p-12 rounded-3xl shadow-soft w-full max-w-md border border-beige dark:border-dark relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-dark dark:text-beige tracking-tight">
            Create Account
          </h1>
          <p className="text-primary/70 dark:text-beige/70 font-medium mt-2 text-sm uppercase tracking-widest">Join our learning community today</p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <FiUser className="absolute left-4 top-4 text-primary/50 dark:text-beige/50 text-xl" />
            <input
              className="w-full bg-white dark:bg-dark border border-beige dark:border-dark focus:ring-2 focus:ring-primary p-4 pl-12 rounded-xl transition-all font-semibold text-dark dark:text-beige outline-none"
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-primary/50 dark:text-beige/50 text-xl" />
            <input
              className="w-full bg-white dark:bg-dark border border-beige dark:border-dark focus:ring-2 focus:ring-primary p-4 pl-12 rounded-xl transition-all font-semibold text-dark dark:text-beige outline-none"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-primary/50 dark:text-beige/50 text-xl" />
            <input
              type="password"
              className="w-full bg-white dark:bg-dark border border-beige dark:border-dark focus:ring-2 focus:ring-primary p-4 pl-12 rounded-xl transition-all font-semibold text-dark dark:text-beige outline-none"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-4 rounded-xl shadow-burgundy flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            Sign Up
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-sm mt-8 text-center text-primary/70 dark:text-beige/70 font-medium">
          Already have an account?{" "}
          <Link to="/" className="text-primary font-bold hover:opacity-80 transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}