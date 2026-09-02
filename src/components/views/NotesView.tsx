import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { StudyNote, CEFRLevel } from '../../types';
import { BookOpen, Search, Sparkles, Download, Check, ExternalLink } from 'lucide-react';

interface NotesViewProps {
  onNavigate: (view: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({ onNavigate }) => {
  const { isPremium } = useAuth();
  const { openPaywallModal } = useLearning();

  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      setLoading(true);
      try {
        const list = await api.getNotes(selectedLevel !== 'all' ? selectedLevel : undefined);
        setNotes(list);
      } catch (e) {
        console.error('Failed to load study notes', e);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [selectedLevel]);

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.topic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-stone-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500" />
              German Grammar Cheatsheets & Study Notes
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              High-yield summary guides, inflection tables, and memory tricks for fast exam revision.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lvl === 'all' ? 'All' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study notes (e.g. Endings, Two-way, Passiv, Connectors)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-stone-400">Loading study guides...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-amber-400 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-bold">
                      {note.level}
                    </span>
                    <span className="text-xs font-bold text-amber-700">{note.topic}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-stone-900">{note.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">{note.summary}</p>

                  {/* Bullet points */}
                  {note.keyPoints && note.keyPoints.length > 0 && (
                    <ul className="space-y-2 text-xs text-stone-800 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                      {note.keyPoints.map((kp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('practice')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    Practice this Topic <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!isPremium) openPaywallModal();
                      else alert('Downloading Printable Cheatsheet PDF...');
                    }}
                    className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-600" />
                    <span>PDF Cheatsheet</span>
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
