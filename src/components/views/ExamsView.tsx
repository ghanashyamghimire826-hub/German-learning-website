import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { triggerConfetti } from '../../lib/confetti';
import { Question, ExamSession, CEFRLevel } from '../../types';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Volume2,
} from 'lucide-react';

interface ExamsViewProps {
  onNavigate: (view: string) => void;
}

export const ExamsView: React.FC<ExamsViewProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, isPremium } = useAuth();
  const { selectedLevel, playGermanAudio, openPaywallModal } = useLearning();

  const [examLevel, setExamLevel] = useState<CEFRLevel>(selectedLevel);
  const [examHistory, setExamHistory] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(false);

  // Active exam session state
  const [isExamActive, setIsExamActive] = useState(false);
  const [examSessionId, setExamSessionId] = useState<string>('');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentExamIndex, setCurrentExamIndex] = useState(0);
  const [examAnswers, setExamAnswers] = useState<{ [qId: string]: string }>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(15 * 60); // 15 mins
  const [examResult, setExamResult] = useState<ExamSession | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.getExamHistory().then((res) => setExamHistory(res)).catch(() => {});
    }
  }, [isAuthenticated]);

  // Countdown timer for active exam
  useEffect(() => {
    let timer: any;
    if (isExamActive && timeRemainingSeconds > 0) {
      timer = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamActive, timeRemainingSeconds]);

  const handleStartExam = async () => {
    if ((examLevel === 'B1' || examLevel === 'B2') && !isPremium) {
      openPaywallModal();
      return;
    }

    setLoading(true);
    try {
      const res = await api.startExam({
        level: examLevel,
        totalQuestions: 10,
        mode: 'standard',
      });

      setExamSessionId(res.sessionId);
      setExamQuestions(res.questions);
      setCurrentExamIndex(0);
      setExamAnswers({});
      setTimeRemainingSeconds(res.timeLimitMinutes * 60);
      setIsExamActive(true);
      setExamResult(null);
    } catch (err: any) {
      alert(err.message || 'Failed to start exam session');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    setExamAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitExam = async () => {
    setIsExamActive(false);
    setLoading(true);

    try {
      const answersArray = examQuestions.map((q) => ({
        questionId: q.id,
        userAnswer: examAnswers[q.id] || '',
      }));

      const res = await api.submitExam({
        sessionId: examSessionId,
        level: examLevel,
        answers: answersArray,
      });

      setExamResult(res.examRecord);
      if (res.examRecord.passed) {
        triggerConfetti();
      }
      if (isAuthenticated) {
        api.getExamHistory().then((h) => setExamHistory(h)).catch(() => {});
      }
    } catch (err: any) {
      alert(err.message || 'Exam submission error');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ: Question | undefined = examQuestions[currentExamIndex];

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ACTIVE EXAM RUNNER */}
        {isExamActive ? (
          <div className="space-y-6">
            {/* Top Examination Timer Bar */}
            <div className="bg-stone-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
                  Goethe / telc {examLevel} Simulation
                </span>
                <span className="text-xs text-stone-400 hidden sm:inline">
                  Question {currentExamIndex + 1} of {examQuestions.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-stone-800 px-3.5 py-1.5 rounded-xl text-amber-400 font-mono font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{formatTime(timeRemainingSeconds)}</span>
                </div>

                <button
                  onClick={handleSubmitExam}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  Finish & Grade Exam
                </button>
              </div>
            </div>

            {/* Question Quick Jump Navigator */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex items-center gap-2 overflow-x-auto">
              {examQuestions.map((q, idx) => {
                const isAnswered = !!examAnswers[q.id];
                const isCurrent = currentExamIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentExamIndex(idx)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-500/20'
                        : isAnswered
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Active Question Box */}
            {currentQ && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    {currentQ.topic}
                  </div>
                  <button
                    onClick={() => playGermanAudio(currentQ.question)}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {currentQ.contextPassage && (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
                    <div className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Reading Passage:
                    </div>
                    {currentQ.contextPassage}
                  </div>
                )}

                <div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                    {currentQ.question}
                  </h2>
                  {currentQ.sentenceWithBlank && (
                    <div className="p-4 mt-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 font-serif text-lg font-semibold text-stone-900">
                      {currentQ.sentenceWithBlank}
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentQ.options || []).map((opt, optIdx) => {
                    const isSelected = examAnswers[currentQ.id] === opt;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQ.id, opt)}
                        className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left ${
                          isSelected
                            ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 font-bold'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Question Footer Nav */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentExamIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentExamIndex === 0}
                    className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl disabled:opacity-30"
                  >
                    Previous Question
                  </button>

                  <button
                    onClick={() =>
                      setCurrentExamIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))
                    }
                    disabled={currentExamIndex === examQuestions.length - 1}
                    className="px-5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-black disabled:opacity-30 flex items-center gap-1.5"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : examResult ? (
          /* EXAM RESULT & CERTIFICATE CARD */
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-amber-500/20 text-amber-600">
              <Award className="w-8 h-8 text-amber-600" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Official Mock Exam Report
              </span>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900">
                CEFR {examResult.level} Examination Result
              </h2>
            </div>

            {/* Score Pill */}
            <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div>
                <div className="text-3xl font-serif font-black text-stone-900">
                  {examResult.percentage}%
                </div>
                <div className="text-[11px] text-stone-500 font-semibold">
                  {examResult.score} of {examResult.totalQuestions} Points
                </div>
              </div>

              <div className="w-px h-10 bg-stone-200"></div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    examResult.passed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {examResult.passed ? 'PASSED (Bestanden)' : 'NOT PASSED (Nicht Bestanden)'}
                </span>
                <div className="text-[11px] text-stone-400 mt-1">Pass threshold: 60%</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              {examResult.passed
                ? 'Congratulations! You have demonstrated strong competency in this German level.'
                : 'Keep practicing! Review your missed questions in the Mistakes notebook and retake when ready.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={handleStartExam}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
              >
                Retake {examLevel} Exam
              </button>
              <button
                onClick={() => setExamResult(null)}
                className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm rounded-xl transition-colors"
              >
                Back to Exam Center
              </button>
            </div>
          </div>
        ) : (
          /* EXAM CENTER HOME SCREEN */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
                    <FileCheck2 className="w-6 h-6 text-amber-500" />
                    Goethe & telc Exam Simulator
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Realistic timed examination conditions to test your readiness for official German certification.
                  </p>
                </div>

                {/* Level Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                  {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setExamLevel(lvl)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        examLevel === lvl
                          ? 'bg-amber-500 text-stone-950 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Exam Launch Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-r from-stone-900 to-stone-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official Exam Format
                </div>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                  Start {examLevel} Mock Examination
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  10 Questions • 15 Minutes • Immediate Automated Grading • Pass mark 60%
                </p>
              </div>

              <button
                onClick={handleStartExam}
                disabled={loading}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-2xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
              >
                <span>Begin Timed Exam</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Past Exam History */}
            {examHistory.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Your Past Examination Records
                </h3>
                <div className="divide-y divide-stone-100">
                  {examHistory.map((ex) => (
                    <div key={ex.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-stone-100 font-bold rounded-md">
                          {ex.level}
                        </span>
                        <span className="text-stone-600">
                          {new Date(ex.startedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-stone-900">{ex.percentage}%</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            ex.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ex.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
