import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../hooks/useAuth";
import { FiGrid, FiBarChart2, FiBookOpen, FiAward, FiX } from "react-icons/fi";

export default function Sidebar({ mobileOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role;
  const location = useLocation();

  const links =
    role === "admin"
      ? [
          { name: "Dashboard", path: "/admin", icon: FiGrid },
          { name: "Analytics", path: "/analytics", icon: FiBarChart2 },
        ]
      : [
          { name: "Available Exams", path: "/exams", icon: FiBookOpen },
          { name: "My Results", path: "/results", icon: FiAward },
        ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-slate-50 p-6 text-slate-600 shadow-2xl transition-transform duration-300 dark:border-white/[0.05] dark:bg-[#111827] dark:text-[#CBD5E1] md:sticky md:h-auto md:translate-x-0 md:min-h-screen md:shadow-none md:p-8 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-center justify-between px-2 md:mb-12">
        <h1 className="flex items-center gap-3 text-2xl font-black tracking-tighter text-slate-900 dark:text-[#F8FAFC] font-['Sora']">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            E
          </div>
          EXAM<span className="text-[#3B82F6]">IFY</span>
        </h1>
        <button
          onClick={onClose}
          className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          aria-label="Close menu"
        >
          <FiX />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 font-['Inter']">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-300 group ${
              location.pathname === link.path
                ? "border-l-4 border-[#3B82F6] bg-[#3B82F6]/10 text-slate-900 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] dark:text-[#F8FAFC]"
                : "text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-white/[0.03] dark:hover:text-[#F8FAFC]"
            }`}
          >
            <link.icon
              className={`text-xl ${
                location.pathname === link.path
                  ? "text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  : "group-hover:text-[#3B82F6]"
              }`}
            />
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-200 pt-6 dark:border-white/[0.05]">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/[0.03] dark:bg-[#0F172A]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-[#94A3B8]">
            Account Level
          </p>
          <p className="mt-1 text-xs font-bold capitalize text-[#3B82F6]">{role || "User"}</p>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}