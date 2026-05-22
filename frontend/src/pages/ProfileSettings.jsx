import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import api from "../services/api";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiSave, FiShield } from "react-icons/fi";

export default function ProfileSettings() {
  const { user, login } = useAuth();
  const { showNotification } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      showNotification("Error", "Name and email are required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put("/auth/profile", formData);
      
      // Synchronize updated user data into global state and localStorage
      login(res.data.user, localStorage.getItem('token'));
      
      showNotification("Success", "Profile updated successfully!", "success");
    } catch (err) {
      console.error("Profile update failed:", err);
      showNotification(
        "Error", 
        err.response?.data?.message || "Failed to update profile", 
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight"
          >
            Profile <span className="text-primary">Settings</span>
          </motion.h1>
          <p className="text-slate-500 dark:text-[#94A3B8] font-medium mt-2">
            Manage your personal identity and system-wide display settings
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0F172A]/75 rounded-[2.5rem] shadow-soft p-10 border border-slate-200 dark:border-white/10"
        >
          <div className="space-y-8">
            {/* DYNAMIC AVATAR */}
            <div className="flex items-center gap-6 mb-4">
               <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-white text-3xl font-black shadow-burgundy border-4 border-white/10">
                  {formData.name.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">{formData.name}</h3>
                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/10">
                    {user?.role || "Member"}
                  </span>
               </div>
            </div>

            <div className="grid gap-6">
              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] mb-2 ml-1">
                Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-4 text-slate-400 dark:text-primary/30 text-xl" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-[#F8FAFC] font-semibold"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] mb-2 ml-1">
                Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-4 text-slate-400 dark:text-primary/30 text-xl" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-[#F8FAFC] font-semibold"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <FiSave className="text-lg" />
                {isSaving ? "Synchronizing..." : "Update Profile"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* SECURITY INFO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 p-8 rounded-[2.5rem] bg-blue-500/5 border border-slate-200 dark:border-blue-500/10 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
             <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 text-xl"><FiShield /></div>
             <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-[#F8FAFC]">Account Integrity</h4>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">Your credentials are protected with end-to-end encryption.</p>
             </div>
          </div>
          <button 
            onClick={() => window.location.href='/settings'}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
          >
            Security Settings
          </button>
        </motion.div>
      </div>
  );
}