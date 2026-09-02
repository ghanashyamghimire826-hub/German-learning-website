import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/modals/AuthModal';
import { PricingModal } from './components/modals/PricingModal';

// Views
import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { PracticeView } from './components/views/PracticeView';
import { LessonsView } from './components/views/LessonsView';
import { GrammarView } from './components/views/GrammarView';
import { VocabularyView } from './components/views/VocabularyView';
import { ExamsView } from './components/views/ExamsView';
import { MistakesView } from './components/views/MistakesView';
import { NotesView } from './components/views/NotesView';
import { AITutorView } from './components/views/AITutorView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { LeaderboardView } from './components/views/LeaderboardView';
import { ProfileView } from './components/views/ProfileView';
import { AdminView } from './components/views/AdminView';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Handle default landing vs dashboard view
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && currentView === 'landing') {
        setCurrentView('dashboard');
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />
        )}

        {currentView === 'dashboard' && (
          <DashboardView onNavigate={handleNavigate} onOpenAuth={handleOpenAuth} />
        )}

        {currentView === 'practice' && (
          <PracticeView onNavigate={handleNavigate} />
        )}

        {currentView === 'lessons' && (
          <LessonsView onNavigate={handleNavigate} selectedLessonSlug={viewParam} />
        )}

        {currentView === 'grammar' && (
          <GrammarView onNavigate={handleNavigate} />
        )}

        {currentView === 'vocabulary' && (
          <VocabularyView />
        )}

        {currentView === 'exams' && (
          <ExamsView onNavigate={handleNavigate} />
        )}

        {currentView === 'mistakes' && (
          <MistakesView onNavigate={handleNavigate} />
        )}

        {currentView === 'notes' && (
          <NotesView onNavigate={handleNavigate} />
        )}

        {currentView === 'ai_tutor' && (
          <AITutorView initialTopic={viewParam} />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView />
        )}

        {currentView === 'profile' && (
          <ProfileView />
        )}

        {currentView === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setCurrentView('dashboard');
        }}
      />

      <PricingModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LearningProvider>
        <AppContent />
      </LearningProvider>
    </AuthProvider>
  );
}
