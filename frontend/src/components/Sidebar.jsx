import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../hooks/useAuth";
import { FiGrid, FiBarChart2, FiBookOpen, FiAward } from "react-icons/fi";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;
  const location = useLocation();

  const links =
    role === "admin"
      ? [
          { name: "Dashboard", path: "/admin", icon: FiGrid },
          { name: "Analytics", path: "/analytics", icon: FiBarChart2 }, // ✅ works now
        ]
      : [
          { name: "Available Exams", path: "/exams", icon: FiBookOpen },
          { name: "My Results", path: "/results", icon: FiAward },
        ];

  return (
    <aside className="w-72 min-h-screen bg-slate-50 dark:bg-[#111827] text-slate-600 dark:text-[#CBD5E1] p-8 flex flex-col border-r border-slate-200 dark:border-white/[0.05] sticky top-0 transition-colors duration-300">
      <div className="mb-12 px-2">
        <h1 className="text-2xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tighter flex items-center gap-3 font-['Sora']">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            E
          </div>
          EXAM<span className="text-[#3B82F6]">IFY</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1.5 font-['Inter']">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group ${
              location.pathname === link.path
                ? "bg-[#3B82F6]/10 text-slate-900 dark:text-[#F8FAFC] shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] border-l-4 border-[#3B82F6]"
                : "text-slate-500 dark:text-[#94A3B8] hover:bg-slate-200 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-[#F8FAFC]"
            }`}
          >
            <link.icon className={`text-xl ${
              location.pathname === link.path ? "text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "group-hover:text-[#3B82F6]"
            }`} />
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="pt-8 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="mb-6 px-4 py-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/[0.03] shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#94A3B8]">Account Level</p>
          <p className="text-xs font-bold text-[#3B82F6] mt-1 capitalize">{role || 'User'}</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}