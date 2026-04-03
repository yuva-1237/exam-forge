import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { seedDatabase, injectMissingSubjects } from "@/lib/seed";
import { categories, questions } from "@/lib/db";
import CustomCursor from "@/components/CustomCursor";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageQuestions from "./pages/admin/ManageQuestions";
import ManageCategories from "./pages/admin/ManageCategories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const [ready, setReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Migration: Update existing seeded categories to use actual logos if they use emojis
    const cats = categories.getAll();
    cats.forEach(c => {
      if (c.name === 'JavaScript' && c.icon === '⚡') categories.update(c.id, { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' });
      if (c.name === 'Python' && c.icon === '🐍') categories.update(c.id, { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' });
      if (c.name === 'React' && c.icon === '⚛️') categories.update(c.id, { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' });
      if (c.name === 'Database' && c.icon === '🗄️') categories.update(c.id, { icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' });
    });

    // Remove "Go" if it exists, so Photoshop takes its place and we stick to 20 total
    const goCat = categories.getAll().find(c => c.name === 'Go');
    if (goCat) {
      categories.remove(goCat.id);
      const qs = questions.getAll().filter(q => q.categoryId === goCat.id);
      qs.forEach(q => questions.remove(q.id));
    }

    // Ensure new categories (Figma, C, C++, TypeScript, etc.) exist and their 10 questions are added
    injectMissingSubjects();

    seedDatabase().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/quiz/:categoryId" element={<ProtectedRoute><PageWrapper><Quiz /></PageWrapper></ProtectedRoute>} />
        <Route path="/result/:attemptId" element={<ProtectedRoute><PageWrapper><Result /></PageWrapper></ProtectedRoute>} />
        <Route path="/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/admin/questions" element={<ProtectedRoute requireAdmin><PageWrapper><ManageQuestions /></PageWrapper></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><PageWrapper><ManageCategories /></PageWrapper></ProtectedRoute>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CustomCursor />
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
