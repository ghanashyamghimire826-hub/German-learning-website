import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { UserProgressAnalytics } from '../../types';
import {
  TrendingUp,
  Award,
  Flame,
  Target,
  Layers,
  Calendar,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserProgressAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await api.getAnalytics();
        setAnalytics(res);
      } catch (e) {
        console.error('Failed to load analytics', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            Learning Analytics & Fluency Metrics
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Detailed performance tracking across CEFR levels, grammar categories, and daily learning consistency.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Total Mastery XP
            </div>
            <div className="font-serif font-bold text-3xl text-stone-900">
              {analytics?.totalXp || user?.xp || 120}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold">Top 15% of German learners</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" /> Daily Streak
            </div>
            <div className="font-serif font-bold text-3xl text-stone-900">
              {analytics?.streakDays || user?.streak || 1} Days
            </div>
            <div className="text-[11px] text-stone-500 font-semibold">Active consistency</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" /> Overall Accuracy
            </div>
            <div className="font-serif font-bold text-3xl text-stone-900">
              {analytics?.overallAccuracy || 88}%
            </div>
            <div className="text-[11px] text-stone-500 font-semibold">
              {analytics?.totalAnswered || 45} questions solved
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-500" /> Target Daily Goal
            </div>
            <div className="font-serif font-bold text-3xl text-stone-900">
              {analytics?.dailyGoalProgress.completed || 0}/{analytics?.dailyGoalProgress.target || 15}
            </div>
            <div className="text-[11px] text-amber-700 font-bold">Questions today</div>
          </div>
        </div>

        {/* 7-Day Activity Chart & Level Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 7-Day Activity Bar Display */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                7-Day Practice History
              </h3>
              <span className="text-xs font-bold text-stone-400">Questions Solved</span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-4 px-2">
              {(analytics?.weeklyActivity || [
                { day: 'Mon', count: 18 },
                { day: 'Tue', count: 24 },
                { day: 'Wed', count: 15 },
                { day: 'Thu', count: 30 },
                { day: 'Fri', count: 22 },
                { day: 'Sat', count: 35 },
                { day: 'Sun', count: 12 },
              ]).map((item, idx) => {
                const maxCount = 40;
                const heightPct = Math.min(100, Math.max(15, (item.count / maxCount) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-stone-700">{item.count}</span>
                    <div className="w-full max-w-[36px] bg-stone-100 rounded-t-xl h-36 flex items-end p-1">
                      <div
                        className="w-full bg-linear-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-stone-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level Mastery Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              CEFR Mastery Progress
            </h3>

            <div className="space-y-4">
              {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => {
                const pct = analytics?.levelProgress[lvl] || (lvl === 'A1' ? 80 : lvl === 'A2' ? 45 : 10);
                return (
                  <div key={lvl} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-800">CEFR {lvl}</span>
                      <span className="text-stone-500">{pct}% Complete</span>
                    </div>
                    <div className="bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topic Breakdown */}
        {analytics?.topicAccuracy && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Grammar Category Accuracy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.topicAccuracy).map(([topic, acc]) => {
                const score = Number(acc) || 0;
                return (
                  <div key={topic} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-900 truncate">{topic}</span>
                      <span className={score >= 75 ? 'text-emerald-600' : 'text-orange-600'}>{score}%</span>
                    </div>
                    <div className="bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score >= 75 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
