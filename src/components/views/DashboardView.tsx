import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { DailyChallenge, UserProgressAnalytics, CEFRLevel } from '../../types';
import {
  Flame,
  Award,
  Sparkles,
  BookOpen,
  Bookmark,
  FileCheck2,
  AlertTriangle,
  Bot,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated, isPremium } = useAuth();
  const { selectedLevel, setSelectedLevel, openPaywallModal } = useLearning();

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [analytics, setAnalytics] = useState<UserProgressAnalytics | null>(null);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const dc = await api.getDailyChallenge();
        setDailyChallenge(dc);

        if (isAuthenticated) {
          const [an, mst] = await Promise.all([
            api.getAnalytics().catch(() => null),
            api.getMistakes().catch(() => []),
          ]);
          setAnalytics(an);
          setMistakesCount(mst.length);
        }
      } catch (err) {
        console.warn('Dashboard load error', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated]);

  const levelList: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome & Overview Header */}
        <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" /> CEFR Level {selectedLevel} Active
              </div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-white">
                Willkommen zurück, <span className="text-amber-400">{user?.name || 'DeutschMeister'}</span>!
              </h1>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
                Keep your German momentum alive. Review today’s vocabulary, tackle the daily challenge, and complete your curriculum goals.
              </p>
            </div>

            {/* Top Quick Stats Pill Block */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-stone-800/90 border border-stone-700/80 rounded-2xl p-3.5 text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-orange-400 font-bold text-lg sm:text-xl">
                  <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-bounce" />
                  <span>{user?.streak || 1}d</span>
                </div>
                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                  Streak
                </div>
              </div>

              <div className="bg-stone-800/90 border border-stone-700/80 rounded-2xl p-3.5 text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg sm:text-xl">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>{user?.xp || 120}</span>
                </div>
                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                  Total XP
                </div>
              </div>

              <div className="bg-stone-800/90 border border-stone-700/80 rounded-2xl p-3.5 text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-lg sm:text-xl">
                  <Target className="w-5 h-5 text-emerald-500" />
                  <span>{analytics?.overallAccuracy || 88}%</span>
                </div>
                <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                  Accuracy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal & Streak Progress Bar */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 fill-orange-500" />
            </div>
            <div>
              <div className="font-bold text-sm text-stone-900">Today's Daily Practice Target</div>
              <div className="text-xs text-stone-700 mt-0.5">
                {analytics?.dailyGoalProgress.completed || 0} of {analytics?.dailyGoalProgress.target || 15} questions solved today
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 flex items-center gap-3">
            <div className="flex-1 bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
              <div
                className="bg-linear-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round(((analytics?.dailyGoalProgress.completed || 0) / (analytics?.dailyGoalProgress.target || 15)) * 100))}%`,
                }}
              ></div>
            </div>
            <span className="text-xs font-bold text-stone-700 shrink-0">
              {Math.min(100, Math.round(((analytics?.dailyGoalProgress.completed || 0) / (analytics?.dailyGoalProgress.target || 15)) * 100))}%
            </span>
          </div>
        </div>

        {/* Level Roadmap (A1 to B2) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-stone-900">
                Your CEFR Learning Roadmap
              </h2>
              <p className="text-xs text-stone-700 mt-0.5">
                Select any level to practice targeted drills, flashcards, and exam topics.
              </p>
            </div>
            <button
              onClick={() => onNavigate('lessons')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              All Lessons <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {levelList.map((lvl) => {
              const isSelected = selectedLevel === lvl;
              const isLocked = (lvl === 'B1' || lvl === 'B2') && !isPremium;

              return (
                <div
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/40 shadow-md ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                        isSelected ? 'bg-amber-500 text-stone-950 font-extrabold' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {lvl}
                    </span>
                    {isSelected && <span className="text-[11px] font-bold text-amber-700">● Active</span>}
                    {isLocked && !isSelected && (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {lvl === 'A1' && 'Beginner Fundamentals'}
                    {lvl === 'A2' && 'Elementary German'}
                    {lvl === 'B1' && 'Intermediate Fluency'}
                    {lvl === 'B2' && 'Professional & Academic'}
                  </h3>
                  <div className="mt-3 text-xs text-stone-700 flex items-center justify-between">
                    <span>Progress:</span>
                    <span className="font-bold text-stone-900">
                      {analytics?.levelProgress[lvl] || (lvl === 'A1' ? 75 : lvl === 'A2' ? 30 : 0)}%
                    </span>
                  </div>
                  <div className="mt-1 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{
                        width: `${analytics?.levelProgress[lvl] || (lvl === 'A1' ? 75 : lvl === 'A2' ? 30 : 0)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Functional Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: Practice Launcher */}
          <div
            onClick={() => onNavigate('practice')}
            className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">Adaptive Practice Drills</h3>
            <p className="text-xs text-stone-700 leading-relaxed mb-4">
              Article choices, sentence ordering, translations, and instant grammar feedback.
            </p>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Launch Practice <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Module 2: Vocabulary Spaced Repetition */}
          <div
            onClick={() => onNavigate('vocabulary')}
            className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">Vocab Flashcards (SRS)</h3>
            <p className="text-xs text-stone-700 leading-relaxed mb-4">
              Review words scheduled by our SM-2 algorithm with crisp native German TTS audio.
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Review Flashcards <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Module 3: Mock Exam Simulator */}
          <div
            onClick={() => onNavigate('exams')}
            className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">Goethe & telc Exam Simulator</h3>
            <p className="text-xs text-stone-700 leading-relaxed mb-4">
              Take timed mock examinations with auto-grading, certificates, and detailed mistake reviews.
            </p>
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Start Mock Exam <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Error Recovery Notebook Alert (if mistakes exist) */}
        {mistakesCount > 0 && (
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  {mistakesCount} Unresolved Mistakes in Your Notebook
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Review and master the specific questions you struggled with in recent practice sessions.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('mistakes')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-2"
            >
              <span>Review Mistakes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
