import { Search, Send, Lightbulb, ArrowRight, MousePointer2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { educationalJokes } from '@/lib/jokes';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';
import { categories as categoriesDb, attempts as attemptsDb, questions as questionsDb } from '@/lib/db';
import type { Category, QuizAttempt, DashboardStats } from '@/types';
import { motion, useScroll, useTransform } from 'framer-motion';
import CategoryIcon from '@/components/CategoryIcon';
import { useState, useEffect, useRef } from 'react';

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
    // Generate a random joke every 60 seconds
    const jokeInterval = setInterval(() => {
      setCurrentJoke(educationalJokes[Math.floor(Math.random() * educationalJokes.length)]);
    }, 60000);
    return () => clearInterval(jokeInterval);
  }, []);

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const filteredCats = cats.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map vertical scroll progress to horizontal translation
  // We'll calculate the translate amount based on the number of filtered categories
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${Math.max(0, (filteredCats.length * 300 + (filteredCats.length - 1) * 24) - (typeof window !== 'undefined' ? window.innerWidth : 1000))}px`]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h1 variants={itemVariants} className="text-4xl font-extrabold text-foreground tracking-tight">Dashboard</motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground mt-2">Welcome back, {user?.name}!</motion.p>
        </motion.div>

        {/* Top Section: Overview & Real-time */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats & Goal */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}><StatsCard title="Quizzes Taken" value={stats.totalQuizzes} icon="📝" /></motion.div>
              <motion.div variants={itemVariants}><StatsCard title="Average Score" value={`${stats.avgScore}%`} icon="📊" /></motion.div>
              <motion.div variants={itemVariants}><StatsCard title="Best Score" value={`${stats.bestScore}%`} icon="🏆" /></motion.div>
              <motion.div variants={itemVariants}><StatsCard title="Best Category" value={stats.bestCategory} icon="⭐" /></motion.div>
            </motion.div>

            {/* Programmer Joke of the Minute */}
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <motion.div variants={itemVariants} className="bg-card border-2 border-border/80 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[140px]">
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" /> Programmer Humor
                  </h3>
                  <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest">
                    Updates every min
                  </span>
                </div>
                <div className="relative z-10">
                  <motion.p 
                    key={currentJoke}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="text-foreground/80 text-md italic font-medium leading-relaxed"
                  >
                    "{currentJoke}"
                  </motion.p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Live Chat */}
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="lg:col-span-1 border-2 border-border/80 rounded-2xl bg-card shadow-sm relative flex flex-col h-[400px]">
              <div className="flex justify-between items-center p-4 border-b border-border/50 relative z-10 shrink-0">
                <h3 className="font-bold text-foreground text-lg">Global Chat</h3>
                <div className="flex items-center space-x-2 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isConnected ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isConnected ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col relative z-10" style={{ flexDirection: 'column-reverse' }}>
                <div className="flex flex-col space-y-3">
                  {chatHistory.length === 0 ? (
                    <div className="m-auto text-sm text-muted-foreground py-10">No messages yet. Be the first!</div>
                  ) : (
                    chatHistory.map((msg) => (
                      <div key={msg.id} className="flex flex-col">
                        <div className="flex items-baseline space-x-2">
                          <span className="font-bold text-xs text-primary">{msg.username}</span>
                          <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                        </div>
                        <div className="bg-muted/50 w-fit max-w-[90%] px-3 py-2 rounded-xl rounded-tl-none mt-1 shadow-sm text-sm text-card-foreground">
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <form onSubmit={sendChatMessage} className="p-3 border-t border-border/50 shrink-0 flex items-center space-x-2 z-10">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-muted/30 border border-border/60 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                />
                <button 
                  type="submit" 
                  disabled={!chatMessage.trim() || !isConnected}
                  className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
          </motion.div>
        </div>

        {/* Categories Section with Horizontal Scroll on Vertical Scroll */}
        <section ref={targetRef} className="relative h-[300vh]">
          <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
            <div className="container mx-auto px-4 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                  <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                    Start a Quiz <ArrowRight className="text-primary w-6 h-6" />
                  </motion.h2>
                  <motion.p variants={itemVariants} className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
                    <MousePointer2 className="w-3 h-3" /> Scroll down to explore subjects horizontally
                  </motion.p>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="relative w-full sm:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border-2 border-border/80 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium placeholder:text-muted-foreground/70"
                  />
                </motion.div>
              </div>
            </div>

            <div className="flex items-center">
              <motion.div style={{ x }} className="flex gap-6 px-4 cursor-grab active:cursor-grabbing">
                {filteredCats.map(cat => (
                  <motion.div 
                    key={cat.id} 
                    className="w-[300px] shrink-0"
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={`/quiz/${cat.id}`}
                      className="block h-full rounded-3xl border-2 border-border/80 bg-card p-8 hover:shadow-2xl hover:border-primary/50 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
                      <CategoryIcon 
                        icon={cat.icon} 
                        className="text-5xl h-[50px] w-auto block mb-6 drop-shadow-md transition-transform group-hover:scale-110 group-hover:-rotate-6 duration-500 origin-bottom-left" 
                      />
                      <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors tracking-tight">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed min-h-[60px] line-clamp-3">{cat.description}</p>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="inline-flex items-center text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                          {cat.questionCount} Questions
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* History */}
        {history.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="pt-6">
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-foreground mb-6">Recent Attempts</motion.h2>
            <motion.div variants={itemVariants} className="rounded-2xl border-2 border-border/80 overflow-hidden bg-card/60 backdrop-blur-md shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/80 backdrop-blur-sm border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Category</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Score</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground hidden sm:table-cell">Correct</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">Time</th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {history.slice(0, 10).map(a => (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-card-foreground">{getCategoryName(a.categoryId)}</td>
                      <td className="p-4 font-bold text-primary">{a.score}/{a.totalQuestions}</td>
                      <td className="p-4 text-card-foreground hidden sm:table-cell">{a.correctAnswers}/{a.totalQuestions}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{Math.floor(a.timeTaken / 60)}m {a.timeTaken % 60}s</td>
                      <td className="p-4 text-muted-foreground">{new Date(a.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
