import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import { users as usersDb, categories as categoriesDb, questions as questionsDb, attempts as attemptsDb } from '@/lib/db';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, categories: 0, questions: 0, attempts: 0, avgScore: 0 });

  useEffect(() => {
    const allAttempts = attemptsDb.getAll();
    const totalCorrect = allAttempts.reduce((s, a) => s + a.correctAnswers, 0);
    const totalQ = allAttempts.reduce((s, a) => s + a.totalQuestions, 0);

    setStats({
      users: usersDb.getAll().filter(u => u.role === 'user').length,
      categories: categoriesDb.getAll().length,
      questions: questionsDb.getAll().length,
      attempts: allAttempts.length,
      avgScore: totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Users" value={stats.users} icon="👥" />
          <StatsCard title="Categories" value={stats.categories} icon="📁" />
          <StatsCard title="Questions" value={stats.questions} icon="❓" />
          <StatsCard title="Total Attempts" value={stats.attempts} icon="📝" />
          <StatsCard title="Avg Score" value={`${stats.avgScore}%`} icon="📊" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/questions" className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all">
            <span className="text-3xl block mb-2">📝</span>
            <h3 className="text-lg font-semibold text-card-foreground">Manage Questions</h3>
            <p className="text-sm text-muted-foreground mt-1">Add, edit, or delete quiz questions</p>
          </Link>
          <Link to="/admin/categories" className="rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:border-primary/50 transition-all">
            <span className="text-3xl block mb-2">📁</span>
            <h3 className="text-lg font-semibold text-card-foreground">Manage Categories</h3>
            <p className="text-sm text-muted-foreground mt-1">Add, edit, or delete quiz categories</p>
          </Link>
        </div>

        {/* Recent Attempts */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Attempts (All Users)</h2>
          {(() => {
            const allAttempts = attemptsDb.getAll().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 20);
            const allUsers = usersDb.getAll();
            const allCats = categoriesDb.getAll();
            if (allAttempts.length === 0) return <p className="text-muted-foreground">No attempts yet.</p>;
            return (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium text-muted-foreground">User</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Score</th>
                      <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAttempts.map(a => (
                      <tr key={a.id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-3 text-foreground">{allUsers.find(u => u.id === a.userId)?.name || 'Unknown'}</td>
                        <td className="p-3 text-foreground">{allCats.find(c => c.id === a.categoryId)?.name || 'Unknown'}</td>
                        <td className="p-3 font-semibold text-foreground">{a.correctAnswers}/{a.totalQuestions}</td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">{new Date(a.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
