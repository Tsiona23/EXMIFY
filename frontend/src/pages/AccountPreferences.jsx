import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { motion } from "framer-motion";
import { 
  FiUser, FiMail, FiLock, FiShield,
  FiBell, FiMoon, FiSun, FiTrash2,
  FiSave, FiLogOut
} from "react-icons/fi";

export default function AccountPreferences() {
  const { user, logout, login } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { showNotification } = useNotifications();

  // PROFILE STATE
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // SECURITY STATE
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // NOTIFICATION SETTINGS
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put("/auth/profile", profile);
      // Synchronize updated user data into global state and localStorage
      login(res.data.user, localStorage.getItem('token'));
      showNotification("Success", "Profile information updated.", "success");
    } catch (err) {
      showNotification("Error", err.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwords.new || !passwords.confirm) {
      return showNotification("Error", "New password and confirmation are required.", "error");
    }
    if (passwords.new !== passwords.confirm) {
      return showNotification("Error", "Passwords do not match.", "error");
    }
    setIsSaving(true);
    try {
      await api.put("/auth/password", { password: passwords.new });
      showNotification("Success", "Password updated successfully.", "success");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      showNotification("Error", err.response?.data?.message || "Failed to update password.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">Account <span className="text-primary">Preferences</span></h1>
        <p className="text-slate-500 dark:text-[#94A3B8] font-medium">Manage your digital identity and security settings</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        
        {/* IDENTITY SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0F172A]/75 border border-slate-200 dark:border-white/10 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary text-xl"><FiUser /></div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">Identity</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] ml-1">Display Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-4 text-slate-400 dark:text-primary/30" />
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] focus:ring-2 focus:ring-primary transition-all outline-none"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] ml-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-slate-400 dark:text-primary/30" />
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] focus:ring-2 focus:ring-primary transition-all outline-none"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
            <div className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-tighter">Current Role: <span className="text-[#22D3EE]">{user?.role}</span></div>
            <button 
              onClick={handleUpdateProfile}
              disabled={isSaving}
              className="bg-[#3B82F6] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#3B82F6]/90 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              <FiSave /> {isSaving ? "Saving..." : "Save Identity"}
            </button>
          </div>
        </motion.section>

        {/* SECURITY SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0F172A]/75 border border-slate-200 dark:border-white/10 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 text-xl"><FiShield /></div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC]">Security</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "New Password", key: "new" },
              { label: "Confirm Password", key: "confirm" }
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] ml-1">{field.label}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-4 text-slate-400 dark:text-primary/30" />
                  <input
                    type="password"
                    className="w-full p-4 pl-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-[#F8FAFC] focus:ring-2 focus:ring-primary transition-all outline-none"
                    placeholder="••••••••"
                    value={passwords[field.key]}
                    onChange={(e) => setPasswords({ ...passwords, [field.key]: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-end">
              <button 
                onClick={handleUpdatePassword}
                disabled={isSaving}
                className="w-full bg-slate-900 dark:bg-beige text-beige dark:text-slate-900 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </motion.section>

        {/* PREFERENCES SECTION */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0F172A]/75 border border-slate-200 dark:border-white/10 shadow-soft"
          >
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 text-xl"><FiBell /></div>
                 <h3 className="font-black text-slate-900 dark:text-[#F8FAFC]">Global Alerts</h3>
               </div>
               <button 
                onClick={() => setNotifEnabled(!notifEnabled)}
                className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${notifEnabled ? 'bg-green-500' : 'bg-primary/20'}`}
               >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${notifEnabled ? 'left-7' : 'left-1'}`} />
               </button>
             </div>
             <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8] leading-relaxed">Receive real-time system notifications for new exams and grading results.</p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="p-8 rounded-[2.5rem] bg-white dark:bg-[#0F172A]/75 border border-slate-200 dark:border-white/10 shadow-soft"
          >
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-primary/10 rounded-2xl text-primary text-xl">
                    {darkMode ? <FiSun className="text-amber-500" /> : <FiMoon />}
                 </div>
                 <h3 className="font-black text-slate-900 dark:text-[#F8FAFC]">Interface Mode</h3>
               </div>
               <button 
                onClick={toggleTheme}
                className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
               >
                 Toggle {darkMode ? 'Light' : 'Dark'}
               </button>
             </div>
             <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8] leading-relaxed">Switch between light and dark visual themes to reduce eye strain.</p>
          </motion.div>
        </div>

        {/* DANGER ZONE */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-[2.5rem] bg-red-500/5 border border-slate-200 dark:border-red-500/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-black text-red-600 flex items-center gap-2">
                <FiTrash2 /> Dangerous Area
              </h2>
              <p className="text-red-600/60 text-xs font-medium mt-1">Actions here are irreversible. Manage with caution.</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-slate-500 dark:text-beige font-black text-[10px] uppercase tracking-widest hover:underline"
              >
                <FiLogOut /> Sign Out
              </button>
              <button className="bg-red-500 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95">
                Delete Account
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}