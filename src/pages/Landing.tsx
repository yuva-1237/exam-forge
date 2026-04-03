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
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background embellishments */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar />

      {/* Hero */}
      <section className="container flex flex-col items-center justify-center min-h-[75vh] mx-auto px-4 py-20 text-center relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block text-7xl mb-8 drop-shadow-2xl hover:scale-110 transition-transform cursor-default duration-300">🧠</motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-8 leading-tight">
            Master Any Subject with
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 block mt-4 pb-4">Exam Forge</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            A production-grade quiz platform with timed exams, instant scoring, leaderboards, and comprehensive analytics. Built for serious learners.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link to="/dashboard" className="flex items-center justify-center rounded-xl bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all w-full">
                  Go to Dashboard →
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Link to="/register" className="flex items-center justify-center rounded-xl bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all w-full">
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Link to="/login" className="flex items-center justify-center rounded-xl border-2 border-border/80 bg-background/50 backdrop-blur-sm px-10 py-4 text-lg font-bold text-foreground hover:bg-card hover:border-primary/50 transition-all w-full">
                    Sign In
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { icon: '⏱️', title: 'Timed Exams', desc: 'Real exam conditions with countdown timer and auto-submit' },
            { icon: '📊', title: 'Instant Analytics', desc: 'Detailed score breakdown, history tracking, and performance trends' },
            { icon: '🏆', title: 'Leaderboard', desc: 'Compete with others and track your ranking across categories' },
            { icon: '🔒', title: 'Anti-Cheat', desc: 'Tab-switch detection with warnings to maintain exam integrity' },
            { icon: '🎯', title: 'Difficulty Levels', desc: 'Easy, medium, and hard questions with negative marking support' },
            { icon: '💬', title: 'Global Live Chat', desc: 'Discuss questions, share code, and connect with other learners instantly in real-time' },
          ].map((f) => (
            <motion.div 
              key={f.title} 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md p-8 text-center hover:shadow-2xl hover:shadow-primary/10 transition-all hover:bg-card/80 hover:border-primary/30"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 inline-block">{f.icon}</div>
              <h3 className="text-xl font-bold text-card-foreground mb-3">{f.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 text-center text-sm text-muted-foreground mt-20 relative z-10 bg-background/50 backdrop-blur-sm">
        <p>Exam Forge — Premium quiz platform. Admin: admin@mcq.com / Admin123!</p>
      </footer>
    </div>
  );
}
