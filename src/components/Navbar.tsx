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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span className="text-2xl">🧠</span>
          <span>Exam Forge</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
              )}
              <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Link to="/register" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Register</Link>
            </>
          )}
          <DarkModeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <DarkModeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Dashboard</Link>
              <Link to="/leaderboard" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Leaderboard</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Admin</Link>}
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block text-sm font-medium text-destructive">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
