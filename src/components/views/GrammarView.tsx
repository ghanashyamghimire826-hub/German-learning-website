import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { GrammarTopic, CEFRLevel } from '../../types';
import {
  Layers,
  Search,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Bot,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface GrammarViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const GrammarView: React.FC<GrammarViewProps> = ({ onNavigate }) => {
  const { isPremium } = useAuth();
  const { playGermanAudio, openPaywallModal } = useLearning();

  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [activeLevel, setActiveLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGrammar() {
      setLoading(true);
      try {
        const list = await api.getGrammarTopics(activeLevel !== 'all' ? activeLevel : undefined);
        setTopics(list);
        if (list.length > 0 && !selectedTopic) {
          setSelectedTopic(list[0]);
        }
      } catch (e) {
        console.error('Failed to load grammar topics', e);
      } finally {
        setLoading(false);
      }
    }
    loadGrammar();
  }, [activeLevel]);

  const filteredTopics = topics.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.titleGerman.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAskAIAboutTopic = (topicName: string) => {
    onNavigate('ai_tutor', topicName);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
                <Layers className="w-6 h-6 text-amber-500" />
                German Grammar Encyclopedia
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Clear rules, declension tables, common traps, and instant AI tutor explanations from A1 to B2.
              </p>
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
              {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeLevel === lvl
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lvl === 'all' ? 'All Levels' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grammar rules (e.g. Akkusativ, Passiv, Konjunktiv, Two-way prepositions)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Grammar Content Layout (Sidebar + Reader) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Topics Directory */}
          <div className="lg:col-span-4 space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-xs font-bold text-stone-400">Loading topics...</div>
            ) : filteredTopics.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                No grammar topics found matching "{searchQuery}".
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isSelected = selectedTopic?.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-500/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                        {topic.level}
                      </span>
                      {topic.isPremium && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          Premium
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-sm text-stone-900">{topic.title}</h3>
                    <div className="text-[11px] text-stone-500 italic mt-0.5">{topic.titleGerman}</div>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Topic Reader */}
          <div className="lg:col-span-8">
            {selectedTopic ? (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8">
                {/* Topic Header */}
                <div className="pb-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 font-bold text-xs">
                        Level {selectedTopic.level}
                      </span>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Grammar Guide
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900">
                      {selectedTopic.title}
                    </h2>
                    <div className="text-sm font-medium text-amber-700 italic mt-0.5">
                      {selectedTopic.titleGerman}
                    </div>
                  </div>

                  {/* Ask AI Tutor CTA */}
                  <button
                    onClick={() => handleAskAIAboutTopic(selectedTopic.title)}
                    className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all hover:scale-[1.02] shrink-0"
                  >
                    <Bot className="w-4 h-4 text-amber-400" />
                    <span>Ask AI Tutor</span>
                  </button>
                </div>

                {/* Explanation */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Core Rule & Mechanics
                  </h3>
                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                    {selectedTopic.explanation}
                  </div>
                </div>

                {/* Formula Box */}
                {selectedTopic.formula && (
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-900 space-y-1">
                    <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      Grammar Formula / Sentence Pattern:
                    </div>
                    <div className="font-mono font-bold text-sm sm:text-base text-amber-950">
                      {selectedTopic.formula}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {selectedTopic.examples && selectedTopic.examples.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Real Example Sentences
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedTopic.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="font-serif font-bold text-sm sm:text-base text-stone-900">
                              {ex.german}
                            </div>
                            <div className="text-xs text-stone-600 mt-0.5">{ex.english}</div>
                            {ex.note && (
                              <div className="text-[11px] text-amber-800 font-medium mt-1">
                                Note: {ex.note}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => playGermanAudio(ex.german)}
                            title="Listen to German audio"
                            className="p-2 rounded-xl bg-white hover:bg-stone-200 text-stone-700 transition-colors shadow-2xs shrink-0"
                          >
                            <Volume2 className="w-4 h-4 text-amber-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Common Pitfalls / Traps */}
                {selectedTopic.commonPitfalls && selectedTopic.commonPitfalls.length > 0 && (
                  <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 text-stone-900 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Common Student Pitfalls to Avoid:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-950 font-medium">
                      {selectedTopic.commonPitfalls.map((pitfall, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{pitfall}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practice Questions for this rule */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs text-stone-500">
                    Ready to test your mastery of {selectedTopic.title}?
                  </div>
                  <button
                    onClick={() => onNavigate('practice')}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <span>Practice {selectedTopic.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-stone-500">Select a topic to read the full guide.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
