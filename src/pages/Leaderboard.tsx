import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { attempts as attemptsDb, users as usersDb, categories as categoriesDb } from '@/lib/db';
import type { LeaderboardEntry } from '@/types';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const allAttempts = attemptsDb.getAll();
    const allUsers = usersDb.getAll();
    const userMap = new Map(allUsers.map(u => [u.id, u.name]));

    const grouped: Record<string, { scores: number[]; correct: number; total: number }> = {};
    allAttempts.forEach(a => {
      if (!grouped[a.userId]) grouped[a.userId] = { scores: [], correct: 0, total: 0 };
      grouped[a.userId].scores.push(a.score);
      grouped[a.userId].correct += a.correctAnswers;
      grouped[a.userId].total += a.totalQuestions;
    });

    const lb: LeaderboardEntry[] = Object.entries(grouped).map(([userId, data]) => ({
      userId,
      userName: userMap.get(userId) || 'Unknown',
      totalScore: Math.round(data.scores.reduce((s, v) => s + v, 0) * 100) / 100,
      totalAttempts: data.scores.length,
      avgScore: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      bestScore: Math.round(Math.max(...data.scores) * 100) / 100,
    }));

    lb.sort((a, b) => b.avgScore - a.avgScore || b.totalScore - a.totalScore);
    setEntries(lb);
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">🏆 Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top performers ranked by average score</p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No quiz attempts yet. Be the first!</div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground w-16">Rank</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Avg Score</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Quizzes</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Total Points</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Best Score</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.userId} className="border-t border-border hover:bg-muted/50">
                    <td className="p-3 text-foreground font-semibold">{medals[i] || i + 1}</td>
                    <td className="p-3 text-foreground font-medium">{e.userName}</td>
                    <td className="p-3 text-foreground font-bold">{e.avgScore}%</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{e.totalAttempts}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{e.totalScore}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{e.bestScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
