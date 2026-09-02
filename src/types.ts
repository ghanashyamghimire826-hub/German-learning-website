export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type UserRole = 'user' | 'admin';

export type UserStatus = 'active' | 'suspended';

export type LearningGoal = 'pass_exam' | 'work' | 'study' | 'travel' | 'general';

export type QuestionType =
  | 'article_choice'
  | 'multiple_choice'
  | 'fill_in_blank'
  | 'sentence_ordering'
  | 'error_correction'
  | 'translation'
  | 'reading_comprehension'
  | string;

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'phrase'
  | string;

export type PaymentGateway = 'esewa' | 'khalti' | 'fonepay' | 'card' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  level: CEFRLevel;
  goal: LearningGoal;
  dailyGoalMinutes: number;
  streak: number;
  xp: number;
  isPremium: boolean;
  premiumUntil?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  level: CEFRLevel | string;
  topic: string;
  questionType: QuestionType;
  question: string;
  sentenceWithBlank?: string;
  contextPassage?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  exampleSentence?: string;
  audioText?: string;
  wordsForOrdering?: string[];
  xp?: number;
  difficulty?: string;
  isPremium?: boolean;
  [key: string]: any;
}

export interface VocabularyItem {
  id: string;
  word?: string;
  germanWord?: string;
  german?: string;
  article?: 'der' | 'die' | 'das' | 'none' | string;
  type?: PartOfSpeech;
  partOfSpeech?: PartOfSpeech;
  level: CEFRLevel | string;
  meaning?: string;
  english?: string;
  englishMeaning?: string;
  plural?: string;
  ipa?: string;
  pronunciation?: string;
  pronunciationIpa?: string;
  topic: string;
  exampleSentence?: string;
  example?: string;
  exampleTranslation?: string;
  notes?: string;
  difficulty?: string;
  isPremium?: boolean;
  [key: string]: any;
}

export interface GrammarTopic {
  id: string;
  slug: string;
  title: string;
  titleGerman: string;
  level: CEFRLevel | string;
  category?: string;
  summary: string;
  explanation: string;
  formula?: string;
  tables?: { title: string; headers: string[]; rows: string[][] }[];
  examples: { german: string; english: string; note?: string }[];
  commonPitfalls: string[];
  isPremium?: boolean;
  [key: string]: any;
}

export interface Lesson {
  id: string;
  slug: string;
  level: CEFRLevel | string;
  unit: number;
  order: number;
  title: string;
  titleGerman: string;
  estimatedMinutes: number;
  xpReward: number;
  objectives: string[];
  content: string;
  grammarRules?: string[];
  vocabularyList?: { german: string; english: string; type: string; example?: string }[];
  miniQuizQuestions?: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    level?: string;
    [key: string]: any;
  }[];
  isPremium?: boolean;
  [key: string]: any;
}

export interface StudyNote {
  id: string;
  slug: string;
  title: string;
  level: CEFRLevel | string;
  topic: string;
  category?: string;
  summary: string;
  keyPoints: string[];
  downloadablePdf?: boolean;
  [key: string]: any;
}

export interface MistakeRecord {
  id: string;
  userId: string;
  questionId: string;
  question?: Question;
  lastAnswer: string;
  timesFailed: number;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExamSession {
  id: string;
  userId: string;
  level: CEFRLevel;
  mode?: string;
  questionCount?: number;
  timeLimitMinutes?: number;
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  scorePercentage?: number;
  percentage?: number;
  passed: boolean;
  timeSpentSeconds?: number;
  date?: string;
  startedAt?: string;
  completedAt?: string;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect?: boolean;
  }[];
}

export interface UserVocabularySRS {
  id: string;
  userId: string;
  vocabularyId: string;
  vocabulary?: VocabularyItem;
  srsStage?: number;
  easeFactor?: number;
  intervalDays?: number;
  reviewCount?: number;
  correctCount?: number;
  incorrectCount?: number;
  lastReviewedAt?: string;
  nextReviewDate?: string;
  lastReviewed?: string;
  nextReview?: string;
}

export interface DailyChallenge {
  date: string;
  question: Question;
  xpReward: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

export interface UserProgressAnalytics {
  totalXp: number;
  streakDays: number;
  overallAccuracy: number;
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  levelProgress: {
    A1: number;
    A2: number;
    B1: number;
    B2: number;
  };
  topicAccuracy: { [topic: string]: number };
  dailyGoalProgress: {
    target: number;
    completed: number;
  };
  weeklyActivity: {
    day: string;
    count: number;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  level: CEFRLevel;
  xp: number;
  streak: number;
  accuracy: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  durationMonths: number;
  priceNPR: number;
  priceEUR: number;
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId?: string;
  plan?: string;
  status: 'active' | 'cancelled' | 'expired';
  paymentGateway?: PaymentGateway;
  paymentMethod?: string;
  provider?: string;
  amount: number;
  currency: string;
  transactionId: string;
  startDate: string;
  endDate?: string;
  expiresAt: string;
  autoRenew: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'streak' | 'exam' | 'system' | 'achievement';
  read: boolean;
  createdAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalVocabulary: number;
  totalLessons: number;
  totalExamsCompleted: number;
  premiumUsersCount: number;
  revenueEstimateNPR: number;
}
