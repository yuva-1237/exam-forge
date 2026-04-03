import type { Question } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  question: Question;
  index: number;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  isSubmitted: boolean;
}

export default function QuestionCard({ question, index, selectedOptionId, onSelect, isSubmitted }: Props) {
  const difficultyColor = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }[question.difficulty];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          <span className="text-muted-foreground mr-2">Q{index + 1}.</span>
          {question.text}
        </h2>
        <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full shrink-0', difficultyColor)}>
          {question.difficulty}
        </span>
      </div>

      {question.negativeMarking > 0 && (
        <p className="text-xs text-muted-foreground">⚠️ Negative marking: -{question.negativeMarking} for wrong answer</p>
      )}

      <div className="space-y-3">
        {question.options.map((option, oi) => {
          const isSelected = selectedOptionId === option.id;
          const letter = String.fromCharCode(65 + oi);

          let optionStyle = 'border-border hover:border-primary hover:bg-accent';
          if (isSelected) optionStyle = 'border-primary bg-primary/10 ring-2 ring-primary/20';
          if (isSubmitted) {
            if (option.isCorrect) optionStyle = 'border-green-500 bg-green-50 dark:bg-green-950';
            else if (isSelected && !option.isCorrect) optionStyle = 'border-destructive bg-red-50 dark:bg-red-950';
            else optionStyle = 'border-border opacity-60';
          }

          return (
            <button
              key={option.id}
              onClick={() => !isSubmitted && onSelect(option.id)}
              disabled={isSubmitted}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg border p-4 text-left transition-all',
                optionStyle
              )}
            >
              <span className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              )}>
                {letter}
              </span>
              <span className="text-sm text-foreground">{option.text}</span>
              {isSubmitted && option.isCorrect && <span className="ml-auto text-green-600">✓</span>}
              {isSubmitted && isSelected && !option.isCorrect && <span className="ml-auto text-destructive">✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
