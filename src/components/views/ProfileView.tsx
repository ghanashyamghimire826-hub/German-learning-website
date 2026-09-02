import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { CEFRLevel, LearningGoal } from '../../types';
import {
  User as UserIcon,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  Flame,
  Shield,
  CreditCard,
  Zap,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, isPremium, updateUser } = useAuth();
  const { openPaywallModal } = useLearning();

  const [name, setName] = useState(user?.name || '');
  const [level, setLevel] = useState<CEFRLevel>(user?.level || 'A1');
  const [goal, setGoal] = useState<LearningGoal>(user?.goal || 'pass_exam');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 20);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      await updateUser({
        name,
        level,
        goal,
        dailyGoalMinutes,
      });
      setSuccessMsg('Profile settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const badges = [
    { title: '7-Day Streak', desc: 'Practiced German 7 consecutive days', earned: (user?.streak || 0) >= 7 },
    { title: 'Article Ace', desc: 'Scored 100% on der/die/das challenge', earned: true },
    { title: 'Vocab Master', desc: 'Reviewed 50+ words in SRS flashcards', earned: true },
    { title: 'Exam Ready', desc: 'Passed a full Goethe/telc mock test', earned: (user?.xp || 0) > 200 },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 font-serif font-bold text-2xl flex items-center justify-center border-2 border-stone-800">
            {user?.name.charAt(0).toUpperCase() || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-2xl text-stone-900">{user?.name}</h1>
              {isPremium && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Premium
                </span>
              )}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">{user?.email}</div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <h2 className="font-serif font-bold text-xl text-stone-900">
            Personal & Learning Goal Settings
          </h2>

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target CEFR Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CEFRLevel)}
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs font-medium bg-white focus:outline-none"
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Learning Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as LearningGoal)}
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs font-medium bg-white focus:outline-none"
                >
                  <option value="pass_exam">Pass Goethe / telc Certification Exam</option>
                  <option value="work">Relocate & Work in Germany</option>
                  <option value="study">German University & Academic Studies</option>
                  <option value="travel">Travel & Casual Daily Conversations</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Daily Practice Goal: <strong>{dailyGoalMinutes} Minutes / Day</strong>
              </label>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={dailyGoalMinutes}
                onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Subscription Info Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Membership: {isPremium ? 'DeutschMeister Premium' : 'Free Standard Plan'}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {isPremium
                ? 'All B1–B2 lessons, mock exam simulators, and AI writing grading unlocked.'
                : 'Unlock complete B1–B2 advanced lessons, official mock exam simulators, and AI tutor features.'}
            </p>
          </div>

          {!isPremium && (
            <button
              onClick={openPaywallModal}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Premium</span>
            </button>
          )}
        </div>

        {/* Earned Badges Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            German Mastery Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((b, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  b.earned ? 'bg-amber-50/40 border-amber-200' : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                    b.earned ? 'bg-amber-500 text-stone-950' : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  🏅
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">{b.title}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
