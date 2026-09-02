import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { LeaderboardEntry } from '../../types';
import { Trophy, Award, Flame, Medal, Sparkles } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week'>('all');

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      try {
        const list = await api.getLeaderboard();
        setLeaderboard(list);
      } catch (e) {
        console.error('Failed to load leaderboard', e);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Global German Mastery Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Compete with students worldwide by completing daily practice, quizzes, and mock exams.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeFilter === 'all'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeFilter === 'week'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end pt-4">
            {/* Rank 2 (Silver) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-xs text-center space-y-2 order-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-stone-200 text-stone-700 font-bold flex items-center justify-center mx-auto text-sm sm:text-base border-2 border-stone-300">
                2
              </div>
              <div className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate">
                {top3[1].name}
              </div>
              <div className="text-[11px] font-bold text-amber-700">{top3[1].xp} XP</div>
              <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-bold">
                {top3[1].level}
              </span>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="bg-linear-to-b from-amber-50 to-white rounded-3xl p-5 sm:p-8 border-2 border-amber-400 shadow-md text-center space-y-2 order-2 -translate-y-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-3xl bg-amber-500 text-stone-950 font-black flex items-center justify-center mx-auto text-lg sm:text-xl shadow-md shadow-amber-500/30">
                👑 1
              </div>
              <div className="font-serif font-bold text-sm sm:text-base text-stone-900 truncate">
                {top3[0].name}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-amber-600">
                {top3[0].xp} XP
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[10px] font-extrabold">
                {top3[0].level} Champion
              </span>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200 shadow-xs text-center space-y-2 order-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-700/20 text-amber-900 font-bold flex items-center justify-center mx-auto text-sm sm:text-base border-2 border-amber-700/30">
                3
              </div>
              <div className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate">
                {top3[2].name}
              </div>
              <div className="text-[11px] font-bold text-amber-700">{top3[2].xp} XP</div>
              <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-bold">
                {top3[2].level}
              </span>
            </div>
          </div>
        )}

        {/* Full Ranks List Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
            <span>Student Ranking</span>
            <span>Mastery Score</span>
          </div>

          <div className="divide-y divide-stone-100">
            {leaderboard.map((entry) => {
              const isCurrentUser = user && user.id === entry.userId;
              return (
                <div
                  key={entry.rank}
                  className={`p-4 sm:p-5 flex items-center justify-between transition-colors ${
                    isCurrentUser ? 'bg-amber-50/60 font-bold' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-7 text-center font-serif font-bold text-sm ${
                        entry.rank <= 3 ? 'text-amber-600' : 'text-stone-400'
                      }`}
                    >
                      #{entry.rank}
                    </span>

                    <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 font-bold flex items-center justify-center text-xs">
                      {entry.name.charAt(0)}
                    </div>

                    <div>
                      <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                        <span>{entry.name}</span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.2 rounded text-[10px] bg-amber-500 text-stone-950 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                          Level {entry.level}
                        </span>
                        <span className="flex items-center gap-1 text-orange-600 font-bold">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" /> {entry.streak}d streak
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-serif font-bold text-base text-stone-900">
                      {entry.xp} XP
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      {entry.accuracy}% Accuracy
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
