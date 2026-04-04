import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { attempts as attemptsDb, users as usersDb } from '@/lib/db';
import type { LeaderboardEntry } from '@/types';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    <div className="min-h-screen bg-background relative overflow-hidden pb-20">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 space-y-12 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none mb-4">
             Hall of <span className="text-primary text-glow">Forgers</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted-foreground font-light text-lg">
             The absolute elite ranked by precision and consistency.
          </motion.p>
        </motion.div>

        {entries.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-muted-foreground/20 italic font-light text-xl">
             No transmissions recorded yet.
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background/20 border-b border-border/10">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 w-24">Rank</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Candidate</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Efficiency</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 hidden sm:table-cell text-center">Track Count</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 hidden md:table-cell">Total Kinetic Points</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 hidden md:table-cell">Peak Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {entries.map((e, i) => (
                    <motion.tr 
                      key={e.userId} 
                      variants={itemVariants}
                      className="hover:bg-foreground/[0.02] transition-colors group"
                    >
                      <td className="p-6 font-black text-2xl text-muted-foreground/20 group-hover:text-primary transition-colors">
                        {medals[i] || `${i + 1}.`}
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                           <span className="font-bold text-foreground group-hover:text-glow transition-all text-lg">{e.userName}</span>
                           <span className="text-[10px] text-muted-foreground/20 uppercase font-black tracking-tighter">Verified Agent</span>
                        </div>
                      </td>
                      <td className="p-6">
                         <div className="flex items-center gap-4">
                            <span className="font-black text-2xl text-primary text-glow">{e.avgScore}%</span>
                            <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden hidden lg:block">
                               <div className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" style={{ width: `${e.avgScore}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="p-6 text-center text-muted-foreground/40 font-bold hidden sm:table-cell">
                         {e.totalAttempts}
                      </td>
                      <td className="p-6 text-muted-foreground/40 font-medium hidden md:table-cell">
                         {e.totalScore.toLocaleString()} pts
                      </td>
                      <td className="p-6 text-muted-foreground/20 font-black text-xs hidden md:table-cell">
                         {e.bestScore}% PEAK
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
