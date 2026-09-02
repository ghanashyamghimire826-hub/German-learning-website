import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { triggerConfetti } from '../../lib/confetti';
import { VocabularyItem, UserVocabularySRS, CEFRLevel } from '../../types';
import {
  Bookmark,
  Sparkles,
  Volume2,
  RotateCw,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
  Zap,
} from 'lucide-react';

export const VocabularyView: React.FC = () => {
  const { user, isAuthenticated, isPremium } = useAuth();
  const { selectedLevel, playGermanAudio, openPaywallModal } = useLearning();

  const [activeTab, setActiveTab] = useState<'srs' | 'catalog'>('srs');
  const [vocabItems, setVocabItems] = useState<VocabularyItem[]>([]);
  const [srsQueue, setSrsQueue] = useState<UserVocabularySRS[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search and filters for catalog
  const [catalogLevel, setCatalogLevel] = useState<string>('all');
  const [catalogTopic, setCatalogTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [vocabRes, srsRes] = await Promise.all([
          api.getVocabulary({ limit: 100 }),
          isAuthenticated ? api.getSRSItems().catch(() => []) : Promise.resolve([]),
        ]);
        setVocabItems(vocabRes.items);
        setSrsQueue(srsRes);
      } catch (err) {
        console.error('Failed to load vocabulary', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated]);

  // Handle reviewing SRS Flashcard with SM-2 algorithm ratings
  const handleRateCard = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    if (isAuthenticated) {
      try {
        await api.reviewSRSItem({
          vocabularyId: currentCard.id,
          rating,
        });
      } catch (err) {
        console.warn('SRS review failed', err);
      }
    }

    if (rating === 'good' || rating === 'easy') {
      triggerConfetti();
    }

    // Move to next card
    setIsFlipped(false);
    if (currentCardIndex < (displayList.length - 1)) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const displayList = vocabItems;
  const currentCard: VocabularyItem | undefined = displayList[currentCardIndex];

  // Helper for article colors
  const getArticleColor = (article?: string) => {
    if (article === 'der') return 'text-blue-600 bg-blue-50 border-blue-200';
    if (article === 'die') return 'text-rose-600 bg-rose-50 border-rose-200';
    if (article === 'das') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    return 'text-stone-700 bg-stone-100 border-stone-200';
  };

  const filteredCatalog = vocabItems.filter((item) => {
    const wordText = (item.word || item.germanWord || '').toLowerCase();
    const meaningText = (item.meaning || item.englishMeaning || '').toLowerCase();
    const topicText = (item.topic || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      wordText.includes(q) ||
      meaningText.includes(q) ||
      topicText.includes(q);
    const matchesLevel = catalogLevel === 'all' || item.level === catalogLevel;
    const matchesTopic = catalogTopic === 'all' || item.topic === catalogTopic;
    return matchesSearch && matchesLevel && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header and Switcher */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-amber-500" />
              Vocabulary & Spaced Repetition (SRS)
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Supercharge your German recall using SM-2 algorithm flashcards and native audio pronunciation.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              onClick={() => {
                setActiveTab('srs');
                setIsFlipped(false);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'srs'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Flashcards (SRS)</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Vocab Catalog ({vocabItems.length})</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Spaced Repetition Flashcards */}
        {activeTab === 'srs' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {currentCard ? (
              <div className="space-y-6">
                {/* Flashcard Header Progress */}
                <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-2">
                  <span>
                    Card {currentCardIndex + 1} of {displayList.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-[10px] font-bold">
                      {currentCard.level}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                      {currentCard.topic}
                    </span>
                  </div>
                </div>

                {/* 3D Flashcard Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[340px] bg-white rounded-3xl p-8 sm:p-12 border-2 border-stone-200 hover:border-amber-400 shadow-md cursor-pointer transition-all flex flex-col justify-between text-center relative group"
                >
                  {/* Flip Prompt Hint */}
                  <div className="absolute top-4 right-4 text-[11px] font-bold text-stone-400 flex items-center gap-1 group-hover:text-amber-600">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isFlipped ? 'Show Front' : 'Click to Flip'}</span>
                  </div>

                  {!isFlipped ? (
                    /* FRONT OF CARD */
                    <div className="my-auto space-y-4">
                      {currentCard.article && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getArticleColor(
                            currentCard.article
                          )}`}
                        >
                          {currentCard.article}
                        </span>
                      )}

                      <div className="font-serif font-bold text-3xl sm:text-4xl text-stone-900 tracking-tight">
                        {currentCard.article ? `${currentCard.article} ` : ''}
                        {currentCard.word || currentCard.germanWord}
                      </div>

                      {(currentCard.ipa || currentCard.pronunciationIpa) && (
                        <div className="text-xs font-mono text-stone-400">
                          [{currentCard.ipa || currentCard.pronunciationIpa}]
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const w = currentCard.word || currentCard.germanWord || '';
                          playGermanAudio(
                            currentCard.article
                              ? `${currentCard.article} ${w}`
                              : w
                          );
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors mx-auto"
                      >
                        <Volume2 className="w-4 h-4 text-amber-600" />
                        <span>Listen Audio</span>
                      </button>
                    </div>
                  ) : (
                    /* BACK OF CARD */
                    <div className="my-auto space-y-4 animate-in fade-in">
                      <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        English Translation
                      </div>

                      <div className="font-serif font-bold text-2xl sm:text-3xl text-amber-600">
                        "{currentCard.meaning || currentCard.englishMeaning}"
                      </div>

                      {currentCard.plural && (
                        <div className="text-xs text-stone-600">
                          Plural: <strong>die {currentCard.plural}</strong>
                        </div>
                      )}

                      {currentCard.exampleSentence && (
                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 font-medium italic">
                          "{currentCard.exampleSentence}"
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-[11px] text-stone-400">
                    {isFlipped ? 'Rate your recall difficulty below' : 'Tap anywhere to reveal meaning'}
                  </div>
                </div>

                {/* SM-2 Spaced Repetition Action Rating Buttons */}
                {isFlipped ? (
                  <div className="grid grid-cols-4 gap-2 pt-2 animate-in fade-in">
                    <button
                      onClick={() => handleRateCard('again')}
                      className="py-3 px-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all text-center"
                    >
                      <div className="text-sm font-extrabold">Again</div>
                      <div className="text-[10px] text-rose-600 font-medium mt-0.5">&lt; 1 day</div>
                    </button>

                    <button
                      onClick={() => handleRateCard('hard')}
                      className="py-3 px-2 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-all text-center"
                    >
                      <div className="text-sm font-extrabold">Hard</div>
                      <div className="text-[10px] text-orange-600 font-medium mt-0.5">2 days</div>
                    </button>

                    <button
                      onClick={() => handleRateCard('good')}
                      className="py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all text-center"
                    >
                      <div className="text-sm font-extrabold">Good</div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-0.5">4 days</div>
                    </button>

                    <button
                      onClick={() => handleRateCard('easy')}
                      className="py-3 px-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all text-center"
                    >
                      <div className="text-sm font-extrabold">Easy</div>
                      <div className="text-[10px] text-amber-600 font-medium mt-0.5">7 days</div>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all"
                  >
                    Reveal Translation & Details
                  </button>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-xs font-bold text-stone-500">
                Loading flashcards...
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Vocabulary Catalog Directory */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search German words, English meaning, topic..."
                  className="w-full pl-10 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={catalogLevel}
                  onChange={(e) => setCatalogLevel(e.target.value)}
                  className="text-xs font-medium border border-stone-300 rounded-xl px-3 py-2 bg-white focus:outline-none"
                >
                  <option value="all">All CEFR Levels</option>
                  <option value="A1">A1 Level</option>
                  <option value="A2">A2 Level</option>
                  <option value="B1">B1 Level</option>
                  <option value="B2">B2 Level</option>
                </select>

                <select
                  value={catalogTopic}
                  onChange={(e) => setCatalogTopic(e.target.value)}
                  className="text-xs font-medium border border-stone-300 rounded-xl px-3 py-2 bg-white focus:outline-none"
                >
                  <option value="all">All Topics</option>
                  <option value="Daily Life">Daily Life</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Travel & Places">Travel & Places</option>
                  <option value="Work & Business">Work & Business</option>
                  <option value="Grammar Connectors">Grammar Connectors</option>
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {item.article && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getArticleColor(
                            item.article
                          )}`}
                        >
                          {item.article}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-bold">
                        {item.level}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const w = item.word || item.germanWord || '';
                        playGermanAudio(item.article ? `${item.article} ${w}` : w);
                      }}
                      title="Pronounce"
                      className="p-1.5 rounded-lg bg-stone-50 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {item.article ? `${item.article} ` : ''}
                      {item.word || item.germanWord}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">
                      {item.meaning || item.englishMeaning}
                    </p>
                  </div>

                  {item.exampleSentence && (
                    <div className="text-[11px] text-stone-500 italic line-clamp-2 border-t border-stone-100 pt-2">
                      "{item.exampleSentence}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
