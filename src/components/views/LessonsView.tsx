import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { triggerConfetti } from '../../lib/confetti';
import { Lesson, CEFRLevel } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Award,
  Layers,
  Check,
  RotateCcw,
} from 'lucide-react';

interface LessonsViewProps {
  onNavigate: (view: string) => void;
  selectedLessonSlug?: string;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ onNavigate, selectedLessonSlug }) => {
  const { user, isAuthenticated, isPremium } = useAuth();
  const { selectedLevel, playGermanAudio, openPaywallModal } = useLearning();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLevel, setActiveLevel] = useState<CEFRLevel>(selectedLevel);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // Lesson checkpoint quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: string }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  useEffect(() => {
    async function loadLessons() {
      setLoading(true);
      try {
        const list = await api.getLessons(activeLevel);
        setLessons(list);

        if (selectedLessonSlug) {
          const found = list.find((l) => l.slug === selectedLessonSlug);
          if (found) setActiveLesson(found);
        }
      } catch (e) {
        console.error('Failed to load lessons', e);
      } finally {
        setLoading(false);
      }
    }
    loadLessons();
  }, [activeLevel, selectedLessonSlug]);

  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.isPremium && !isPremium) {
      openPaywallModal();
      return;
    }
    setActiveLesson(lesson);
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setIsLessonCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuizOption = (questionId: string, option: string) => {
    if (isQuizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeLesson?.miniQuizQuestions) return;

    let correctCount = 0;
    activeLesson.miniQuizQuestions.forEach((q) => {
      if (quizAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setIsQuizSubmitted(true);

    const isPassed = correctCount === activeLesson.miniQuizQuestions.length;
    if (isPassed) {
      setIsLessonCompleted(true);
      triggerConfetti();
      if (isAuthenticated) {
        try {
          await api.completeLesson(activeLesson.id);
        } catch (e) {
          console.warn('Could not record lesson completion', e);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* If viewing single lesson details */}
        {activeLesson ? (
          <div className="space-y-6">
            {/* Back Bar */}
            <button
              onClick={() => setActiveLesson(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {activeLevel} Curriculum</span>
            </button>

            {/* Main Lesson Content Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
              {/* Header */}
              <div className="pb-6 border-b border-stone-100">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-amber-500 text-stone-950 font-bold text-xs rounded-lg">
                    Level {activeLesson.level}
                  </span>
                  <span className="px-3 py-1 bg-stone-100 text-stone-700 font-semibold text-xs rounded-lg">
                    Unit {activeLesson.unit} • Lesson {activeLesson.order}
                  </span>
                  <span className="px-3 py-1 bg-stone-100 text-stone-700 font-semibold text-xs rounded-lg">
                    ⏱ {activeLesson.estimatedMinutes} mins
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 font-bold text-xs rounded-lg flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> +{activeLesson.xpReward} XP
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-stone-900">
                      {activeLesson.title}
                    </h1>
                    <p className="text-sm font-medium text-stone-500 mt-1">
                      {activeLesson.titleGerman}
                    </p>
                  </div>
                  <button
                    onClick={() => playGermanAudio(activeLesson.titleGerman)}
                    title="Pronounce lesson title"
                    className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-2xl transition-colors shrink-0"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  In This Lesson, You Will Master:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-stone-800 font-medium">
                  {activeLesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Main Content Body */}
              <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed text-sm sm:text-base space-y-4">
                <div className="whitespace-pre-line font-normal">{activeLesson.content}</div>
              </div>

              {/* Grammar Rules Box */}
              {activeLesson.grammarRules && activeLesson.grammarRules.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-600" />
                    Key Grammar Formulations
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {activeLesson.grammarRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed"
                      >
                        {rule}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Showcase */}
              {activeLesson.vocabularyList && activeLesson.vocabularyList.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    Essential Lesson Vocabulary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.vocabularyList.map((vocab, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                            <span>{vocab.german}</span>
                            <span className="text-xs font-sans text-stone-400 font-normal">
                              ({vocab.type})
                            </span>
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">{vocab.english}</div>
                          {vocab.example && (
                            <div className="text-[11px] text-stone-500 italic mt-1">
                              "{vocab.example}"
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => playGermanAudio(vocab.german)}
                          className="p-2 rounded-xl bg-white hover:bg-stone-200 text-stone-700 transition-colors shadow-2xs"
                        >
                          <Volume2 className="w-4 h-4 text-amber-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mini-Quiz Checkpoint */}
              {activeLesson.miniQuizQuestions && activeLesson.miniQuizQuestions.length > 0 && (
                <div className="pt-8 border-t border-stone-200 space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 font-bold text-xs uppercase mb-2">
                      <Sparkles className="w-3.5 h-3.5" /> Lesson Checkpoint Quiz
                    </div>
                    <h3 className="font-serif font-bold text-xl text-stone-900">
                      Verify Your Understanding to Complete Lesson (+{activeLesson.xpReward} XP)
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {activeLesson.miniQuizQuestions.map((q, qIndex) => {
                      const selected = quizAnswers[q.id];
                      const isCorrectChoice = selected?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                      return (
                        <div key={q.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                          <div className="font-bold text-sm text-stone-900">
                            {qIndex + 1}. {q.question}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {q.options.map((opt, optIndex) => {
                              const isThisSelected = selected === opt;
                              const isThisCorrect = opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                              let btnStyle = 'bg-white border-stone-200 text-stone-800 hover:bg-stone-100';

                              if (isThisSelected && !isQuizSubmitted) {
                                btnStyle = 'bg-amber-100 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-500/20';
                              }

                              if (isQuizSubmitted) {
                                if (isThisCorrect) {
                                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                                } else if (isThisSelected && !isThisCorrect) {
                                  btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                                }
                              }

                              return (
                                <button
                                  key={optIndex}
                                  onClick={() => handleSelectQuizOption(q.id, opt)}
                                  disabled={isQuizSubmitted}
                                  className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left ${btnStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission and Result Bar */}
                  {!isQuizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(quizAnswers).length < activeLesson.miniQuizQuestions.length}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl shadow-md transition-all hover:scale-[1.01] disabled:opacity-40"
                    >
                      Submit Checkpoint Quiz
                    </button>
                  ) : (
                    <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                          {isLessonCompleted ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                              <span>Lesson Completed! You earned +{activeLesson.xpReward} XP</span>
                            </>
                          ) : (
                            <>
                              <span>Score: {quizScore} / {activeLesson.miniQuizQuestions.length} correct</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 mt-1">
                          {isLessonCompleted
                            ? 'Great job! You can now move to the next lesson or practice in the quiz engine.'
                            : 'Review the explanations above and try the checkpoint again.'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {!isLessonCompleted && (
                          <button
                            onClick={() => {
                              setIsQuizSubmitted(false);
                              setQuizAnswers({});
                            }}
                            className="px-4 py-2 bg-white text-stone-800 font-bold text-xs rounded-xl border border-stone-300"
                          >
                            Retry Quiz
                          </button>
                        )}
                        <button
                          onClick={() => setActiveLesson(null)}
                          className="px-5 py-2 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-black"
                        >
                          Curriculum Overview
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Curriculum Directory */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-amber-500" />
                    Curriculum Lessons
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Structured A1–B2 units designed to build solid German grammar and communication skills.
                  </p>
                </div>

                {/* Level Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
                  {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveLevel(lvl)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeLevel === lvl
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

            {/* Lessons List Grid */}
            {loading ? (
              <div className="p-12 text-center text-xs font-bold text-stone-500">
                Loading {activeLevel} lessons...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {lessons.map((lesson) => {
                  const isLocked = lesson.isPremium && !isPremium;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-[11px] font-bold">
                            Unit {lesson.unit} • Lesson {lesson.order}
                          </span>
                          {isLocked ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Premium
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                              +{lesson.xpReward} XP
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-600 transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium italic mt-0.5">
                          {lesson.titleGerman}
                        </p>

                        <div className="mt-3 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {lesson.objectives.join(' • ')}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-400 font-medium">⏱ {lesson.estimatedMinutes} mins</span>
                        <span className="font-bold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {isLocked ? 'Unlock Lesson' : 'Open Lesson'} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
