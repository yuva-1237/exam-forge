import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <Navbar />
      
      <div className="flex-1 container mx-auto flex items-center justify-center px-4 pt-20 pb-16 relative z-10">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative inline-block mb-6 group"
            >
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150 opacity-50" />
              <span className="relative text-7xl block transition-transform group-hover:scale-110 duration-500">
                🔐
              </span>
            </motion.div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-4">Sign in to Your Study Hub</h1>
            <p className="text-white/40 font-light text-lg">Enter your credentials to access the forge.</p>
          </div>

          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="glass-card p-10 rounded-[2.5rem] space-y-6 shadow-2xl"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Access Protocol (Email)</Label>
              <Input id="email" type="email" placeholder="agent@forge.com" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} className="bg-white/5 border-white/5 rounded-2xl h-14 px-6 focus:border-primary/40 focus:bg-white/10 transition-all" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="Encryption Key (Password)" className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Encryption Key (Password)</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required maxLength={128} className="bg-white/5 border-white/5 rounded-2xl h-14 px-6 focus:border-primary/40 focus:bg-white/10 transition-all font-mono" />
            </div>
            <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              {loading ? 'SYNCHRONIZING...' : 'INITIALIZE ACCESS'}
            </button>
            <p className="text-center text-sm text-white/30 font-medium">
              New recruit? <Link to="/register" className="text-primary hover:text-primary-foreground font-bold transition-colors">Apply For Integration</Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
