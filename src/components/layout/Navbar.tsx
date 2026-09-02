import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { CEFRLevel } from '../../types';
import {
  Flame,
  Award,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  FileCheck2,
  Bookmark,
  AlertTriangle,
  Bot,
  Trophy,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin, isPremium, logout } = useAuth();
  const {
    selectedLevel,
    setSelectedLevel,
    isAudioMuted,
    toggleAudioMute,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    openPaywallModal,
  } = useLearning();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: GraduationCap, authOnly: true },
    { id: 'practice', label: 'Practice', icon: Sparkles },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'grammar', label: 'Grammar', icon: Layers },
    { id: 'vocabulary', label: 'Vocab & SRS', icon: Bookmark },
    { id: 'exams', label: 'Exams', icon: FileCheck2 },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'mistakes', label: 'Mistakes', icon: AlertTriangle, authOnly: true },
    { id: 'ai_tutor', label: 'AI Tutor', icon: Bot },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              id="brand_logo_btn"
              onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-900 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="font-serif text-xl tracking-tighter">DM</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-tight text-stone-900 leading-tight">
                  Deutsch<span className="text-amber-600">Meister</span>
                </span>
                <span className="text-[10px] tracking-wider text-stone-700 font-bold uppercase">
                  Learn • Practice • Master
                </span>
              </div>
            </button>

            {/* CEFR Level Selector Pill */}
            <div className="relative hidden md:block">
              <button
                id="level_selector_btn"
                onClick={() => setIsLevelMenuOpen(!isLevelMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors border border-stone-200"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Level: <strong>{selectedLevel}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-700" />
              </button>

              {isLevelMenuOpen && (
                <div
                  id="level_dropdown_menu"
                  className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                    Select Target Level
                  </div>
                  {levels.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setSelectedLevel(lvl);
                        setIsLevelMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 ${
                        selectedLevel === lvl ? 'bg-amber-50/80 font-bold text-amber-700' : 'text-stone-700'
                      }`}
                    >
                      <span>CEFR {lvl}</span>
                      {selectedLevel === lvl && <span className="text-amber-600">● Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authOnly && !isAuthenticated) return null;
              const isActive = currentView === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  id={`nav_link_${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-700 font-bold border border-amber-500/20'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-stone-700'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Audio TTS Mute Toggle */}
            <button
              id="audio_toggle_btn"
              onClick={toggleAudioMute}
              title={isAudioMuted ? 'Audio pronunciation muted (Click to unmute)' : 'Audio pronunciation active (Click to mute)'}
              className={`p-2 rounded-lg border transition-colors ${
                isAudioMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {isAuthenticated && user && (
              <>
                {/* Streak Counter */}
                <div
                  id="user_streak_badge"
                  title={`${user.streak} day German learning streak! Keep practicing daily.`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/80 text-orange-600 font-bold text-xs shadow-xs"
                >
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
                  <span>{user.streak}d</span>
                </div>

                {/* XP Counter */}
                <div
                  id="user_xp_badge"
                  title={`${user.xp} Total German Mastery XP`}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-700 font-bold text-xs"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{user.xp} XP</span>
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    id="notif_bell_btn"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div
                      id="notifications_dropdown"
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 z-50 animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="px-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900">Notifications</span>
                        <span className="text-[11px] text-stone-700 font-medium">
                          {unreadNotificationsCount} unread
                        </span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-stone-50">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-stone-700">
                            No notifications yet. Keep practicing!
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={`p-3 text-xs cursor-pointer hover:bg-stone-50 transition-colors ${
                                !n.read ? 'bg-amber-50/40 font-medium' : ''
                              }`}
                            >
                              <div className="font-bold text-stone-900">{n.title}</div>
                              <div className="text-stone-600 mt-0.5">{n.message}</div>
                              <div className="text-[10px] text-stone-700 mt-1">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Premium Upgrade Button */}
            {!isPremium && (
              <button
                id="upgrade_premium_btn"
                onClick={openPaywallModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-stone-900 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 shadow-sm shadow-amber-500/30 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 fill-stone-900" />
                <span>Go Premium</span>
              </button>
            )}

            {/* Authentication Buttons or Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="user_profile_btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-xs border border-stone-800">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-700" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    id="profile_dropdown_menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <div className="font-bold text-sm text-stone-900 truncate">{user.name}</div>
                      <div className="text-xs text-stone-700 truncate">{user.email}</div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                          {user.level} Level
                        </span>
                        {isPremium && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Premium
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-stone-700" />
                        Profile & Learning Goals
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('analytics');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                      >
                        <Trophy className="w-3.5 h-3.5 text-stone-700" />
                        My Progress & Analytics
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          Admin Portal
                        </button>
                      )}

                      {!isPremium && (
                        <button
                          onClick={() => {
                            openPaywallModal();
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          Upgrade to Premium
                        </button>
                      )}
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                          onNavigate('landing');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav_login_btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                >
                  Log In
                </button>
                <button
                  id="nav_signup_btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-stone-900 bg-amber-400 hover:bg-amber-500 shadow-sm shadow-amber-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started Free
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              id="mobile_menu_btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div id="mobile_drawer" className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {/* Mobile CEFR Switcher */}
          <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">Target Level:</span>
            <div className="flex gap-1">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                    selectedLevel === lvl ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navLinks.map((link) => {
              if (link.authOnly && !isAuthenticated) return null;
              const isActive = currentView === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isActive ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-600" />
                  {link.label}
                </button>
              );
            })}
          </div>

          {!isPremium && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openPaywallModal();
              }}
              className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold bg-linear-to-r from-amber-400 to-amber-500 text-stone-950 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" /> Upgrade to DeutschMeister Premium
            </button>
          )}
        </div>
      )}
    </header>
  );
};
