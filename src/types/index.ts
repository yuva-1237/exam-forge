export interface User {
  id: string;
  email: string;
  password: string; // SHA-256 hashed
  salt: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  questionCount?: number;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  negativeMarking: number; // e.g. 0.25
  options: Option[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  timeTaken: number; // seconds
  startedAt: string;
  submittedAt: string;
}

export interface UserAnswer {
  attemptId: string;
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | null>; // questionId -> optionId
  markedForReview: Set<string>;
  timeRemaining: number;
  tabSwitchCount: number;
  isSubmitted: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalScore: number;
  totalAttempts: number;
  avgScore: number;
  bestScore: number;
}

export interface DashboardStats {
  totalQuizzes: number;
  avgScore: number;
  bestScore: number;
  bestCategory: string;
  totalCorrect: number;
  totalQuestions: number;
}
