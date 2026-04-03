import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  className?: string;
  subtitle?: string;
}

export default function StatsCard({ title, value, icon, className, subtitle }: Props) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn("rounded-2xl border-2 border-border/80 bg-card/60 backdrop-blur-md p-6 shadow-sm hover:shadow-lg hover:border-primary/40 transition-colors", className)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <span className="text-4xl drop-shadow-sm">{icon}</span>
      </div>
    </motion.div>
  );
}
