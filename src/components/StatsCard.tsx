import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  className?: string;
  subtitle?: string;
}

export default function StatsCard({ title, value, icon, className, subtitle }: Props) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
