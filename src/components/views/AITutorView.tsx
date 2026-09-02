import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { Bot, Sparkles, Send, CheckCircle2, AlertCircle, Volume2, BookOpen, PenTool } from 'lucide-react';

interface AITutorViewProps {
  initialTopic?: string;
}

export const AITutorView: React.FC<AITutorViewProps> = ({ initialTopic }) => {
  const { isPremium } = useAuth();
  const { playGermanAudio, openPaywallModal } = useLearning();

  const [activeTab, setActiveTab] = useState<'explain' | 'correct' | 'essay'>('explain');

  // Tab 1: Grammar Explainer State
  const [explainPrompt, setExplainPrompt] = useState(initialTopic || 'Passiv im Präsens und Perfekt');
  const [explainLevel, setExplainLevel] = useState('B1');
  const [explainResult, setExplainResult] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  // Tab 2: Sentence Corrector State
  const [sentenceInput, setSentenceInput] = useState('Ich bin gestern nach Hause gegangen weil ich war müde.');
  const [sentenceResult, setSentenceResult] = useState<any>(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);

  // Tab 3: Essay Evaluator State
  const [essayTask, setEssayTask] = useState('Write an email (80 words) to your landlord complaining about a broken heater in your apartment.');
  const [essayText, setEssayText] = useState('Sehr geehrter Herr Müller,\n\nich schreibe Ihnen, weil die Heizung in meiner Wohnung seit zwei Tagen nicht funktioniert. Es ist sehr kalt hier. Bitte schicken Sie einen Handwerker so schnell wie möglich.\n\nMit freundlichen Grüßen,\nLukas');
  const [essayResult, setEssayResult] = useState<any>(null);
  const [essayLoading, setEssayLoading] = useState(false);

  // Handlers
  const handleExplain = async () => {
    if (!explainPrompt.trim()) return;
    setExplainLoading(true);
    setExplainResult(null);

    try {
      const res = await api.askAITutor({
        topic: explainPrompt,
        level: explainLevel,
      });
      setExplainResult(res.explanation);
    } catch (err: any) {
      setExplainResult('AI Tutor service temporarily busy. Please try again in a moment.');
    } finally {
      setExplainLoading(false);
    }
  };

  const handleCorrectSentence = async () => {
    if (!sentenceInput.trim()) return;
    setSentenceLoading(true);
    setSentenceResult(null);

    try {
      const res = await api.checkSentenceWithAI({
        sentence: sentenceInput,
      });
      setSentenceResult(res);
    } catch (err: any) {
      alert('Sentence check error. Please try again.');
    } finally {
      setSentenceLoading(false);
    }
  };

  const handleEvaluateEssay = async () => {
    if (!essayText.trim()) return;
    if (!isPremium) {
      openPaywallModal();
      return;
    }

    setEssayLoading(true);
    setEssayResult(null);

    try {
      const res = await api.evaluateEssayWithAI({
        taskPrompt: essayTask,
        userEssay: essayText,
        cefrLevel: 'B1',
      });
      setEssayResult(res);
    } catch (err: any) {
      alert('Essay evaluation error. Please try again.');
    } finally {
      setEssayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              AI German Tutor & Writing Examiner
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-lg">
              Get customized grammar breakdowns, instantaneous sentence error diagnoses, and full exam writing evaluations.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-800 rounded-2xl border border-stone-700 shrink-0">
            <button
              onClick={() => setActiveTab('explain')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'explain' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              Grammar Explainer
            </button>
            <button
              onClick={() => setActiveTab('correct')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'correct' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              Sentence Checker
            </button>
            <button
              onClick={() => setActiveTab('essay')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'essay' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              Writing Examiner
            </button>
          </div>
        </div>

        {/* TAB 1: GRAMMAR EXPLAINER */}
        {activeTab === 'explain' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-500" />
                Ask Any German Question or Grammar Nuance
              </h2>
              <select
                value={explainLevel}
                onChange={(e) => setExplainLevel(e.target.value)}
                className="text-xs font-semibold border border-stone-300 rounded-xl px-3 py-1.5 bg-white"
              >
                <option value="A1">CEFR A1 Context</option>
                <option value="A2">CEFR A2 Context</option>
                <option value="B1">CEFR B1 Context</option>
                <option value="B2">CEFR B2 Context</option>
              </select>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                value={explainPrompt}
                onChange={(e) => setExplainPrompt(e.target.value)}
                placeholder="e.g. When do I use 'als' vs 'wenn'? Or explain Passiv mit Modalverben."
                className="w-full p-4 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleExplain}
                  disabled={explainLoading || !explainPrompt.trim()}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-40"
                >
                  {explainLoading ? (
                    <span>AI is Thinking...</span>
                  ) : (
                    <>
                      <span>Explain in Depth</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {explainResult && (
              <div className="p-6 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>AI Tutor Pedagogical Breakdown</span>
                </div>
                <div className="text-xs sm:text-sm text-stone-800 whitespace-pre-line leading-relaxed font-medium">
                  {explainResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SENTENCE CHECKER */}
        {activeTab === 'correct' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-emerald-600" />
              German Sentence Diagnoser & Instant Corrector
            </h2>
            <p className="text-xs text-stone-500">
              Type or paste any German sentence. The AI diagnoses word order, verb conjugation, case endings, and prepositions.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                placeholder="Type a German sentence (e.g. Ich habe gegessen gestern einen Apfel)..."
                className="w-full p-4 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleCorrectSentence}
                  disabled={sentenceLoading || !sentenceInput.trim()}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all disabled:opacity-40"
                >
                  {sentenceLoading ? 'Analyzing Sentence...' : 'Check Sentence'}
                </button>
              </div>
            </div>

            {sentenceResult && (
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sentenceResult.isCorrect ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct (Grammatikalisch Richtig)
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Errors Detected & Fixed
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-stone-400">
                    CEFR Level: {sentenceResult.detectedLevel || 'A2–B1'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Corrected German Sentence:
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-stone-200 font-serif font-bold text-base sm:text-lg text-stone-900 flex items-center justify-between">
                    <span>{sentenceResult.correctedSentence}</span>
                    <button
                      onClick={() => playGermanAudio(sentenceResult.correctedSentence)}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  {sentenceResult.detailedExplanation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ESSAY & WRITING EXAMINER */}
        {activeTab === 'essay' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Goethe / telc Writing & Essay Examiner
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Get full analytical grading with CEFR benchmarks, grammar error corrections, and task feedback.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Exam Task / Prompt:
                </label>
                <input
                  type="text"
                  value={essayTask}
                  onChange={(e) => setEssayTask(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your German Text / Essay:
                </label>
                <textarea
                  rows={6}
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  className="w-full p-4 rounded-xl border border-stone-300 text-xs sm:text-sm font-serif focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateEssay}
                  disabled={essayLoading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all"
                >
                  {essayLoading ? 'AI Examiner is Grading...' : 'Grade Writing Assignment'}
                </button>
              </div>
            </div>

            {essayResult && (
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-6 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-serif font-bold text-stone-900">
                      {essayResult.scoreOutOf100} / 100
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        essayResult.scoreOutOf100 >= 60
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {essayResult.scoreOutOf100 >= 60 ? 'Exam Pass' : 'Needs Practice'}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-stone-500">
                    Assessed Level: {essayResult.evaluatedCEFRLevel}
                  </div>
                </div>

                {/* Feedback summary */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Examiner Feedback:
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                    {essayResult.overallFeedback}
                  </p>
                </div>

                {/* Corrected rewrite */}
                {essayResult.improvedVersion && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Polished Native Version:
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-900 font-serif leading-relaxed whitespace-pre-line">
                      {essayResult.improvedVersion}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
