import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Send, Lightbulb } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { educationalJokes } from '@/lib/jokes';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import { categories as categoriesDb, attempts as attemptsDb, questions as questionsDb } from '@/lib/db';
import type { Category, QuizAttempt, DashboardStats } from '@/types';
import { motion } from 'framer-motion';
import CategoryIcon from '@/components/CategoryIcon';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [cats, setCats] = useState<Category[]>([]);
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalQuizzes: 0, avgScore: 0, bestScore: 0, bestCategory: '-', totalCorrect: 0, totalQuestions: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time Chat States
  const [chatHistory, setChatHistory] = useState<{id: string, username: string, text: string, time: string}[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    newSocket.on('chat_history', (historyList) => {
      setChatHistory(historyList);
    });

    newSocket.on('receive_message', (msg) => {
      setChatHistory(prev => {
        const updated = [...prev, msg];
        return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !socket) return;
    socket.emit('send_message', { username: user?.name, text: chatMessage.trim() });
    setChatMessage('');
  };

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

  const [currentJoke, setCurrentJoke] = useState(educationalJokes[0]);

  useEffect(() => {
    const jokeInterval = setInterval(() => {
      setCurrentJoke(educationalJokes[Math.floor(Math.random() * educationalJokes.length)]);
    }, 60000);
    return () => clearInterval(jokeInterval);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 space-y-12">
        
        {/* Welcome Block */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              Welcome, <span className="text-primary text-glow">{user?.name}</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-muted-foreground mt-3 font-light text-lg">
              Here is what's happening with your learning journey.
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="flex gap-3">
             <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border-border/10 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Live</span>
             </div>
          </motion.div>
        </motion.div>

        {/* Bento Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          
          {/* Stats Grid - 4x1 Bento */}
          <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between">
              <span className="text-3xl">📝</span>
              <div>
                <div className="text-3xl font-black text-foreground leading-none mb-1">{stats.totalQuizzes}</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30">Total Quizzes</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between">
              <span className="text-3xl">📊</span>
              <div>
                <div className="text-3xl font-black text-foreground leading-none mb-1">{stats.avgScore}%</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30">Avg. Accuracy</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="text-3xl font-black text-foreground leading-none mb-1">{stats.bestScore}%</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30">Best Score</div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-3xl flex flex-col justify-between overflow-hidden">
              <span className="text-3xl">⭐</span>
              <div>
                <div className="text-xl font-black text-foreground leading-tight mb-1 truncate">{stats.bestCategory}</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30">Top Subject</div>
              </div>
            </motion.div>
          </div>

          {/* Programmer Humor - 4x1 Bento */}
          <motion.div variants={itemVariants} className="md:col-span-4 glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-center min-h-[160px] group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Lightbulb className="w-20 h-20 text-foreground" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Daily Humor
              </span>
            </div>
            <motion.p 
              key={currentJoke}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-foreground/80 text-lg font-medium italic leading-relaxed relative z-10"
            >
              "{currentJoke}"
            </motion.p>
          </motion.div>

          {/* Global Chat - Vertical Large Bento */}
          <motion.div variants={itemVariants} className="md:col-span-4 glass-card rounded-3xl flex flex-col h-[500px] order-2 md:order-1">
            <div className="p-6 border-b border-border/10 flex justify-between items-center bg-background/20 rounded-t-3xl">
              <h3 className="font-black text-foreground uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                Live Network
              </h3>
              <span className="text-[10px] text-muted-foreground/50 font-bold">{isConnected ? 'ONLINE' : 'CONNECTING...'}</span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col-reverse custom-scrollbar">
               <div className="flex flex-col space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="m-auto text-sm text-muted-foreground/20 italic font-light">No active transmissions...</div>
                  ) : (
                    chatHistory.map((msg) => (
                      <div key={msg.id} className="group">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-[10px] text-primary group-hover:text-glow transition-all uppercase tracking-tighter">{msg.username}</span>
                          <span className="text-[9px] text-muted-foreground/30">{msg.time}</span>
                        </div>
                        <div className="bg-background/40 border border-border/10 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm text-foreground/70 leading-relaxed shadow-sm">
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
            <form onSubmit={sendChatMessage} className="p-4 border-t border-border/10 bg-background/20 rounded-b-3xl">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Broadcast message..."
                  className="w-full bg-background/50 border border-border/20 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-primary/40 focus:bg-background/60 transition-all text-foreground placeholder:text-muted-foreground/30 shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={!chatMessage.trim() || !isConnected}
                  className="absolute right-2 bg-primary text-white p-2 px-4 rounded-xl hover:bg-primary/80 disabled:opacity-30 transition-all font-bold text-xs shadow-lg"
                >
                  SEND
                </button>
              </div>
            </form>
          </motion.div>

          {/* Start a Quiz - Main Feature Bento */}
          <motion.div variants={itemVariants} className="md:col-span-8 space-y-6 order-1 md:order-2">
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
              <h2 className="text-3xl font-black text-foreground tracking-tight">Available Forging Tracks</h2>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <input
                  type="text"
                  placeholder="Filter subjects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background/40 border border-border/10 rounded-2xl text-sm focus:outline-none focus:border-primary/30 transition-all text-foreground placeholder:text-muted-foreground/30 font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(cat => (
                <motion.div key={cat.id} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link
                    to={`/quiz/${cat.id}`}
                    className="block h-full glass-card rounded-3xl p-8 group relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all transform scale-150 group-hover:scale-[1.7] rotate-12">
                      <CategoryIcon icon={cat.icon} className="w-24 h-24" />
                    </div>
                    <CategoryIcon 
                      icon={cat.icon} 
                      className="text-5xl h-[48px] w-auto block mb-6 drop-shadow-2xl transition-transform group-hover:scale-110 group-hover:-rotate-6 duration-500 origin-left" 
                    />
                    <h3 className="text-2xl font-black text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-muted-foreground text-sm font-light leading-relaxed line-clamp-2">{cat.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase bg-primary/20 text-primary px-3 py-1 rounded-full">{cat.questionCount} Qs</span>
                       <span className="text-[10px] font-black uppercase text-muted-foreground/40 group-hover:text-primary transition-all">Start Track →</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* History Table - Wide Bottom Bento */}
        {history.length > 0 && (
          <motion.div variants={itemVariants} className="pt-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-8">Archived Chronicles</h2>
            <div className="glass-card rounded-[2.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background/40 border-b border-border/10">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Category</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Performance</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 hidden sm:table-cell">Metrics</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 hidden md:table-cell">Duration</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {history.slice(0, 8).map(a => (
                      <tr key={a.id} className="hover:bg-foreground/[0.02] transition-colors group">
                        <td className="p-6 font-bold text-foreground group-hover:text-primary transition-colors">{getCategoryName(a.categoryId)}</td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-xl text-glow text-foreground">{Math.round((a.correctAnswers/a.totalQuestions)*100)}%</span>
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden hidden sm:block">
                              <div className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" style={{ width: `${(a.correctAnswers/a.totalQuestions)*100}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-muted-foreground font-light hidden sm:table-cell">{a.correctAnswers} / {a.totalQuestions} Hits</td>
                        <td className="p-6 text-muted-foreground font-light hidden md:table-cell">{Math.floor(a.timeTaken / 60)}m {a.timeTaken % 60}s</td>
                        <td className="p-6 text-muted-foreground/40 font-bold text-xs">{new Date(a.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
