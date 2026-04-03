

# MCQ Web Application — Full Implementation Plan

## Overview
A complete, self-contained MCQ platform built in React + TypeScript + Tailwind CSS, using localStorage as the database layer. All authentication, quiz engine, admin panel, and analytics are custom-built with zero external dependencies.

## Architecture

```text
src/
├── lib/
│   ├── db.ts              # localStorage CRUD (users, questions, categories, attempts, roles)
│   ├── auth.ts            # JWT-like token helpers (base64 encode/decode, bcrypt-like hash)
│   └── seed.ts            # Sample data seeder (categories, questions, admin user)
├── contexts/
│   └── AuthContext.tsx     # Auth state, login/register/logout, role checks
├── hooks/
│   ├── useQuiz.ts          # Quiz engine (timer, navigation, auto-save, scoring)
│   └── useLeaderboard.ts   # Leaderboard data
├── pages/
│   ├── Landing.tsx          # Hero + CTA
│   ├── Login.tsx            # Login form
│   ├── Register.tsx         # Registration form
│   ├── Dashboard.tsx        # User dashboard (stats, category select, history)
│   ├── Quiz.tsx             # Quiz page (timer, question palette, navigation)
│   ├── Result.tsx           # Score display + breakdown
│   ├── Leaderboard.tsx      # Rankings table
│   └── admin/
│       ├── AdminDashboard.tsx   # Analytics overview
│       ├── ManageQuestions.tsx   # CRUD questions
│       └── ManageCategories.tsx # CRUD categories
├── components/
│   ├── ProtectedRoute.tsx   # Auth + role guard
│   ├── QuizTimer.tsx        # Countdown timer
│   ├── QuestionCard.tsx     # Single question display
│   ├── QuestionPalette.tsx  # Navigation grid (answered/unanswered/marked)
│   ├── Navbar.tsx           # Top nav with auth state
│   ├── DarkModeToggle.tsx   # Theme switcher
│   └── StatsCard.tsx        # Reusable metric card
└── types/
    └── index.ts             # All TypeScript interfaces
```

## Data Model (localStorage, 3NF-equivalent)

- **users**: id, email, password (hashed), name, role, createdAt
- **categories**: id, name, description, icon
- **questions**: id, categoryId, text, difficulty (easy/medium/hard), negativeMarking, options[] (each with id, text, isCorrect)
- **quiz_attempts**: id, userId, categoryId, score, totalQuestions, correctAnswers, timeTaken, startedAt, submittedAt
- **user_answers**: attemptId, questionId, selectedOptionId, isCorrect

## Key Features by Module

**Auth**: Registration with validation, password hashing (simple SHA-256 via Web Crypto API), session token in localStorage, role-based route protection (user/admin).

**Quiz Engine**: Configurable timer (auto-submit on expiry), randomized questions/options, next/prev navigation, mark-for-review, question palette with color-coded status, real-time answer auto-save, negative marking support, tab-switch detection with warnings.

**Admin Panel**: Add/edit/delete questions with multi-option editor, manage categories, view all user attempts, analytics dashboard (total users, attempts, avg scores, category breakdown).

**Dashboard**: Category cards to start quiz, recent attempt history, personal stats (avg score, quizzes taken, best category).

**Advanced**: Leaderboard with ranking, difficulty filter, dark mode toggle, responsive design for mobile.

## Implementation Order (8 steps)

1. **Types + DB layer + Seed data** — All interfaces, localStorage helpers, sample categories/questions/admin account
2. **Auth system** — AuthContext, Login, Register pages, ProtectedRoute component
3. **Layout + Navigation** — Navbar, DarkModeToggle, Landing page, route setup
4. **User Dashboard** — Category listing, stats cards, attempt history table
5. **Quiz Engine** — useQuiz hook, Quiz page with timer, palette, question cards, auto-submit
6. **Result Page** — Score display, answer breakdown, retry/home actions
7. **Admin Panel** — Admin dashboard with analytics, question CRUD, category management
8. **Leaderboard + Polish** — Rankings, animations, responsive tweaks, toast notifications

## Security (within frontend constraints)
- Passwords hashed before storage (Web Crypto SHA-256 + salt)
- Role checks on every protected route
- Input validation with length limits on all forms
- Tab-switch anti-cheat during quizzes

## Seed Data
- 1 admin account (admin@mcq.com / Admin123!)
- 4 categories (JavaScript, Python, React, Database)
- 40 questions (10 per category, mixed difficulty)

