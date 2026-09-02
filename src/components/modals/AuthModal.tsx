import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CEFRLevel, LearningGoal } from '../../types';
import { X, Sparkles, Mail, Lock, User as UserIcon, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'forgot';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('A1');
  const [goal, setGoal] = useState<LearningGoal>('pass_exam');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(20);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
        onSuccess?.();
        onClose();
      } else if (mode === 'register') {
        await register({
          name,
          email,
          password,
          level,
          goal,
          dailyGoalMinutes,
        });
        onSuccess?.();
        onClose();
      } else {
        // Forgot password
        setSuccessMessage('Password reset link has been dispatched to your email address.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setLoading(true);
    setErrorMessage('');
    try {
      if (role === 'admin') {
        await login({ email: 'admin@deutschmeister.de', password: 'AdminPassword123!' });
      } else {
        await login({ email: 'demo@deutschmeister.de', password: 'DemoUser123!' });
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-stone-900 px-6 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-stone-900 font-bold text-xs">
                DM
              </div>
              <span className="font-serif font-bold text-base">DeutschMeister</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="font-serif font-bold text-xl mt-3">
            {mode === 'login' && 'Welcome Back, DeutschMeister'}
            {mode === 'register' && 'Create Your Student Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {mode === 'login' && 'Log in to continue your daily streak & structured practice.'}
            {mode === 'register' && 'Join thousands mastering German from A1 to B2.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lukas Schmidt"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Target Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as CEFRLevel)}
                      className="w-full p-2 text-xs border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="A1">A1 (Beginner)</option>
                      <option value="A2">A2 (Elementary)</option>
                      <option value="B1">B1 (Intermediate)</option>
                      <option value="B2">B2 (Professional)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Primary Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value as LearningGoal)}
                      className="w-full p-2 text-xs border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="pass_exam">Goethe/telc Exam</option>
                      <option value="work">Work in Germany</option>
                      <option value="study">University Studies</option>
                      <option value="travel">Travel & Daily Life</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Daily Practice Goal: <strong>{dailyGoalMinutes} min/day</strong>
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
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Log In to Dashboard'}
                    {mode === 'register' && 'Start Learning Now'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for effortless testing */}
          <div className="mt-5 pt-4 border-t border-stone-100">
            <div className="text-[11px] text-center font-bold text-stone-600 mb-2 uppercase tracking-wider">
              1-Click Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1 border border-purple-200/50"
              >
                <Shield className="w-3 h-3 text-purple-600" />
                Admin Demo
              </button>
            </div>
          </div>

          {/* Switch mode footer */}
          <div className="mt-4 text-center text-xs text-stone-500">
            {mode === 'login' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="font-bold text-amber-600 hover:underline"
                >
                  Register Free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="font-bold text-amber-600 hover:underline"
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
