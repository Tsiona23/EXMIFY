import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 🧹 clear session
    navigate("/login"); // 🔁 back to login
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-500 dark:text-[#94A3B8] hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent active:scale-95"
    >
      <FiLogOut />
      Logout
    </button>
  );
}