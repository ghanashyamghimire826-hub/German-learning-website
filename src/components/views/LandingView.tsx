import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  FileCheck2,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Volume2,
  Flame,
  Check,
  Star,
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { isAuthenticated } = useAuth();
  const { playGermanAudio, openPaywallModal } = useLearning();

  // Interactive sample quiz on landing page
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [hasCheckedArticle, setHasCheckedArticle] = useState(false);

  const sampleQuestion = {
    word: 'Herausforderung',
    meaning: 'challenge',
    correctArticle: 'die',
    explanation: 'Nouns ending in the suffix "-ung" are 100% feminine in German (die Herausforderung).',
  };

  const handleCheckSample = (art: string) => {
    setSelectedArticle(art);
    setHasCheckedArticle(true);
    playGermanAudio(`${art} Herausforderung`);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-500/10 via-white to-stone-50 pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>The Structured German Mastery Platform (A1–B2)</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
                Learn German. <br />
                <span className="text-amber-600">Practice Smart.</span> <br />
                Master Deutsch.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Step away from random apps. DeutschMeister delivers structured lessons, rigorous grammar drills, spaced repetition vocabulary, and real Goethe & telc exam simulations to get you fluent.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <span>Go to My Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onOpenAuth('register')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <span>Start Learning Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('practice')}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm rounded-xl border border-stone-300 shadow-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Try Practice Engine</span>
                    </button>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Complete A1 to B2 Pathway
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Spaced Repetition Flashcards
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Tutor & Sentence Checker
                </span>
              </div>
            </div>

            {/* Right Interactive Hero Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 relative">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Interactive Practice Teaser
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">
                    Level B1
                  </span>
                </div>

                <div className="my-6 space-y-3 text-center">
                  <div className="text-xs font-medium text-stone-700">Choose the correct German article:</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
                      ___ {sampleQuestion.word}
                    </div>
                    <button
                      onClick={() => playGermanAudio(sampleQuestion.word)}
                      title="Listen to German pronunciation"
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                  <div className="text-xs text-stone-700 italic">
                    Meaning: "{sampleQuestion.meaning}"
                  </div>
                </div>

                {/* Article Options */}
                <div className="grid grid-cols-3 gap-2.5">
                  {['der', 'die', 'das'].map((art) => {
                    const isSelected = selectedArticle === art;
                    const isCorrect = art === sampleQuestion.correctArticle;
                    let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';

                    if (hasCheckedArticle) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-md';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                      }
                    }

                    return (
                      <button
                        key={art}
                        onClick={() => handleCheckSample(art)}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${btnStyle}`}
                      >
                        {art}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box */}
                {hasCheckedArticle && (
                  <div
                    className={`mt-4 p-3.5 rounded-2xl text-xs space-y-1 animate-in fade-in ${
                      selectedArticle === sampleQuestion.correctArticle
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {selectedArticle === sampleQuestion.correctArticle ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" /> Richtig! (Correct) +10 XP
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-600" /> Fast richtig! Correct article: "die"
                        </>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-stone-700">
                      {sampleQuestion.explanation}
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span>Daily Streak Active</span>
                  </div>
                  <button
                    onClick={() => onNavigate('practice')}
                    className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    Try 1,000+ Questions <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Curriculum Showcase (A1 to B2) */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900">
              The Clear Step-by-Step Curriculum
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every stage has structured grammar modules, core vocabulary sets, interactive quizzes, and Goethe/telc exam prep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* A1 */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                A1
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1">Absolute Beginner</h3>
              <p className="text-xs text-stone-700 mb-4 leading-relaxed">
                Greetings, articles (der/die/das), accusative case, numbers, family, and daily routines.
              </p>
              <ul className="space-y-2 text-xs text-stone-700 mb-6">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 8 Structured Lessons</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 200+ Core Words</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Basic Quizzes & Audio</li>
              </ul>
              <button
                onClick={() => onNavigate('lessons')}
                className="w-full py-2 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 transition-colors"
              >
                Explore A1 Lessons
              </button>
            </div>

            {/* A2 */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                A2
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1">Elementary German</h3>
              <p className="text-xs text-stone-700 mb-4 leading-relaxed">
                Past tense (Perfekt), Dativ case, two-way prepositions, modal verbs, and subordinate clauses.
              </p>
              <ul className="space-y-2 text-xs text-stone-700 mb-6">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 10 In-Depth Lessons</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 400+ Vocabulary Bank</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Sentence Ordering Drills</li>
              </ul>
              <button
                onClick={() => onNavigate('lessons')}
                className="w-full py-2 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 transition-colors"
              >
                Explore A2 Lessons
              </button>
            </div>

            {/* B1 */}
            <div className="p-6 rounded-3xl bg-amber-500/5 border-2 border-amber-500/30 hover:shadow-lg transition-all group relative">
              <div className="absolute top-4 right-4 px-2 py-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full">
                Key Exam Level
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg mb-4">
                B1
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1">Intermediate Fluency</h3>
              <p className="text-xs text-stone-700 mb-4 leading-relaxed">
                Passiv, Konjunktiv II, relative clauses, two-part connectors, and official Goethe/telc B1 prep.
              </p>
              <ul className="space-y-2 text-xs text-stone-700 mb-6">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 12 Advanced Lessons</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 600+ Flashcard Bank</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Full Mock Exam Simulator</li>
              </ul>
              <button
                onClick={() => onNavigate('lessons')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Explore B1 Lessons
              </button>
            </div>

            {/* B2 */}
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 hover:border-amber-400 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                B2
              </div>
              <h3 className="font-bold text-lg text-stone-900 mb-1">Professional & Academic</h3>
              <p className="text-xs text-stone-700 mb-4 leading-relaxed">
                Nomen-Verb-Verbindungen, participial attributes, passive substitutes, and academic essay writing.
              </p>
              <ul className="space-y-2 text-xs text-stone-700 mb-6">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 15 Mastery Modules</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> AI Essay & Writing Grader</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> University/Job Readiness</li>
              </ul>
              <button
                onClick={() => onNavigate('lessons')}
                className="w-full py-2 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 transition-colors"
              >
                Explore B2 Lessons
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 sm:py-24 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900">
              Engineered for Real Long-Term Retention
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              We combined cognitive science, Goethe-Institut exam standards, and responsive software to ensure you never forget German.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Spaced Repetition (SRS)</h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Our SM-2 flashcard algorithm schedules vocabulary reviews right before you are about to forget them, ensuring high-yield words stick permanently.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">Goethe & telc Exam Simulators</h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Take realistic timed mock examinations for A1, A2, B1, and B2 with instant pass/fail scoring, question analytics, and certificate verification.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900">AI German Tutor & Examiner</h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                Powered by Gemini models to diagnose grammar mistakes in your sentences, evaluate essays line-by-line, and explain complex German nuances on demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> Affordable Transparent Pricing
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-stone-900">
            Invest in Your German Future
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Free forever for core A1–A2 grammar & basic practice. Upgrade to DeutschMeister Premium for full B1–B2 curriculum, mock exams, and AI writing evaluation.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openPaywallModal}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>View Plans (eSewa / Khalti / Cards)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('grammar')}
              className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm rounded-xl transition-colors"
            >
              Browse Grammar Library
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
