interface Props {
  timeRemaining: number;
  totalTime: number;
}

export default function QuizTimer({ timeRemaining, totalTime }: Props) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const pct = (timeRemaining / totalTime) * 100;
  const isLow = timeRemaining < 60;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">Time Remaining</span>
        <span className={`font-mono font-bold text-lg ${isLow ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-destructive' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
