import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast({ title: 'Welcome!', description: 'Account created successfully.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
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
      
      <div className="flex-1 container mx-auto flex items-center justify-center px-4 pt-24 pb-16 relative z-10">
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
                📝
              </span>
            </motion.div>
            <h1 className="text-5xl font-black text-foreground tracking-tight leading-none mb-4">Begin Your Success Track</h1>
            <p className="text-muted-foreground font-light text-lg">Initialize your learning journey across 20+ tracks.</p>
          </div>

          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="glass-card p-10 rounded-[2.5rem] space-y-5 shadow-2xl"
          >
            <div className="space-y-1">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Designation</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} className="bg-background/20 border-border rounded-2xl h-12 px-6 focus:border-primary/40 focus:bg-background/40 transition-all font-medium text-foreground" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Channel (Email)</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} className="bg-background/20 border-border rounded-2xl h-12 px-6 focus:border-primary/40 focus:bg-background/40 transition-all text-foreground" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <Label htmlFor="password" title="Encryption Key (Password)" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Key</Label>
                <Input id="password" type="password" placeholder="Min 8 chars" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} maxLength={128} className="bg-background/20 border-border rounded-2xl h-12 px-6 focus:border-primary/40 focus:bg-background/40 transition-all font-mono text-foreground" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Identity</Label>
                <Input id="confirm" type="password" placeholder="Re-enter key" value={confirm} onChange={e => setConfirm(e.target.value)} required className="bg-background/20 border-border rounded-2xl h-12 px-6 focus:border-primary/40 focus:bg-background/40 transition-all font-mono text-foreground" />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 shadow-lg dark:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                {loading ? 'RECRUITING...' : 'BEGIN INTEGRATION'}
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground font-medium">
              Already integrated? <Link to="/register" className="text-primary hover:text-primary-foreground font-bold transition-colors">Sign In To Forge</Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
