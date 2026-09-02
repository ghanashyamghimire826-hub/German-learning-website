import React, { createContext, useContext, useState, useEffect } from 'react';
import { CEFRLevel, NotificationItem } from '../types';
import { germanAudio } from '../lib/audio';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface LearningContextType {
  selectedLevel: CEFRLevel;
  setSelectedLevel: (lvl: CEFRLevel) => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  playGermanAudio: (text: string, rate?: number) => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  activePaywallModal: boolean;
  openPaywallModal: () => void;
  closePaywallModal: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevelState] = useState<CEFRLevel>('A1');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activePaywallModal, setActivePaywallModal] = useState<boolean>(false);

  useEffect(() => {
    if (user?.level) {
      setSelectedLevelState(user.level);
    }
  }, [user?.level]);

  const setSelectedLevel = (lvl: CEFRLevel) => {
    setSelectedLevelState(lvl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dm_selected_level', lvl);
    }
  };

  const toggleAudioMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    germanAudio.setMuted(next);
  };

  const playGermanAudio = (text: string, rate: number = 0.9) => {
    if (!isAudioMuted) {
      germanAudio.speak(text, rate);
    }
  };

  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const list = await api.getNotifications();
      setNotifications(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user]);

  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      // fallback local update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <LearningContext.Provider
      value={{
        selectedLevel,
        setSelectedLevel,
        isAudioMuted,
        toggleAudioMute,
        playGermanAudio,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        refreshNotifications,
        activePaywallModal,
        openPaywallModal: () => setActivePaywallModal(true),
        closePaywallModal: () => setActivePaywallModal(false),
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error('useLearning must be used within a LearningProvider');
  return ctx;
};
