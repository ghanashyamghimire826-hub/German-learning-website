import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { AdminDashboardStats, User, CEFRLevel } from '../../types';
import {
  ShieldCheck,
  Users,
  BookOpen,
  Bookmark,
  FileCheck2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'add_question' | 'add_vocab'>('stats');
  const [loading, setLoading] = useState(true);

  // New Question Form State
  const [qLevel, setQLevel] = useState<CEFRLevel>('A1');
  const [qTopic, setQTopic] = useState('Articles');
  const [qType, setQType] = useState('article_choice');
  const [qPrompt, setQPrompt] = useState('');
  const [qBlankSentence, setQBlankSentence] = useState('');
  const [qOptions, setQOptions] = useState('der, die, das');
  const [qCorrect, setQCorrect] = useState('die');
  const [qExplanation, setQExplanation] = useState('');
  const [qSuccess, setQSuccess] = useState('');

  // New Vocab Form State
  const [vWord, setVWord] = useState('');
  const [vArticle, setVArticle] = useState('der');
  const [vMeaning, setVMeaning] = useState('');
  const [vLevel, setVLevel] = useState<CEFRLevel>('A1');
  const [vTopic, setVTopic] = useState('Daily Life');
  const [vPlural, setVPlural] = useState('');
  const [vExample, setVExample] = useState('');
  const [vSuccess, setVSuccess] = useState('');

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [st, usr] = await Promise.all([
          api.getAdminStats(),
          api.getAdminUsers(),
        ]);
        setStats(st);
        setUsersList(usr);
      } catch (e) {
        console.error('Failed to load admin data', e);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleToggleUserPremium = async (u: User) => {
    try {
      const res = await api.updateAdminUserStatus(u.id, {
        isPremium: !u.isPremium,
      });
      setUsersList((prev) => prev.map((item) => (item.id === u.id ? res.user : item)));
    } catch (e) {
      alert('Failed to update user status');
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addAdminQuestion({
        level: qLevel,
        topic: qTopic,
        questionType: qType,
        question: qPrompt,
        sentenceWithBlank: qBlankSentence || undefined,
        options: qOptions.split(',').map((s) => s.trim()),
        correctAnswer: qCorrect.trim(),
        explanation: qExplanation,
        xp: 10,
      });
      setQSuccess('Question added successfully to database!');
      setQPrompt('');
      setQExplanation('');
      setTimeout(() => setQSuccess(''), 3000);
    } catch (e: any) {
      alert(e.message || 'Error adding question');
    }
  };

  const handleCreateVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addAdminVocabulary({
        word: vWord,
        article: vArticle || undefined,
        meaning: vMeaning,
        level: vLevel,
        topic: vTopic,
        plural: vPlural || undefined,
        exampleSentence: vExample || undefined,
      });
      setVSuccess('Vocabulary item added to database!');
      setVWord('');
      setVMeaning('');
      setVExample('');
      setTimeout(() => setVSuccess(''), 3000);
    } catch (e: any) {
      alert(e.message || 'Error adding vocabulary');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 py-16 text-center">
        <div className="bg-white p-8 max-w-md mx-auto rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="font-bold text-lg text-stone-900">Administrator Access Required</h2>
          <p className="text-xs text-stone-500">
            You must be logged in as an administrator to access the DeutschMeister management portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> DeutschMeister Management Portal
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Administrator Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Manage student accounts, monitor platform metrics, and expand curriculum question banks.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-purple-900/80 rounded-2xl border border-purple-800 shrink-0">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'stats' ? 'bg-amber-400 text-stone-950' : 'text-purple-200 hover:text-white'
              }`}
            >
              Overview Stats
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users' ? 'bg-amber-400 text-stone-950' : 'text-purple-200 hover:text-white'
              }`}
            >
              Students ({usersList.length})
            </button>
            <button
              onClick={() => setActiveTab('add_question')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'add_question' ? 'bg-amber-400 text-stone-950' : 'text-purple-200 hover:text-white'
              }`}
            >
              + Add Question
            </button>
            <button
              onClick={() => setActiveTab('add_vocab')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'add_vocab' ? 'bg-amber-400 text-stone-950' : 'text-purple-200 hover:text-white'
              }`}
            >
              + Add Vocab
            </button>
          </div>
        </div>

        {/* TAB 1: PLATFORM METRICS */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" /> Total Users
                </div>
                <div className="font-serif font-bold text-3xl text-stone-900">{stats.totalUsers}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-500" /> Question Bank
                </div>
                <div className="font-serif font-bold text-3xl text-stone-900">{stats.totalQuestions}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-emerald-600" /> Vocabulary Bank
                </div>
                <div className="font-serif font-bold text-3xl text-stone-900">{stats.totalVocabulary}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-rose-500" /> Exam Sessions
                </div>
                <div className="font-serif font-bold text-3xl text-stone-900">{stats.totalExamsCompleted}</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-1">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Premium Members
                </div>
                <div className="font-serif font-bold text-3xl text-stone-900">{stats.premiumUsersCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Registered Student Accounts
              </h3>
            </div>

            <div className="divide-y divide-stone-100">
              {usersList.map((u) => (
                <div key={u.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                      <span>{u.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                        {u.role}
                      </span>
                      {u.isPremium && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Premium
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {u.email} • Level: {u.level} • {u.xp} XP • {u.streak}d streak
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleUserPremium(u)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        u.isPremium
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          : 'bg-amber-400 hover:bg-amber-500 text-stone-950 shadow-xs'
                      }`}
                    >
                      {u.isPremium ? 'Revoke Premium' : 'Grant Premium Access'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ADD QUESTION */}
        {activeTab === 'add_question' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Add New Question to Bank
            </h2>

            {qSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{qSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">CEFR Level</label>
                  <select
                    value={qLevel}
                    onChange={(e) => setQLevel(e.target.value as CEFRLevel)}
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Grammar Topic</label>
                  <input
                    type="text"
                    required
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    placeholder="e.g. Articles, Akkusativ, Passiv"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Question Type</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value)}
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="article_choice">Article Choice (der/die/das)</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="fill_in_blank">Fill in the Blank</option>
                    <option value="translation">Translation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Question Prompt</label>
                <input
                  type="text"
                  required
                  value={qPrompt}
                  onChange={(e) => setQPrompt(e.target.value)}
                  placeholder="e.g. Choose the correct definite article for 'Katze':"
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Sentence with Blank (Optional)</label>
                <input
                  type="text"
                  value={qBlankSentence}
                  onChange={(e) => setQBlankSentence(e.target.value)}
                  placeholder="e.g. Ich sehe ___ Hund im Park."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Options (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={qOptions}
                    onChange={(e) => setQOptions(e.target.value)}
                    placeholder="e.g. der, die, das"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Correct Answer</label>
                  <input
                    type="text"
                    required
                    value={qCorrect}
                    onChange={(e) => setQCorrect(e.target.value)}
                    placeholder="e.g. die"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Grammar Rule Explanation</label>
                <textarea
                  rows={3}
                  required
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Explain why this answer is correct..."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Question to Database
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: ADD VOCABULARY */}
        {activeTab === 'add_vocab' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="font-serif font-bold text-xl text-stone-900">
              Add New Vocabulary Item
            </h2>

            {vSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{vSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateVocab} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">German Word</label>
                  <input
                    type="text"
                    required
                    value={vWord}
                    onChange={(e) => setVWord(e.target.value)}
                    placeholder="e.g. Flughafen"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Article</label>
                  <select
                    value={vArticle}
                    onChange={(e) => setVArticle(e.target.value)}
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="der">der (masculine)</option>
                    <option value="die">die (feminine)</option>
                    <option value="das">das (neuter)</option>
                    <option value="">None (Verb / Adj / Prep)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">CEFR Level</label>
                  <select
                    value={vLevel}
                    onChange={(e) => setVLevel(e.target.value as CEFRLevel)}
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">English Meaning</label>
                  <input
                    type="text"
                    required
                    value={vMeaning}
                    onChange={(e) => setVMeaning(e.target.value)}
                    placeholder="e.g. airport"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Topic / Category</label>
                  <input
                    type="text"
                    required
                    value={vTopic}
                    onChange={(e) => setVTopic(e.target.value)}
                    placeholder="e.g. Travel & Places"
                    className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Example German Sentence</label>
                <input
                  type="text"
                  value={vExample}
                  onChange={(e) => setVExample(e.target.value)}
                  placeholder="e.g. Wir fahren zum Flughafen."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Add to Vocabulary Bank
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
