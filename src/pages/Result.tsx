import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import QuestionCard from '@/components/QuestionCard';
import { attempts as attemptsDb, answers as answersDb, questions as questionsDb, categories as categoriesDb } from '@/lib/db';
import type { QuizAttempt, UserAnswer, Question } from '@/types';

export default function Result() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questionMap, setQuestionMap] = useState<Record<string, Question>>({});
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (!attemptId) return;
    const att = attemptsDb.getById(attemptId);
    if (!att) return;
    setAttempt(att);
    const cat = categoriesDb.getById(att.categoryId);
    setCategoryName(cat?.name || 'Unknown');

    const ans = answersDb.getByAttempt(attemptId);
    setUserAnswers(ans);

    const qMap: Record<string, Question> = {};
    ans.forEach(a => {
      const q = questionsDb.getById(a.questionId);
      if (q) qMap[a.questionId] = q;
    });
    setQuestionMap(qMap);
  }, [attemptId]);

  if (!attempt) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Result not found.</p>
          <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const pct = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
  const passed = pct >= 50;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Score Header */}
        <div className="text-center">
          <span className="text-6xl block mb-4">{passed ? '🎉' : '😔'}</span>
          <h1 className="text-3xl font-bold text-foreground">{passed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
          <p className="text-muted-foreground mt-2">{categoryName} Quiz Results</p>
        </div>

        {/* Score Card */}
        <div className="max-w-lg mx-auto rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={passed ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${pct * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-foreground">{pct}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">Score</p>
              <p className="font-bold text-foreground text-lg">{attempt.score}/{attempt.totalQuestions}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">Correct</p>
              <p className="font-bold text-green-600 text-lg">{attempt.correctAnswers}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">Wrong</p>
              <p className="font-bold text-destructive text-lg">{attempt.wrongAnswers}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">Unanswered</p>
              <p className="font-bold text-foreground text-lg">{attempt.unanswered}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">Time Taken</p>
              <p className="font-bold text-foreground text-lg">{Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">Status</p>
              <p className={`font-bold text-lg ${passed ? 'text-green-600' : 'text-destructive'}`}>{passed ? 'Passed' : 'Failed'}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Link to={`/quiz/${attempt.categoryId}`} className="flex-1 rounded-lg border border-border py-2.5 text-center text-sm font-medium text-foreground hover:bg-accent transition-colors">
              Retry Quiz
            </Link>
            <Link to="/dashboard" className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Answer Review */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Answer Review</h2>
          <div className="space-y-4">
            {userAnswers.map((ua, i) => {
              const q = questionMap[ua.questionId];
              if (!q) return null;
              return (
                <div key={ua.questionId} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <QuestionCard
                    question={q}
                    index={i}
                    selectedOptionId={ua.selectedOptionId}
                    onSelect={() => {}}
                    isSubmitted={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
