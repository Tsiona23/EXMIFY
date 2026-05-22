import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useNotifications } from "../hooks/useNotifications";
import { FiSun, FiMoon, FiBell, FiUser } from "react-icons/fi";

export default function Layout() {
  const { user, logout } = useAuth();
  const role = user?.role || "";
  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex bg-slate-50 dark:bg-[#070B14] min-h-screen text-slate-900 dark:text-[#F8FAFC] transition-colors duration-300">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-[#070B14]">

        {/* HEADER */}
        <header className="h-16 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">

          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8]">
            Portal /{" "}
            <span className="text-[#22D3EE] capitalize">
              {role} Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotif(v => !v);
                  setShowProfile(false);
                }}
                className="p-2 rounded-xl relative"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border rounded-xl shadow-xl z-50"
                  >
                    <div className="p-3 border-b font-bold">
                      Notifications ({unreadCount})
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 border-b cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ${
                            n.read ? "opacity-60" : "font-semibold"
                          }`}
                        >
                          <p className="text-sm">{n.title}</p>
                          <p className="text-xs opacity-70">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile(v => !v);
                  setShowNotif(false);
                }}
                className="w-10 h-10 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-lg shadow-blue-500/20 transition-transform active:scale-90"
              >
                <FiUser />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border rounded-xl shadow-xl z-50"
                  >
                    <div className="p-4 border-b">
                      <p className="font-bold capitalize">{role}</p>
                      <p className="text-xs opacity-60">Logged in user</p>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      >
                        Profile Settings
                      </button>

                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                      >
                        Account Preferences
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                        }}
                        className="w-full text-left p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 👇 IMPORTANT CHANGE */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <Outlet />
        </motion.main>

      </div>
    </div>
  );
}