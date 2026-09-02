export type GermanLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type QuestionType =
  | 'multiple_choice'
  | 'fill_in_blank'
  | 'article_choice'
  | 'plural_form'
  | 'vocabulary_match'
  | 'translation'
  | 'sentence_ordering'
  | 'grammar_identification'
  | 'reading_comprehension'
  | 'error_correction'
  | 'true_false';

export type ArticleGender = 'der' | 'die' | 'das' | 'none';

export type UserGoal =
  | 'learn_german'
  | 'pass_exam'
  | 'study_germany'
  | 'ausbildung'
  | 'work'
  | 'travel'
  | 'improve_vocabulary'
  | 'improve_grammar';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  level: GermanLevel;
  goal: UserGoal;
  dailyGoalMinutes: number;
  dailyGoalQuestions: number;
  xp: number;
  streak: number;
  lastActiveDate: string;
  isPremium: boolean;
  subscription?: Subscription;
  hideFromLeaderboard: boolean;
  avatarUrl?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'premium';
  provider: 'esewa' | 'khalti' | 'card' | 'demo';
  status: 'active' | 'cancelled' | 'expired';
  amount: number;
  currency: string;
  transactionId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface Question {
  id: string;
  level: GermanLevel;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: QuestionType;
  question: string;
  contextPassage?: string;
  sentenceWithBlank?: string;
  wordsForOrdering?: string[];
  options: string[];
  correctAnswer: string;
  explanation: string;
  exampleSentence?: string;
  xp: number;
  isPremium: boolean;
  audioText?: string;
}

export interface VocabularyItem {
  id: string;
  germanWord: string;
  article: ArticleGender;
  plural: string;
  englishMeaning: string;
  exampleSentence: string;
  exampleTranslation: string;
  level: GermanLevel;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pronunciationIpa?: string;
  synonyms?: string[];
  audioText?: string;
}

export interface UserVocabularySRS {
  id: string;
  userId: string;
  vocabularyId: string;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewed: string;
  nextReview: string;
  easeFactor: number;
  intervalDays: number;
  srsStage: number; // 0 to 5 Leitner box
}

export interface GrammarTopic {
  id: string;
  level: GermanLevel;
  category: string;
  title: string;
  slug: string;
  summary: string;
  explanationMarkdown: string;
  rules: { ruleTitle: string; ruleDescription: string; example: string }[];
  tables?: { title: string; headers: string[]; rows: string[][] }[];
  commonMistakes: { incorrect: string; correct: string; reason: string }[];
  isPremium: boolean;
  practiceTopicKey: string;
}

export interface LessonSection {
  title: string;
  content: string;
  germanExamples: { german: string; english: string; audioText?: string }[];
  tips?: string[];
}

export interface Lesson {
  id: string;
  level: GermanLevel;
  unitNumber: number;
  lessonNumber: number;
  title: string;
  slug: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  xpReward: number;
  isPremium: boolean;
  summary: string;
  sections: LessonSection[];
  miniQuizQuestions: Question[];
}

export interface StudyNote {
  id: string;
  level: GermanLevel;
  title: string;
  slug: string;
  category: string;
  summary: string;
  contentMarkdown: string;
  isPremium: boolean;
  keyFormulas: string[];
  downloadableTitle: string;
}

export interface MistakeRecord {
  id: string;
  userId: string;
  questionId: string;
  questionPrompt: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  topic: string;
  level: GermanLevel;
  timestamp: string;
  resolved: boolean;
}

export interface ExamSession {
  id: string;
  userId: string;
  level: GermanLevel;
  questionCount: number;
  timeLimitMinutes: number;
  score: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  timeSpentSeconds: number;
  weakTopics: string[];
  strongTopics: string[];
  questionResults: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    topic: string;
  }[];
  timestamp: string;
}

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  level: GermanLevel;
  questions: Question[];
  xpReward: number;
  isCompleted?: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  iconName: string;
  category: 'questions' | 'vocabulary' | 'streak' | 'levels' | 'mastery';
  xpReward: number;
  targetCount: number;
  currentCount?: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  level: GermanLevel;
  xp: number;
  questionsCount: number;
  accuracy: number;
  streak: number;
  isPremium: boolean;
  isCurrentUser?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'streak' | 'challenge' | 'achievement' | 'lesson' | 'premium' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface UserProgressAnalytics {
  overallAccuracy: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  vocabularyLearnedCount: number;
  currentStreak: number;
  totalXp: number;
  level: GermanLevel;
  dailyGoalProgress: { target: number; completed: number };
  dailyActivity: { date: string; questionsCount: number; xpEarned: number }[];
  weeklyActivity: { day: string; questionsCount: number; accuracy: number }[];
  topicMastery: { topic: string; total: number; correct: number; accuracy: number }[];
  strongestTopics: string[];
  weakestTopics: string[];
  grammarProgressPercentage: number;
  vocabularyProgressPercentage: number;
  levelProgress: { [key in GermanLevel]: number };
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalRevenueNpr: number;
  newUsersToday: number;
  questionsAnsweredTotal: number;
  dailyActiveUsers: number;
  conversionRate: number;
  recentUsers: User[];
  recentPayments: Subscription[];
}

export interface AISuggestionResponse {
  explanation: string;
  examples: { german: string; english: string }[];
  relatedRules: string[];
  tips: string[];
}

export interface AIWritingCorrection {
  originalText: string;
  correctedText: string;
  overallFeedback: string;
  scoreOut10: number;
  mistakes: {
    originalSegment: string;
    correction: string;
    errorType: 'grammar' | 'vocabulary' | 'word_order' | 'spelling' | 'style';
    explanation: string;
  }[];
  advancedAlternatives: string[];
}
