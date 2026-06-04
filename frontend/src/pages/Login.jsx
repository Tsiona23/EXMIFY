import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiLayers, FiShield, FiBarChart2 } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotifications();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      if (res.data && res.data.token) {
        const { token, user } = res.data;
        login(user, token);

        showNotification("Welcome Back!", `Logged in as ${user.name || user.email}.`, "success");
        const target = user.role === 'admin' ? '/admin' : '/exams';
        navigate(target, { replace: true });
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-slate-50 dark:bg-[#070B14] p-6 transition-colors duration-300 font-['Inter'] gap-12 lg:gap-24">
      
      {/* LEFT SIDE: ABOUT & SERVICES */}
      <div className="hidden lg:flex flex-col max-w-xl space-y-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FiLayers className="text-2xl" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tighter font-['Sora']">
              EXAM<span className="text-[#3B82F6]">IFY</span>
            </h1>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-[#F8FAFC] leading-[1.05] font-['Sora'] tracking-tight">
            The Future of <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#22D3EE]">Digital Assessment</span>
          </h2>
          <p className="mt-8 text-lg lg:text-xl text-slate-600 dark:text-[#94A3B8] font-medium leading-relaxed max-w-lg">
            Experience a high-performance evaluation platform featuring real-time proctoring, automated grading, and instant performance analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2rem] bg-white dark:bg-[#0F172A]/50 border border-slate-200 dark:border-white/5 backdrop-blur-sm shadow-sm"
          >
            <FiShield className="text-3xl text-[#22D3EE] mb-5" />
            <h3 className="text-sm font-black text-slate-900 dark:text-[#F8FAFC] uppercase tracking-[0.2em] mb-3">Real-time Proctoring</h3>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8] leading-relaxed font-semibold opacity-80">Active tab-tracking and strict attempt limits to maintain high academic integrity.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-[2rem] bg-white dark:bg-[#0F172A]/50 border border-slate-200 dark:border-white/5 backdrop-blur-sm shadow-sm"
          >
            <FiBarChart2 className="text-3xl text-[#8B5CF6] mb-5" />
            <h3 className="text-sm font-black text-slate-900 dark:text-[#F8FAFC] uppercase tracking-[0.2em] mb-3">Instant Feedback</h3>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8] leading-relaxed font-semibold opacity-80">Automated evaluation with comprehensive result breakdowns and analytics for students.</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#0F172A]/75 backdrop-blur-2xl p-10 lg:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-200 dark:border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]" />

        <header className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight font-['Sora']">
            Welcome <span className="text-[#22D3EE]">Back</span>
          </h1>
          <p className="text-[10px] mt-3 text-slate-500 dark:text-[#94A3B8] uppercase tracking-[0.3em] font-black">
            Enterprise Access
          </p>
        </header>

        <div className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] mb-2 ml-1">Email Identity</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-4 text-slate-400 dark:text-[#3B82F6]/40 text-xl" />
              <input
                className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="name@enterprise.com"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8]">Security Key</label>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6] hover:text-[#22D3EE] transition-colors">Forgot?</button>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-slate-400 dark:text-[#3B82F6]/40 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-4 pl-12 pr-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all font-medium placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 dark:text-slate-600 hover:text-[#3B82F6] transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </motion.div>

          <div className="flex items-center justify-between px-1 py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="peer appearance-none w-5 h-5 border-2 border-slate-200 dark:border-white/10 rounded-lg checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none w-full flex justify-center">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] group-hover:text-slate-700 dark:group-hover:text-[#F8FAFC] transition-colors">Persistent Session</span>
            </label>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
          >
            {loading ? "Authenticating..." : "Sign In"}
            <FiArrowRight />
          </motion.button>
        </div>

        <p className="text-[11px] mt-10 text-center text-slate-500 dark:text-[#94A3B8] font-bold uppercase tracking-wider">
          New to the platform?{" "}
          <Link
            to="/register"
            className="text-[#22D3EE] hover:text-[#3B82F6] transition-colors"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}