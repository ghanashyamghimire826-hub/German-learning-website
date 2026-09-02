import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Question,
  VocabularyItem,
  GrammarTopic,
  Lesson,
  StudyNote,
  MistakeRecord,
  ExamSession,
  DailyChallenge,
  Achievement,
  Subscription,
  NotificationItem,
  UserVocabularySRS,
  UserProgressAnalytics,
  AdminDashboardStats,
} from '../src/types';
import { SEED_GRAMMAR_TOPICS } from '../src/data/seedGrammar';
import { SEED_LESSONS } from '../src/data/seedLessons';
import { SEED_NOTES } from '../src/data/seedNotes';
import { INITIAL_ACHIEVEMENTS } from '../src/data/seedAchievements';
import { generateFullQuestionCatalog } from '../src/data/seedQuestions';
import { generateFullVocabularyCatalog } from '../src/data/seedVocabulary';

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  questions: Question[];
  vocabulary: VocabularyItem[];
  grammarTopics: GrammarTopic[];
  lessons: Lesson[];
  notes: StudyNote[];
  mistakes: MistakeRecord[];
  examSessions: ExamSession[];
  dailyChallenges: DailyChallenge[];
  achievements: Achievement[];
  userAchievements: { userId: string; achievementCode: string; unlockedAt: string }[];
  subscriptions: Subscription[];
  notifications: NotificationItem[];
  userVocabularySRS: UserVocabularySRS[];
  userLessonCompletions: { userId: string; lessonId: string; completedAt: string }[];
  userPracticeStats: {
    userId: string;
    totalAnswered: number;
    correctCount: number;
    activityHistory: { date: string; questionsCount: number; xpEarned: number }[];
    topicStats: { [topic: string]: { total: number; correct: number } };
  }[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error parsing db.json, re-initializing...', err);
      }
    }
    return this.initializeDefaultDatabase();
  }

  private saveDatabase(): void {
    try {
      this.ensureDataDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  private initializeDefaultDatabase(): DatabaseSchema {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('DemoUser123!', salt);
    const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'AdminPassword123!', salt);

    const defaultAdmin: User & { passwordHash: string } = {
      id: 'usr_admin_01',
      name: 'DeutschMeister Admin',
      email: process.env.ADMIN_EMAIL || 'admin@deutschmeister.de',
      role: 'admin',
      level: 'B2',
      goal: 'work',
      dailyGoalMinutes: 30,
      dailyGoalQuestions: 20,
      xp: 4500,
      streak: 42,
      lastActiveDate: new Date().toISOString().split('T')[0],
      isPremium: true,
      hideFromLeaderboard: false,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      status: 'active',
      passwordHash: adminPasswordHash,
    };

    const demoUser: User & { passwordHash: string } = {
      id: 'usr_demo_01',
      name: 'Alex Neumann',
      email: 'demo@deutschmeister.de',
      role: 'user',
      level: 'A2',
      goal: 'pass_exam',
      dailyGoalMinutes: 20,
      dailyGoalQuestions: 15,
      xp: 1250,
      streak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      isPremium: false,
      hideFromLeaderboard: false,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      status: 'active',
      passwordHash: demoPasswordHash,
    };

    const initialQuestions = generateFullQuestionCatalog();
    const initialVocabulary = generateFullVocabularyCatalog();

    const todayStr = new Date().toISOString().split('T')[0];
    const initialDailyChallenge: DailyChallenge = {
      id: `dc_${todayStr}`,
      date: todayStr,
      title: 'Tages-Challenge: Akkusativ & Präpositionen',
      description: 'Solve 10 targeted German drill questions and earn +50 XP bonus + keep your streak burning!',
      level: 'A2',
      questions: initialQuestions.slice(0, 10),
      xpReward: 50,
    };

    const initialNotifications: NotificationItem[] = [
      {
        id: 'notif_welcome',
        userId: 'usr_demo_01',
        type: 'system',
        title: 'Willkommen bei DeutschMeister!',
        message: 'Start your daily streak with today’s challenge and explore structured A1–B2 lessons.',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ];

    const initialDemoMistakes: MistakeRecord[] = [
      {
        id: 'mst_01',
        userId: 'usr_demo_01',
        questionId: 'q_a1_004',
        questionPrompt: 'Ich möchte bitte ___ Kaffee trinken.',
        userAnswer: 'ein',
        correctAnswer: 'einen',
        explanation: 'Kaffee ist maskulin (der Kaffee). Als Akkusativobjekt wird "ein" zu "einen".',
        topic: 'Akkusativ',
        level: 'A1',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        resolved: false,
      },
      {
        id: 'mst_02',
        userId: 'usr_demo_01',
        questionId: 'q_a2_001',
        questionPrompt: 'Gestern ___ wir nach München gefahren.',
        userAnswer: 'haben',
        correctAnswer: 'sind',
        explanation: 'Fahren ist ein Verb der Ortsveränderung und bildet das Perfekt mit "sein".',
        topic: 'Perfekt',
        level: 'A2',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        resolved: false,
      },
    ];

    const schema: DatabaseSchema = {
      users: [defaultAdmin, demoUser],
      questions: initialQuestions,
      vocabulary: initialVocabulary,
      grammarTopics: SEED_GRAMMAR_TOPICS,
      lessons: SEED_LESSONS,
      notes: SEED_NOTES,
      mistakes: initialDemoMistakes,
      examSessions: [],
      dailyChallenges: [initialDailyChallenge],
      achievements: INITIAL_ACHIEVEMENTS,
      userAchievements: [
        { userId: 'usr_demo_01', achievementCode: 'first_question', unlockedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
        { userId: 'usr_admin_01', achievementCode: 'first_question', unlockedAt: new Date(Date.now() - 50 * 86400000).toISOString() },
        { userId: 'usr_admin_01', achievementCode: '100_questions', unlockedAt: new Date(Date.now() - 40 * 86400000).toISOString() },
      ],
      subscriptions: [],
      notifications: initialNotifications,
      userVocabularySRS: [],
      userLessonCompletions: [
        { userId: 'usr_demo_01', lessonId: 'les_a1_01', completedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
      ],
      userPracticeStats: [
        {
          userId: 'usr_demo_01',
          totalAnswered: 48,
          correctCount: 41,
          activityHistory: [
            { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], questionsCount: 12, xpEarned: 120 },
            { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], questionsCount: 10, xpEarned: 100 },
            { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], questionsCount: 14, xpEarned: 140 },
            { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], questionsCount: 12, xpEarned: 120 },
          ],
          topicStats: {
            Articles: { total: 15, correct: 14 },
            Akkusativ: { total: 12, correct: 9 },
            Dativ: { total: 10, correct: 8 },
            Perfekt: { total: 11, correct: 10 },
          },
        },
      ],
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(schema, null, 2), 'utf-8');
    return schema;
  }

  // ===================== USER & AUTH METHODS =====================
  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: User & { passwordHash: string }) {
    this.data.users.push(user);
    this.data.userPracticeStats.push({
      userId: user.id,
      totalAnswered: 0,
      correctCount: 0,
      activityHistory: [],
      topicStats: {},
    });
    this.saveDatabase();
    return user;
  }

  public updateUser(id: string, updates: Partial<User & { passwordHash?: string }>) {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.data.users[index] = { ...this.data.users[index], ...updates };
      this.saveDatabase();
      return this.data.users[index];
    }
    return null;
  }

  public getAllUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  // ===================== QUESTIONS =====================
  public getQuestions(filter?: { level?: string; topic?: string; isPremium?: boolean; limit?: number; offset?: number }) {
    let result = this.data.questions;
    if (filter?.level) {
      result = result.filter((q) => q.level === filter.level);
    }
    if (filter?.topic) {
      result = result.filter((q) => q.topic.toLowerCase() === filter.topic?.toLowerCase());
    }
    if (filter?.isPremium !== undefined) {
      result = result.filter((q) => q.isPremium === filter.isPremium);
    }
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 50;
    return {
      total: result.length,
      questions: result.slice(offset, offset + limit),
    };
  }

  public getQuestionById(id: string) {
    return this.data.questions.find((q) => q.id === id);
  }

  public addQuestion(question: Question) {
    this.data.questions.push(question);
    this.saveDatabase();
    return question;
  }

  public updateQuestion(id: string, updates: Partial<Question>) {
    const idx = this.data.questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      this.data.questions[idx] = { ...this.data.questions[idx], ...updates };
      this.saveDatabase();
      return this.data.questions[idx];
    }
    return null;
  }

  public deleteQuestion(id: string) {
    const idx = this.data.questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      this.data.questions.splice(idx, 1);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // ===================== VOCABULARY =====================
  public getVocabulary(filter?: { level?: string; topic?: string; search?: string; limit?: number; offset?: number }) {
    let result = this.data.vocabulary;
    if (filter?.level) {
      result = result.filter((v) => v.level === filter.level);
    }
    if (filter?.topic) {
      result = result.filter((v) => v.topic.toLowerCase() === filter.topic?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.germanWord.toLowerCase().includes(q) ||
          v.englishMeaning.toLowerCase().includes(q) ||
          v.exampleSentence.toLowerCase().includes(q)
      );
    }
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 50;
    return {
      total: result.length,
      items: result.slice(offset, offset + limit),
    };
  }

  public addVocabulary(item: VocabularyItem) {
    this.data.vocabulary.push(item);
    this.saveDatabase();
    return item;
  }

  public updateVocabulary(id: string, updates: Partial<VocabularyItem>) {
    const idx = this.data.vocabulary.findIndex((v) => v.id === id);
    if (idx !== -1) {
      this.data.vocabulary[idx] = { ...this.data.vocabulary[idx], ...updates };
      this.saveDatabase();
      return this.data.vocabulary[idx];
    }
    return null;
  }

  public deleteVocabulary(id: string) {
    const idx = this.data.vocabulary.findIndex((v) => v.id === id);
    if (idx !== -1) {
      this.data.vocabulary.splice(idx, 1);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // ===================== GRAMMAR & LESSONS =====================
  public getGrammarTopics(level?: string) {
    if (level) {
      return this.data.grammarTopics.filter((g) => g.level === level);
    }
    return this.data.grammarTopics;
  }

  public getGrammarTopicBySlug(slug: string) {
    return this.data.grammarTopics.find((g) => g.slug === slug);
  }

  public getLessons(level?: string) {
    if (level) {
      return this.data.lessons.filter((l) => l.level === level);
    }
    return this.data.lessons;
  }

  public getLessonBySlug(slug: string) {
    return this.data.lessons.find((l) => l.slug === slug);
  }

  public completeLesson(userId: string, lessonId: string) {
    const existing = this.data.userLessonCompletions.find(
      (c) => c.userId === userId && c.lessonId === lessonId
    );
    if (!existing) {
      this.data.userLessonCompletions.push({
        userId,
        lessonId,
        completedAt: new Date().toISOString(),
      });
      // Award XP to user
      const user = this.data.users.find((u) => u.id === userId);
      if (user) {
        user.xp += 100;
      }
      this.saveDatabase();
    }
    return true;
  }

  public getUserCompletedLessonIds(userId: string): string[] {
    return this.data.userLessonCompletions
      .filter((c) => c.userId === userId)
      .map((c) => c.lessonId);
  }

  // ===================== NOTES =====================
  public getNotes(level?: string) {
    if (level) {
      return this.data.notes.filter((n) => n.level === level);
    }
    return this.data.notes;
  }

  public getNoteBySlug(slug: string) {
    return this.data.notes.find((n) => n.slug === slug);
  }

  // ===================== MISTAKES =====================
  public getMistakes(userId: string, filter?: { topic?: string; level?: string }) {
    let result = this.data.mistakes.filter((m) => m.userId === userId && !m.resolved);
    if (filter?.level) {
      result = result.filter((m) => m.level === filter.level);
    }
    if (filter?.topic) {
      result = result.filter((m) => m.topic.toLowerCase() === filter.topic?.toLowerCase());
    }
    return result;
  }

  public recordMistake(mistake: Omit<MistakeRecord, 'id' | 'timestamp' | 'resolved'>) {
    const newRecord: MistakeRecord = {
      ...mistake,
      id: `mst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    this.data.mistakes.push(newRecord);
    this.saveDatabase();
    return newRecord;
  }

  public resolveMistake(userId: string, mistakeId: string) {
    const m = this.data.mistakes.find((item) => item.id === mistakeId && item.userId === userId);
    if (m) {
      m.resolved = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // ===================== SRS FLASHCARDS =====================
  public getUserSRSItems(userId: string) {
    return this.data.userVocabularySRS.filter((s) => s.userId === userId);
  }

  public saveSRSItem(item: UserVocabularySRS) {
    const idx = this.data.userVocabularySRS.findIndex(
      (s) => s.userId === item.userId && s.vocabularyId === item.vocabularyId
    );
    if (idx !== -1) {
      this.data.userVocabularySRS[idx] = item;
    } else {
      this.data.userVocabularySRS.push(item);
    }
    this.saveDatabase();
  }

  // ===================== EXAM SESSIONS =====================
  public recordExamSession(session: ExamSession) {
    this.data.examSessions.push(session);
    const user = this.data.users.find((u) => u.id === session.userId);
    if (user) {
      user.xp += 100;
    }
    this.saveDatabase();
    return session;
  }

  public getUserExamHistory(userId: string) {
    return this.data.examSessions.filter((e) => e.userId === userId);
  }

  // ===================== DAILY CHALLENGES =====================
  public getDailyChallenge(dateStr: string): DailyChallenge {
    let challenge = this.data.dailyChallenges.find((c) => c.date === dateStr);
    if (!challenge) {
      const questions = this.data.questions.slice(0, 10);
      challenge = {
        id: `dc_${dateStr}`,
        date: dateStr,
        title: `Tages-Challenge: ${dateStr}`,
        description: 'Solve 10 practice questions to boost your XP and maintain your daily streak.',
        level: 'A2',
        questions,
        xpReward: 50,
      };
      this.data.dailyChallenges.push(challenge);
      this.saveDatabase();
    }
    return challenge;
  }

  // ===================== USER STATS & PRACTICE SUBMISSION =====================
  public recordAnswerSubmission(
    userId: string,
    questionId: string,
    userAnswer: string,
    isCorrect: boolean
  ) {
    const user = this.data.users.find((u) => u.id === userId);
    const question = this.data.questions.find((q) => q.id === questionId);
    if (!user || !question) return;

    // 1. Update user XP and Streak
    const today = new Date().toISOString().split('T')[0];
    if (user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastActiveDate = today;
    }

    if (isCorrect) {
      user.xp += question.xp || 10;
    } else {
      this.recordMistake({
        userId,
        questionId,
        questionPrompt: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        topic: question.topic,
        level: question.level,
      });
    }

    // 2. Update user practice statistics
    let stats = this.data.userPracticeStats.find((s) => s.userId === userId);
    if (!stats) {
      stats = {
        userId,
        totalAnswered: 0,
        correctCount: 0,
        activityHistory: [],
        topicStats: {},
      };
      this.data.userPracticeStats.push(stats);
    }

    stats.totalAnswered += 1;
    if (isCorrect) stats.correctCount += 1;

    // Update daily activity history
    const todayAct = stats.activityHistory.find((a) => a.date === today);
    if (todayAct) {
      todayAct.questionsCount += 1;
      if (isCorrect) todayAct.xpEarned += question.xp || 10;
    } else {
      stats.activityHistory.push({
        date: today,
        questionsCount: 1,
        xpEarned: isCorrect ? question.xp || 10 : 0,
      });
    }

    // Update topic statistics
    if (!stats.topicStats[question.topic]) {
      stats.topicStats[question.topic] = { total: 0, correct: 0 };
    }
    stats.topicStats[question.topic].total += 1;
    if (isCorrect) stats.topicStats[question.topic].correct += 1;

    // 3. Check Achievements
    this.checkUserAchievements(userId, stats);

    this.saveDatabase();
  }

  private checkUserAchievements(userId: string, stats: any) {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) return;

    const unlocked = this.data.userAchievements.filter((a) => a.userId === userId).map((a) => a.achievementCode);

    if (!unlocked.includes('first_question') && stats.totalAnswered >= 1) {
      this.grantAchievement(userId, 'first_question', 25);
    }
    if (!unlocked.includes('100_questions') && stats.totalAnswered >= 100) {
      this.grantAchievement(userId, '100_questions', 100);
    }
    if (!unlocked.includes('7_day_streak') && user.streak >= 7) {
      this.grantAchievement(userId, '7_day_streak', 150);
    }
  }

  private grantAchievement(userId: string, code: string, xp: number) {
    this.data.userAchievements.push({
      userId,
      achievementCode: code,
      unlockedAt: new Date().toISOString(),
    });
    const user = this.data.users.find((u) => u.id === userId);
    if (user) user.xp += xp;

    this.data.notifications.push({
      id: `notif_ach_${Date.now()}`,
      userId,
      type: 'achievement',
      title: 'Neuer Erfolg freigeschaltet! 🏆',
      message: `Du hast den Erfolg "${code}" erreicht und +${xp} XP erhalten!`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  public getUserAnalytics(userId: string): UserProgressAnalytics {
    const user = this.data.users.find((u) => u.id === userId);
    const stats = this.data.userPracticeStats.find((s) => s.userId === userId) || {
      userId,
      totalAnswered: 0,
      correctCount: 0,
      activityHistory: [],
      topicStats: {},
    };

    const srsList = this.data.userVocabularySRS.filter((s) => s.userId === userId);
    const accuracy = stats.totalAnswered > 0 ? Math.round((stats.correctCount / stats.totalAnswered) * 100) : 100;

    const topicMastery = Object.entries(stats.topicStats).map(([topic, val]) => ({
      topic,
      total: val.total,
      correct: val.correct,
      accuracy: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
    }));

    const sortedTopics = [...topicMastery].sort((a, b) => b.accuracy - a.accuracy);
    const strongestTopics = sortedTopics.slice(0, 3).map((t) => t.topic);
    const weakestTopics = [...topicMastery]
      .filter((t) => t.total >= 3)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)
      .map((t) => t.topic);

    const completedLessonCount = this.data.userLessonCompletions.filter((c) => c.userId === userId).length;
    const totalLessons = Math.max(1, this.data.lessons.length);

    // Activity for last 7 days
    const last7Days: { day: string; questionsCount: number; accuracy: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dStr = d.toISOString().split('T')[0];
      const found = stats.activityHistory.find((a) => a.date === dStr);
      last7Days.push({
        day: dayNames[d.getDay()],
        questionsCount: found ? found.questionsCount : 0,
        accuracy: found ? 85 : 0,
      });
    }

    return {
      overallAccuracy: accuracy,
      totalQuestionsAnswered: stats.totalAnswered,
      correctAnswersCount: stats.correctCount,
      vocabularyLearnedCount: srsList.length,
      currentStreak: user?.streak || 1,
      totalXp: user?.xp || 0,
      level: user?.level || 'A1',
      dailyGoalProgress: {
        target: user?.dailyGoalQuestions || 15,
        completed: stats.activityHistory.find((a) => a.date === new Date().toISOString().split('T')[0])?.questionsCount || 0,
      },
      dailyActivity: stats.activityHistory.slice(-30),
      weeklyActivity: last7Days,
      topicMastery,
      strongestTopics: strongestTopics.length ? strongestTopics : ['Articles', 'Greetings'],
      weakestTopics: weakestTopics.length ? weakestTopics : ['Akkusativ', 'Dativ'],
      grammarProgressPercentage: Math.min(100, Math.round((completedLessonCount / totalLessons) * 100)),
      vocabularyProgressPercentage: Math.min(100, Math.round((srsList.length / 100) * 100)),
      levelProgress: {
        A1: 85,
        A2: user?.level === 'A1' ? 20 : 65,
        B1: user?.level === 'B1' || user?.level === 'B2' ? 50 : 10,
        B2: user?.level === 'B2' ? 40 : 0,
      },
    };
  }

  // ===================== LEADERBOARD =====================
  public getLeaderboard(currentUserId?: string) {
    const visibleUsers = this.data.users.filter((u) => !u.hideFromLeaderboard && u.status === 'active');
    const sorted = [...visibleUsers].sort((a, b) => b.xp - a.xp);

    return sorted.map((user, idx) => {
      const stats = this.data.userPracticeStats.find((s) => s.userId === user.id);
      const total = stats?.totalAnswered || 1;
      const correct = stats?.correctCount || 1;
      const accuracy = Math.round((correct / total) * 100);

      return {
        rank: idx + 1,
        userId: user.id,
        name: user.name,
        level: user.level,
        xp: user.xp,
        questionsCount: stats?.totalAnswered || 0,
        accuracy: Math.min(100, accuracy),
        streak: user.streak,
        isPremium: user.isPremium,
        isCurrentUser: user.id === currentUserId,
      };
    });
  }

  // ===================== SUBSCRIPTION & PAYMENT =====================
  public addSubscription(sub: Subscription) {
    this.data.subscriptions.push(sub);
    const user = this.data.users.find((u) => u.id === sub.userId);
    if (user && sub.status === 'active') {
      user.isPremium = true;
      user.subscription = sub;
    }
    this.saveDatabase();
    return sub;
  }

  public cancelSubscription(userId: string) {
    const sub = this.data.subscriptions.find((s) => s.userId === userId && s.status === 'active');
    if (sub) {
      sub.status = 'cancelled';
      sub.autoRenew = false;
    }
    this.saveDatabase();
    return sub;
  }

  // ===================== ADMIN METRICS =====================
  public getAdminStats(): AdminDashboardStats {
    const totalUsers = this.data.users.length;
    const activeUsers = this.data.users.filter((u) => u.status === 'active').length;
    const premiumUsers = this.data.users.filter((u) => u.isPremium).length;
    const totalRevenueNpr = this.data.subscriptions.reduce((sum, s) => sum + (s.status === 'active' ? s.amount : 0), premiumUsers * 50);
    const questionsAnsweredTotal = this.data.userPracticeStats.reduce((sum, s) => sum + s.totalAnswered, 0);

    return {
      totalUsers,
      activeUsers,
      premiumUsers,
      totalRevenueNpr,
      newUsersToday: 2,
      questionsAnsweredTotal,
      dailyActiveUsers: Math.max(1, Math.round(activeUsers * 0.65)),
      conversionRate: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0,
      recentUsers: this.data.users.slice(-10).map(({ passwordHash, ...u }) => u),
      recentPayments: this.data.subscriptions.slice(-10),
    };
  }

  // ===================== NOTIFICATIONS =====================
  public getUserNotifications(userId: string) {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(userId: string, notifId: string) {
    const n = this.data.notifications.find((item) => item.id === notifId && item.userId === userId);
    if (n) {
      n.read = true;
      this.saveDatabase();
      return true;
    }
    return false;
  }
}

export const db = new DatabaseManager();
