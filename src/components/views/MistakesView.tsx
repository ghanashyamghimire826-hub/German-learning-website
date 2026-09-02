import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { triggerConfetti } from '../../lib/confetti';
import { MistakeRecord } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  Volume2,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface MistakesViewProps {
  onNavigate: (view: string) => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();
  const { playGermanAudio } = useLearning();

  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMistakeIndex, setActiveMistakeIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadMistakes() {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const list = await api.getMistakes();
          setMistakes(list);
        }
      } catch (e) {
        console.error('Failed to load mistakes', e);
      } finally {
        setLoading(false);
      }
    }
    loadMistakes();
  }, [isAuthenticated]);

  const handleResolve = async (id: string) => {
    try {
      await api.resolveMistake(id);
      setMistakes((prev) => prev.filter((m) => m.id !== id));
      triggerConfetti();
    } catch (e) {
      console.warn('Failed to resolve mistake', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              Smart Error Recovery Notebook
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Turn your past mistakes into mastery. Review the specific questions and grammar traps you missed.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold shrink-0">
            {mistakes.length} Active Items
          </div>
        </div>

        {/* Mistakes List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-stone-400">Loading error notebook...</div>
        ) : mistakes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Your Error Notebook is Clean!
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You have no unresolved mistakes. Continue practicing to keep your streak and mastery high.
            </p>
            <button
              onClick={() => onNavigate('practice')}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs"
            >
              Start New Practice Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {mistakes.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 text-xs font-bold">
                      {record.question?.level || 'A2'}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {record.question?.topic}
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-400">
                    Failed {record.timesFailed} times
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="font-serif font-bold text-base sm:text-lg text-stone-900 flex items-center justify-between">
                    <span>{record.question?.question}</span>
                    <button
                      onClick={() => playGermanAudio(record.question?.correctAnswer || '')}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                      <span className="font-bold">Your Missed Answer:</span> {record.lastAnswer}
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <span className="font-bold">Correct Solution:</span> {record.question?.correctAnswer}
                    </div>
                  </div>
                </div>

                {record.question?.explanation && (
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl">
                    {record.question.explanation}
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleResolve(record.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Mastered</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
