import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>
      
      <Navbar />

      {/* Hero Section */}
      <section className="container relative z-10 flex flex-col items-center justify-center min-h-screen mx-auto px-4 pt-32 pb-20 text-center">
        <motion.div 
          className="max-w-5xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants} 
            className="relative mb-12 group"
          >
            <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150 opacity-50 group-hover:opacity-80 transition-opacity" />
            <span className="relative text-8xl md:text-9xl block drop-shadow-2xl hover:scale-110 transition-transform cursor-default duration-500">
              🧠
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tight mb-8 leading-[1.1]"
          >
            Master Every Subject with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-indigo-400 mt-2 pb-2 text-glow">
              Exam Forge
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            The world's most immersive quiz platform. Timed exams, real-time community, and deep analytics designed for the modern learner.
          </motion.p>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
          >
            {user ? (
              <Link to="/dashboard" className="glass px-12 py-5 rounded-2xl text-xl font-bold text-foreground hover:bg-foreground/5 hover:scale-105 transition-all shadow-xl dark:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                Enter Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-primary px-12 py-5 rounded-2xl text-xl font-bold text-white shadow-xl dark:shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:bg-primary/90 hover:scale-105 transition-all">
                  Get Started Free
                </Link>
                <Link to="/login" className="glass px-12 py-5 rounded-2xl text-xl font-bold text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all border-border/10">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Features Grid */}
      <section className="container mx-auto px-4 py-32 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { icon: '⏱️', title: 'Timed Exams', desc: 'Real conditions with auto-submit.', col: 'md:col-span-3' },
            { icon: '📊', title: 'Analytics', desc: 'Detailed score breakdown & trends.', col: 'md:col-span-3' },
            { icon: '🏆', title: 'Leaderboard', desc: 'Rank against the community.', col: 'md:col-span-2' },
            { icon: '💬', title: 'Live Chat', desc: 'Real-time global study community.', col: 'md:col-span-4' },
            { icon: '🎯', title: 'Subjects', desc: '20+ specialized quiz categories.', col: 'md:col-span-3' },
            { icon: '🔒', title: 'Anti-Cheat', desc: 'Active tab tracking & warnings.', col: 'md:col-span-3' },
          ].map((f) => (
            <motion.div 
              key={f.title} 
              variants={itemVariants}
              className={`${f.col} glass-card rounded-3xl p-8 flex flex-col items-center text-center group`}
            >
              <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{f.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-3 text-glow">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/5 py-20 text-center relative z-10">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          Exam Forge — Premium Education Architecture
        </p>
      </footer>
    </div>
  );
}
