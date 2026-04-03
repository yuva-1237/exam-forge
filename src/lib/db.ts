import type { User, Category, Question, QuizAttempt, UserAnswer } from '@/types';

const KEYS = {
  users: 'mcq_users',
  categories: 'mcq_categories',
  questions: 'mcq_questions',
  attempts: 'mcq_attempts',
  answers: 'mcq_answers',
  seeded: 'mcq_seeded',
} as const;

function getAll<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setAll<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getById<T extends { id: string }>(key: string, id: string): T | undefined {
  return getAll<T>(key).find(item => item.id === id);
}

function add<T extends { id: string }>(key: string, item: T): T {
  const items = getAll<T>(key);
  items.push(item);
  setAll(key, items);
  return item;
}

function update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | undefined {
  const items = getAll<T>(key);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  items[index] = { ...items[index], ...updates };
  setAll(key, items);
  return items[index];
}

function remove<T extends { id: string }>(key: string, id: string): boolean {
  const items = getAll<T>(key);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  setAll(key, filtered);
  return true;
}

// Users
export const users = {
  getAll: () => getAll<User>(KEYS.users),
  getById: (id: string) => getById<User>(KEYS.users, id),
  getByEmail: (email: string) => getAll<User>(KEYS.users).find(u => u.email === email),
  add: (user: User) => add(KEYS.users, user),
  update: (id: string, updates: Partial<User>) => update<User>(KEYS.users, id, updates),
  remove: (id: string) => remove<User>(KEYS.users, id),
};

// Categories
export const categories = {
  getAll: () => getAll<Category>(KEYS.categories),
  getById: (id: string) => getById<Category>(KEYS.categories, id),
  add: (cat: Category) => add(KEYS.categories, cat),
  update: (id: string, updates: Partial<Category>) => update<Category>(KEYS.categories, id, updates),
  remove: (id: string) => {
    // Also remove related questions
    const qs = getAll<Question>(KEYS.questions).filter(q => q.categoryId !== id);
    setAll(KEYS.questions, qs);
    return remove<Category>(KEYS.categories, id);
  },
};

// Questions
export const questions = {
  getAll: () => getAll<Question>(KEYS.questions),
  getById: (id: string) => getById<Question>(KEYS.questions, id),
  getByCategory: (categoryId: string) => getAll<Question>(KEYS.questions).filter(q => q.categoryId === categoryId),
  getByCategoryAndDifficulty: (categoryId: string, difficulty?: string) => {
    let qs = getAll<Question>(KEYS.questions).filter(q => q.categoryId === categoryId);
    if (difficulty && difficulty !== 'all') qs = qs.filter(q => q.difficulty === difficulty);
    return qs;
  },
  add: (q: Question) => add(KEYS.questions, q),
  update: (id: string, updates: Partial<Question>) => update<Question>(KEYS.questions, id, updates),
  remove: (id: string) => remove<Question>(KEYS.questions, id),
};

// Quiz Attempts
export const attempts = {
  getAll: () => getAll<QuizAttempt>(KEYS.attempts),
  getById: (id: string) => getById<QuizAttempt>(KEYS.attempts, id),
  getByUser: (userId: string) => getAll<QuizAttempt>(KEYS.attempts).filter(a => a.userId === userId),
  add: (attempt: QuizAttempt) => add(KEYS.attempts, attempt),
};

// User Answers
export const answers = {
  getAll: () => getAll<UserAnswer>(KEYS.answers),
  getByAttempt: (attemptId: string) => getAll<UserAnswer>(KEYS.answers).filter(a => a.attemptId === attemptId),
  addMany: (newAnswers: UserAnswer[]) => {
    const existing = getAll<UserAnswer>(KEYS.answers);
    setAll(KEYS.answers, [...existing, ...newAnswers]);
  },
};

// Seed check
export const isSeeded = () => localStorage.getItem(KEYS.seeded) === 'true';
export const markSeeded = () => localStorage.setItem(KEYS.seeded, 'true');

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}
