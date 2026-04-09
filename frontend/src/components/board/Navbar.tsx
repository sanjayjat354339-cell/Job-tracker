import { useState } from "react";
import { Briefcase, LogOut, User, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const { user, clearAuth } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-14 bg-surface-900/80 backdrop-blur-sm border-b border-white/8 flex items-center px-6 shrink-0 sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
          <Briefcase size={14} className="text-white" />
        </div>
        <span className="font-semibold tracking-tight text-sm">JobTrackr</span>
      </div>

      {/* User menu */}
      <div className="ml-auto relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/8"
        >
          <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center">
            <User size={12} className="text-brand-400" />
          </div>
          <span className="hidden sm:block">{user?.name}</span>
          <ChevronDown
            size={13}
            className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-surface-800 border border-white/10 rounded-xl shadow-2xl z-20 animate-slide-up overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  clearAuth();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
