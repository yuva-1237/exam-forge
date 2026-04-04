import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none">
      <div className="container mx-auto max-w-7xl pointer-events-auto">
        <div className="glass rounded-2xl flex h-16 items-center justify-between px-6 border-white/5 shadow-2xl">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl transition-all hover:opacity-80">
            <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">🧠</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
              Exam Forge
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/leaderboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Leaderboard</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Admin</Link>
                )}
                <div className="h-4 w-[1px] bg-white/10 mx-2" />
                <span className="text-sm text-white/50">Hi, <span className="text-white font-semibold">{user.name}</span></span>
                <button onClick={handleLogout} className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all">
                  Register
                </Link>
              </>
            )}
            <div className="h-4 w-[1px] bg-white/10" />
            <DarkModeToggle />
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <DarkModeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white/70 hover:text-white">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 glass rounded-2xl p-4 space-y-4 border-white/5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-white/70 hover:text-white">Dashboard</Link>
                <Link to="/leaderboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-white/70 hover:text-white">Leaderboard</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-white/70 hover:text-white">Admin</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block text-sm font-medium text-destructive">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-white/70 hover:text-white">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-primary">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
