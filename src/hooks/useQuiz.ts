import { useState, useEffect, useCallback, useRef } from 'react';
import type { Question, QuizAttempt, UserAnswer } from '@/types';
import { questions as questionsDb, attempts as attemptsDb, answers as answersDb, generateId } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

interface UseQuizOptions {
  categoryId: string;
  difficulty?: string;
  timeLimit?: number; // seconds, default 600 (10 min)
  questionCount?: number; // default all
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useQuiz({ categoryId, difficulty, timeLimit = 600, questionCount }: UseQuizOptions) {
  const { user } = useAuth();
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [startedAt] = useState(new Date().toISOString());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load questions
  useEffect(() => {
    let qs = questionsDb.getByCategoryAndDifficulty(categoryId, difficulty);
    qs = shuffleArray(qs);
    if (questionCount && questionCount < qs.length) qs = qs.slice(0, questionCount);
    // Shuffle options for each question
    qs = qs.map(q => ({ ...q, options: shuffleArray(q.options) }));
    setQuizQuestions(qs);
  }, [categoryId, difficulty, questionCount]);

  // Timer
  useEffect(() => {
    if (isSubmitted || quizQuestions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isSubmitted, quizQuestions.length]);

  // Auto-submit on timeout
  useEffect(() => {
    if (timeRemaining === 0 && !isSubmitted) {
      submitQuiz();
    }
  }, [timeRemaining, isSubmitted]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !isSubmitted) {
        setTabSwitchCount(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isSubmitted]);

  const selectAnswer = useCallback((questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }, [isSubmitted]);

  const toggleMarkForReview = useCallback((questionId: string) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < quizQuestions.length) setCurrentIndex(index);
  }, [quizQuestions.length]);

  const nextQuestion = useCallback(() => goToQuestion(currentIndex + 1), [currentIndex, goToQuestion]);
  const prevQuestion = useCallback(() => goToQuestion(currentIndex - 1), [currentIndex, goToQuestion]);

  const submitQuiz = useCallback(() => {
    if (isSubmitted || !user) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    let score = 0;

    const userAnswers: UserAnswer[] = [];
    const attemptId = generateId();

    quizQuestions.forEach(q => {
      const selectedId = answers[q.id] || null;
      if (!selectedId) {
        unanswered++;
        userAnswers.push({ attemptId, questionId: q.id, selectedOptionId: null, isCorrect: false });
        return;
      }
      const correct = q.options.find(o => o.isCorrect);
      const isCorrect = correct?.id === selectedId;
      if (isCorrect) {
        correctAnswers++;
        score += 1;
      } else {
        wrongAnswers++;
        score -= q.negativeMarking;
      }
      userAnswers.push({ attemptId, questionId: q.id, selectedOptionId: selectedId, isCorrect });
    });

    score = Math.max(0, score);
    const timeTaken = timeLimit - timeRemaining;

    const attempt: QuizAttempt = {
      id: attemptId,
      userId: user.id,
      categoryId,
      score: Math.round(score * 100) / 100,
      totalQuestions: quizQuestions.length,
      correctAnswers,
      wrongAnswers,
      unanswered,
      timeTaken,
      startedAt,
      submittedAt: new Date().toISOString(),
    };

    attemptsDb.add(attempt);
    answersDb.addMany(userAnswers);
    setResult(attempt);
    setIsSubmitted(true);
  }, [isSubmitted, user, quizQuestions, answers, timeRemaining, timeLimit, categoryId, startedAt]);

  return {
    questions: quizQuestions,
    currentQuestion: quizQuestions[currentIndex],
    currentIndex,
    totalQuestions: quizQuestions.length,
    answers,
    markedForReview,
    timeRemaining,
    tabSwitchCount,
    isSubmitted,
    result,
    selectAnswer,
    toggleMarkForReview,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  };
}
