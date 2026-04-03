import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import { categories as categoriesDb, attempts as attemptsDb, questions as questionsDb } from '@/lib/db';
import type { Category, QuizAttempt, DashboardStats } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [cats, setCats] = useState<Category[]>([]);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalQuizzes: 0, avgScore: 0, bestScore: 0, bestCategory: '-', totalCorrect: 0, totalQuestions: 0 });

  useEffect(() => {
    if (!user) return;
    const allCats = categoriesDb.getAll();
    setCats(allCats.map(c => ({ ...c, questionCount: questionsDb.getByCategory(c.id).length })));

    const userAttempts = attemptsDb.getByUser(user.id).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    setHistory(userAttempts);

    if (userAttempts.length > 0) {
      const totalCorrect = userAttempts.reduce((s, a) => s + a.correctAnswers, 0);
      const totalQ = userAttempts.reduce((s, a) => s + a.totalQuestions, 0);
      const avgScore = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
      const bestScore = Math.max(...userAttempts.map(a => Math.round((a.correctAnswers / a.totalQuestions) * 100)));

      // Best category
      const catScores: Record<string, { correct: number; total: number }> = {};
      userAttempts.forEach(a => {
        if (!catScores[a.categoryId]) catScores[a.categoryId] = { correct: 0, total: 0 };
        catScores[a.categoryId].correct += a.correctAnswers;
        catScores[a.categoryId].total += a.totalQuestions;
      });
      let bestCatId = '';
      let bestCatPct = 0;
      Object.entries(catScores).forEach(([id, s]) => {
        const pct = s.total > 0 ? s.correct / s.total : 0;
        if (pct > bestCatPct) { bestCatPct = pct; bestCatId = id; }
      });
      const bestCat = allCats.find(c => c.id === bestCatId);

      setStats({ totalQuizzes: userAttempts.length, avgScore, bestScore, bestCategory: bestCat?.name || '-', totalCorrect, totalQuestions: totalQ });
    }
  }, [user]);

  const getCategoryName = (id: string) => cats.find(c => c.id === id)?.name || 'Unknown';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Quizzes Taken" value={stats.totalQuizzes} icon="📝" />
          <StatsCard title="Average Score" value={`${stats.avgScore}%`} icon="📊" />
          <StatsCard title="Best Score" value={`${stats.bestScore}%`} icon="🏆" />
          <StatsCard title="Best Category" value={stats.bestCategory} icon="⭐" />
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Start a Quiz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cats.map(cat => (
              <Link
                key={cat.id}
                to={`/quiz/${cat.id}`}
                className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
              >
                <span className="text-4xl block mb-3">{cat.icon}</span>
                <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                <p className="text-xs text-muted-foreground mt-3">{cat.questionCount} questions</p>
              </Link>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Attempts</h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Score</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Correct</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Time</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 10).map(a => (
                    <tr key={a.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-3 text-foreground">{getCategoryName(a.categoryId)}</td>
                      <td className="p-3 font-semibold text-foreground">{a.score}/{a.totalQuestions}</td>
                      <td className="p-3 text-foreground hidden sm:table-cell">{a.correctAnswers}/{a.totalQuestions}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{Math.floor(a.timeTaken / 60)}m {a.timeTaken % 60}s</td>
                      <td className="p-3 text-muted-foreground">{new Date(a.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
