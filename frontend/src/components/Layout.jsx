import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useNotifications } from "../hooks/useNotifications";
import { FiSun, FiMoon, FiBell, FiUser, FiMenu } from "react-icons/fi";

export default function Layout() {
  const { user, logout } = useAuth();
  const role = user?.role || "";
  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-300 overflow-x-hidden">
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#070B14] min-h-screen md:ml-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-[#0F172A]/80 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
              aria-label="Open menu"
            >
              <FiMenu />
            </button>

            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8]">
              Portal /{" "}
              <span className="text-[#22D3EE] capitalize">{role} Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-xl bg-slate-100 p-2 dark:bg-slate-800"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setShowNotif((v) => !v);
                  setShowProfile(false);
                }}
                className="relative rounded-xl p-2"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 z-50 mt-3 w-72 rounded-xl border bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:w-80"
                  >
                    <div className="border-b p-3 font-bold">Notifications ({unreadCount})</div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`cursor-pointer border-b p-4 hover:bg-slate-100 dark:hover:bg-slate-800 ${
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

            <div className="relative">
              <button
                onClick={() => {
                  setShowProfile((v) => !v);
                  setShowNotif(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20 transition-transform active:scale-90"
              >
                <FiUser />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 z-50 mt-3 w-64 rounded-xl border bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="border-b p-4">
                      <p className="font-bold capitalize">{role}</p>
                      <p className="text-xs opacity-60">Logged in user</p>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full rounded p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Profile Settings
                      </button>

                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full rounded p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Account Preferences
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                        }}
                        className="w-full rounded p-2 text-left text-red-500 hover:bg-red-50"
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

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}