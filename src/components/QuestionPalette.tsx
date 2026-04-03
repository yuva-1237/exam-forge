import { cn } from '@/lib/utils';

interface Props {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, string | null>;
  markedForReview: Set<string>;
  questionIds: string[];
  onGoTo: (index: number) => void;
}

export default function QuestionPalette({ totalQuestions, currentIndex, answers, markedForReview, questionIds, onGoTo }: Props) {
  const answered = Object.keys(answers).filter(k => answers[k] !== null).length;
  const marked = markedForReview.size;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-card-foreground">Question Palette</h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-primary" /> Answered ({answered})
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-secondary border border-border" /> Unanswered ({totalQuestions - answered})
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-yellow-500" /> Marked ({marked})
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2">
        {questionIds.map((qId, i) => {
          const isAnswered = answers[qId] != null;
          const isMarked = markedForReview.has(qId);
          const isCurrent = i === currentIndex;

          return (
            <button
              key={qId}
              onClick={() => onGoTo(i)}
              className={cn(
                'h-9 w-full rounded-md text-xs font-semibold transition-all',
                isCurrent && 'ring-2 ring-ring',
                isMarked ? 'bg-yellow-500 text-white' :
                isAnswered ? 'bg-primary text-primary-foreground' :
                'bg-secondary text-secondary-foreground hover:bg-accent'
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
