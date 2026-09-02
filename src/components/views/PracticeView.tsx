import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { triggerConfetti } from '../../lib/confetti';
import { Question, CEFRLevel } from '../../types';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Layers,
  Award,
  Flame,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface PracticeViewProps {
  onNavigate: (view: string) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const { selectedLevel, playGermanAudio, openPaywallModal } = useLearning();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeLevelFilter, setActiveLevelFilter] = useState<CEFRLevel>(selectedLevel);
  const [activeTopicFilter, setActiveTopicFilter] = useState<string>('all');

  // Interactive question states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fillBlankInput, setFillBlankInput] = useState('');
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  // Submission result states
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionTotalAnswered, setSessionTotalAnswered] = useState(0);
  const [sessionXpEarned, setSessionXpEarned] = useState(0);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getQuestions({
        level: activeLevelFilter,
        topic: activeTopicFilter !== 'all' ? activeTopicFilter : undefined,
        limit: 50,
      });
      setQuestions(res.questions);
      setCurrentIndex(0);
      resetAnswerState();
    } catch (e) {
      console.error('Failed to load questions', e);
    } finally {
      setLoading(false);
    }
  }, [activeLevelFilter, activeTopicFilter]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion: Question | undefined = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      resetAnswerState();
      if (currentQuestion.questionType === 'sentence_ordering' && currentQuestion.wordsForOrdering) {
        // Shuffle words for sentence ordering
        const words = [...currentQuestion.wordsForOrdering].sort(() => Math.random() - 0.5);
        setAvailableWords(words);
        setOrderedWords([]);
      }
    }
  }, [currentIndex, currentQuestion]);

  const resetAnswerState = () => {
    setSelectedOption(null);
    setFillBlankInput('');
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleCheckAnswer = async () => {
    if (!currentQuestion || isAnswered) return;

    let userAns = '';
    let correct = false;

    if (currentQuestion.questionType === 'sentence_ordering') {
      userAns = orderedWords.join(' ');
      correct = userAns.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    } else if (currentQuestion.questionType === 'fill_in_blank' && !currentQuestion.options?.length) {
      userAns = fillBlankInput.trim();
      correct = userAns.toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    } else {
      userAns = selectedOption || '';
      correct = userAns.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    }

    setIsAnswered(true);
    setIsCorrect(correct);
    setSessionTotalAnswered((prev) => prev + 1);

    if (correct) {
      setSessionCorrectCount((prev) => prev + 1);
      setSessionXpEarned((prev) => prev + (currentQuestion.xp || 10));
      triggerConfetti();
    }

    // Play German audio pronunciation of example or prompt
    playGermanAudio(currentQuestion.exampleSentence || currentQuestion.correctAnswer);

    // Save to database if logged in
    if (isAuthenticated) {
      try {
        await api.submitPracticeAnswer({
          questionId: currentQuestion.id,
          userAnswer: userAns,
          isCorrect: correct,
        });
      } catch (err) {
        console.warn('Could not record practice score', err);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed current pool, reshuffle or load more
      fetchQuestions();
    }
  };

  const handleAddWordToOrder = (word: string, index: number) => {
    if (isAnswered) return;
    setOrderedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveWordFromOrder = (word: string, index: number) => {
    if (isAnswered) return;
    setOrderedWords((prev) => prev.filter((_, i) => i !== index));
    setAvailableWords((prev) => [...prev, word]);
  };

  const topicsList = ['all', 'Articles', 'Akkusativ', 'Dativ', 'Perfekt', 'Nebensätze', 'Passiv', 'Konjunktiv II', 'Nomen-Verb-Verbindungen'];

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Practice Header Controls */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-stone-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h1 className="font-serif font-bold text-2xl text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Adaptive Practice Engine
              </h1>
              <p className="text-xs text-stone-700 mt-0.5">
                Targeted German grammar drills with instant audio pronunciation and rule explanations.
              </p>
            </div>

            {/* Session Stats Counter */}
            <div className="flex items-center gap-3 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-200 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-amber-700">
                <Award className="w-4 h-4 text-amber-500" />
                <span>+{sessionXpEarned} XP</span>
              </div>
              <span className="text-stone-300">|</span>
              <div className="text-stone-700">
                Score: <span className="text-emerald-600">{sessionCorrectCount}</span>/{sessionTotalAnswered}
              </div>
            </div>
          </div>

          {/* Filters (Level & Topic) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {/* Level Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-700 mr-1">Level:</span>
              {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  id={`practice_level_${lvl}`}
                  onClick={() => setActiveLevelFilter(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeLevelFilter === lvl
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Topic Filter Selector */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
              <span className="text-xs font-bold text-stone-700 shrink-0">Topic:</span>
              <select
                value={activeTopicFilter}
                onChange={(e) => setActiveTopicFilter(e.target.value)}
                className="text-xs font-medium border border-stone-300 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {topicsList.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All Topics' : t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Question Container Card */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-xs">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold text-stone-500">Loading German practice questions...</p>
          </div>
        ) : !currentQuestion ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200 shadow-xs space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-bold text-lg text-stone-900">No Questions Found</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              No questions matched the selected level ({activeLevelFilter}) and topic ({activeTopicFilter}). Try choosing "All Topics".
            </p>
            <button
              onClick={() => {
                setActiveTopicFilter('all');
              }}
              className="px-5 py-2 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 relative">
            {/* Question Header & Meta */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-bold">
                  {currentQuestion.level}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold">
                  {currentQuestion.topic}
                </span>
                {currentQuestion.isPremium && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    Premium
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-stone-700">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Reading Comprehension Passage (if applicable) */}
            {currentQuestion.contextPassage && (
              <div className="my-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
                <div className="text-[11px] font-sans font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Lesetext (Reading Passage):
                </div>
                {currentQuestion.contextPassage}
              </div>
            )}

            {/* Question Prompt */}
            <div className="my-6 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 leading-snug">
                  {currentQuestion.question}
                </h2>
                <button
                  onClick={() => playGermanAudio(currentQuestion.sentenceWithBlank || currentQuestion.question)}
                  title="Listen to German Audio"
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {currentQuestion.sentenceWithBlank && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 font-serif text-lg sm:text-xl text-stone-900 font-semibold tracking-wide">
                  {currentQuestion.sentenceWithBlank}
                </div>
              )}
            </div>

            {/* Question Input / Option Selection Area */}
            <div className="space-y-4">
              {/* Type 1: Sentence Ordering */}
              {currentQuestion.questionType === 'sentence_ordering' && (
                <div className="space-y-4">
                  {/* Target ordered sentence box */}
                  <div className="min-h-16 p-4 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/50 flex flex-wrap gap-2 items-center">
                    {orderedWords.length === 0 ? (
                      <span className="text-xs text-stone-700 italic">
                        Click the word chips below in the correct German order...
                      </span>
                    ) : (
                      orderedWords.map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRemoveWordFromOrder(word, idx)}
                          disabled={isAnswered}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-xs hover:bg-amber-600 transition-all cursor-pointer"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available word chips pool */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {availableWords.map((word, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddWordToOrder(word, idx)}
                        disabled={isAnswered}
                        className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs border border-stone-200 transition-all cursor-pointer"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Type 2: Standard Options (Article Choice / Multiple Choice / Error Correction / Translation) */}
              {currentQuestion.options && currentQuestion.options.length > 0 && currentQuestion.questionType !== 'sentence_ordering' && (
                <div
                  className={`grid gap-3 ${
                    currentQuestion.questionType === 'article_choice'
                      ? 'grid-cols-2 sm:grid-cols-4'
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isTheCorrectOne = option.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

                    let btnClass = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';

                    if (isSelected && !isAnswered) {
                      btnClass = 'bg-amber-100 border-amber-500 text-amber-900 font-bold ring-2 ring-amber-500/20';
                    }

                    if (isAnswered) {
                      if (isTheCorrectOne) {
                        btnClass = 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-md';
                      } else if (isSelected && !isTheCorrectOne) {
                        btnClass = 'bg-rose-500 border-rose-600 text-white font-bold';
                      } else {
                        btnClass = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        id={`practice_opt_${idx}`}
                        onClick={() => {
                          if (!isAnswered) {
                            setSelectedOption(option);
                            playGermanAudio(option);
                          }
                        }}
                        disabled={isAnswered}
                        className={`p-3.5 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between text-left ${btnClass}`}
                      >
                        <span>{option}</span>
                        {isAnswered && isTheCorrectOne && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                        {isAnswered && isSelected && !isTheCorrectOne && <XCircle className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 3: Open Fill in the Blank Input */}
              {currentQuestion.questionType === 'fill_in_blank' && (!currentQuestion.options || currentQuestion.options.length === 0) && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={fillBlankInput}
                    onChange={(e) => setFillBlankInput(e.target.value)}
                    disabled={isAnswered}
                    placeholder="Type your German answer..."
                    className="w-full p-3.5 rounded-2xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Result & Rule Explanation Feedback Banner */}
            {isAnswered && (
              <div
                className={`mt-6 p-5 rounded-2xl border animate-in fade-in space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Richtig! Well done (+{currentQuestion.xp || 10} XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Nicht ganz richtig! Correct answer: <strong>{currentQuestion.correctAnswer}</strong></span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  {currentQuestion.explanation}
                </p>

                {currentQuestion.exampleSentence && (
                  <div className="pt-2 text-xs text-stone-800 flex items-center gap-2 font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Example: <em>"{currentQuestion.exampleSentence}"</em></span>
                    <button
                      onClick={() => playGermanAudio(currentQuestion.exampleSentence || '')}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="text-xs text-stone-700 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-stone-700" />
                <span>Need help? Check the Grammar Encyclopedia</span>
              </div>

              {!isAnswered ? (
                <button
                  id="check_answer_btn"
                  onClick={handleCheckAnswer}
                  disabled={
                    (currentQuestion.questionType === 'sentence_ordering' && orderedWords.length === 0) ||
                    (currentQuestion.options?.length && !selectedOption) ||
                    (!currentQuestion.options?.length && !fillBlankInput.trim())
                  }
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-40"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  id="next_question_btn"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
