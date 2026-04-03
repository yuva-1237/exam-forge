import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-6xl mb-6">🧠</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Master Any Subject with
            <span className="text-primary"> MCQ Pro</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A production-grade quiz platform with timed exams, instant scoring, leaderboards, and comprehensive analytics. Built for serious learners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard" className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-lg font-semibold text-foreground hover:bg-accent transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: '⏱️', title: 'Timed Exams', desc: 'Real exam conditions with countdown timer and auto-submit' },
            { icon: '📊', title: 'Instant Analytics', desc: 'Detailed score breakdown, history tracking, and performance trends' },
            { icon: '🏆', title: 'Leaderboard', desc: 'Compete with others and track your ranking across categories' },
            { icon: '🔒', title: 'Anti-Cheat', desc: 'Tab-switch detection with warnings to maintain exam integrity' },
            { icon: '🎯', title: 'Difficulty Levels', desc: 'Easy, medium, and hard questions with negative marking support' },
            { icon: '🌙', title: 'Dark Mode', desc: 'Study comfortably day or night with full theme support' },
          ].map(f => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 text-center hover:shadow-md transition-shadow">
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>MCQ Pro — Self-contained quiz platform. Admin: admin@mcq.com / Admin123!</p>
      </footer>
    </div>
  );
}
