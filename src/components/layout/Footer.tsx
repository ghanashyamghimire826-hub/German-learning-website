import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpeg" alt="VielErfolg" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                <span className="text-amber-400">VielErfolg</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              The comprehensive, structured German mastery platform. Designed for students, professionals, and immigrants from A1 beginner to B2 fluency.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                <Award className="w-3.5 h-3.5 text-amber-400" /> CEFR A1–B2 Certified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-300 border border-stone-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Goethe / telc Aligned
              </span>
            </div>
          </div>

          {/* Learning Tracks */}
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider mb-4">
              Curriculum & Levels
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('lessons')} className="hover:text-amber-400 transition-colors">
                  A1 Beginner Essentials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lessons')} className="hover:text-amber-400 transition-colors">
                  A2 Elementary German
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lessons')} className="hover:text-amber-400 transition-colors">
                  B1 Intermediate Fluency
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lessons')} className="hover:text-amber-400 transition-colors">
                  B2 Professional & Academic
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exams')} className="hover:text-amber-400 transition-colors">
                  Mock Exam Simulators
                </button>
              </li>
            </ul>
          </div>

          {/* Tools & Features */}
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider mb-4">
              Interactive Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('practice')} className="hover:text-amber-400 transition-colors">
                  Adaptive Practice Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vocabulary')} className="hover:text-amber-400 transition-colors">
                  Spaced Repetition (SRS)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grammar')} className="hover:text-amber-400 transition-colors">
                  Grammar Encyclopedia
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai_tutor')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI German Tutor
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('notes')} className="hover:text-amber-400 transition-colors">
                  Grammar Cheatsheets
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            © {new Date().getFullYear()} VielErfolg Inc. All rights reserved. Learn German. Practice Smart. Master Deutsch.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for global German learners.
          </div>
        </div>
      </div>
    </footer>
  );
};
