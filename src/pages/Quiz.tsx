import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/hooks/useQuiz';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import QuizTimer from '@/components/QuizTimer';
import QuestionCard from '@/components/QuestionCard';
import QuestionPalette from '@/components/QuestionPalette';
import { categories as categoriesDb } from '@/lib/db';

const QUIZ_TIME = 600; // 10 minutes

export default function Quiz() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  const quiz = useQuiz({
    categoryId: categoryId || '',
    timeLimit: QUIZ_TIME,
  });

  const category = categoriesDb.getById(categoryId || '');

  // Tab switch warning
  useEffect(() => {
    if (quiz.tabSwitchCount > 0 && !quiz.isSubmitted) {
      toast({
        title: '⚠️ Tab Switch Detected!',
        description: `Warning ${quiz.tabSwitchCount}/3 — Quiz will auto-submit at 3 switches.`,
        variant: 'destructive',
      });
      if (quiz.tabSwitchCount >= 3) {
        quiz.submitQuiz();
      }
    }
  }, [quiz.tabSwitchCount]);

  // Redirect on submit
  useEffect(() => {
    if (quiz.isSubmitted && quiz.result) {
      navigate(`/result/${quiz.result.id}`);
    }
  }, [quiz.isSubmitted, quiz.result]);

  // Beforeunload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!quiz.isSubmitted) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [quiz.isSubmitted]);

  if (!categoryId || !category || quiz.totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-xl text-muted-foreground">No questions available for this category.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary hover:underline">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">{category.icon} {category.name} Quiz</h1>
            <p className="text-sm text-muted-foreground">Question {quiz.currentIndex + 1} of {quiz.totalQuestions}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {quiz.currentQuestion && (
                <QuestionCard
                  question={quiz.currentQuestion}
                  index={quiz.currentIndex}
                  selectedOptionId={quiz.answers[quiz.currentQuestion.id] || null}
                  onSelect={(optionId) => quiz.selectAnswer(quiz.currentQuestion.id, optionId)}
                  isSubmitted={false}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={quiz.prevQuestion}
                disabled={quiz.currentIndex === 0}
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-40"
              >
                ← Previous
              </button>

              <button
                onClick={() => quiz.currentQuestion && quiz.toggleMarkForReview(quiz.currentQuestion.id)}
                className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
                  quiz.currentQuestion && quiz.markedForReview.has(quiz.currentQuestion.id)
                    ? 'bg-yellow-500 text-white'
                    : 'border border-border text-foreground hover:bg-accent'
                }`}
              >
                {quiz.currentQuestion && quiz.markedForReview.has(quiz.currentQuestion.id) ? '★ Marked' : '☆ Mark for Review'}
              </button>

              {quiz.currentIndex === quiz.totalQuestions - 1 ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={quiz.nextQuestion}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <QuizTimer timeRemaining={quiz.timeRemaining} totalTime={QUIZ_TIME} />
            <QuestionPalette
              totalQuestions={quiz.totalQuestions}
              currentIndex={quiz.currentIndex}
              answers={quiz.answers}
              markedForReview={quiz.markedForReview}
              questionIds={quiz.questions.map(q => q.id)}
              onGoTo={quiz.goToQuestion}
            />
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border border-border mx-4">
            <h2 className="text-lg font-bold text-card-foreground mb-2">Submit Quiz?</h2>
            <p className="text-sm text-muted-foreground mb-1">
              Answered: {Object.values(quiz.answers).filter(a => a !== null).length}/{quiz.totalQuestions}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Marked for review: {quiz.markedForReview.size}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                Continue Quiz
              </button>
              <button
                onClick={() => { setShowConfirm(false); quiz.submitQuiz(); }}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
