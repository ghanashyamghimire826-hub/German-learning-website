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
  UserProgressAnalytics,
  LeaderboardEntry,
  SubscriptionPlan,
  Subscription,
  NotificationItem,
  UserVocabularySRS,
  AdminDashboardStats,
} from '../types';

const TOKEN_KEY = 'dm_auth_token';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  public getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  public setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  public clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!res.ok) {
      let errorMsg = `Request failed: ${res.statusText}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.error || errJson.message || errorMsg;
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return res.json();
  }

  // Auth
  async register(data: any): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async login(data: any): Promise<{ user: User; token: string }> {
    const res = await this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  }

  async updateProfile(updates: Partial<User>): Promise<{ user: User; message: string }> {
    return this.request<{ user: User; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    return this.request<{ message: string; resetToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: any): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Questions & Practice
  async getQuestions(filter?: { level?: string; topic?: string; isPremium?: boolean; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filter?.level) params.append('level', filter.level);
    if (filter?.topic) params.append('topic', filter.topic);
    if (filter?.isPremium !== undefined) params.append('isPremium', String(filter.isPremium));
    if (filter?.limit) params.append('limit', String(filter.limit));
    if (filter?.offset) params.append('offset', String(filter.offset));
    return this.request<{ total: number; questions: Question[] }>(`/api/questions?${params.toString()}`);
  }

  async submitPracticeAnswer(data: { questionId: string; userAnswer: string; isCorrect: boolean }) {
    return this.request<{ success: boolean; user: User; xpEarned: number }>('/api/practice/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDailyChallenge(): Promise<DailyChallenge> {
    return this.request<DailyChallenge>('/api/practice/daily-challenge');
  }

  // Vocabulary & SRS
  async getVocabulary(filter?: { level?: string; topic?: string; search?: string; limit?: number; offset?: number }) {
    const params = new URLSearchParams();
    if (filter?.level) params.append('level', filter.level);
    if (filter?.topic) params.append('topic', filter.topic);
    if (filter?.search) params.append('search', filter.search);
    if (filter?.limit) params.append('limit', String(filter.limit));
    if (filter?.offset) params.append('offset', String(filter.offset));
    return this.request<{ total: number; items: VocabularyItem[] }>(`/api/vocabulary?${params.toString()}`);
  }

  async getSRSItems(): Promise<UserVocabularySRS[]> {
    return this.request<UserVocabularySRS[]>('/api/vocabulary/srs');
  }

  async reviewSRSItem(data: { vocabularyId: string; rating: string }) {
    return this.request<{ success: boolean; srsRecord: UserVocabularySRS; daysAdded: number }>('/api/vocabulary/srs/review', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Grammar & Lessons
  async getGrammarTopics(level?: string): Promise<GrammarTopic[]> {
    return this.request<GrammarTopic[]>(level ? `/api/grammar?level=${level}` : '/api/grammar');
  }

  async getGrammarTopic(slug: string): Promise<GrammarTopic> {
    return this.request<GrammarTopic>(`/api/grammar/${slug}`);
  }

  async getLessons(level?: string): Promise<Lesson[]> {
    return this.request<Lesson[]>(level ? `/api/lessons?level=${level}` : '/api/lessons');
  }

  async getLesson(slug: string): Promise<Lesson> {
    return this.request<Lesson>(`/api/lessons/${slug}`);
  }

  async completeLesson(id: string): Promise<{ success: boolean; message: string; user: User }> {
    return this.request<{ success: boolean; message: string; user: User }>(`/api/lessons/${id}/complete`, {
      method: 'POST',
    });
  }

  // Notes
  async getNotes(level?: string): Promise<StudyNote[]> {
    return this.request<StudyNote[]>(level ? `/api/notes?level=${level}` : '/api/notes');
  }

  async getNote(slug: string): Promise<StudyNote> {
    return this.request<StudyNote>(`/api/notes/${slug}`);
  }

  // Mistakes
  async getMistakes(filter?: { level?: string; topic?: string }): Promise<MistakeRecord[]> {
    const params = new URLSearchParams();
    if (filter?.level) params.append('level', filter.level);
    if (filter?.topic) params.append('topic', filter.topic);
    return this.request<MistakeRecord[]>(`/api/mistakes?${params.toString()}`);
  }

  async resolveMistake(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/mistakes/${id}/resolve`, {
      method: 'POST',
    });
  }

  // Exams
  async startExam(data: { level: string; mode?: string; totalQuestions?: number }): Promise<{
    sessionId: string;
    level: string;
    mode: string;
    totalQuestions: number;
    timeLimitMinutes: number;
    questions: Question[];
  }> {
    return this.request('/api/exams/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitExam(data: any): Promise<{ success: boolean; examRecord: ExamSession; user: User }> {
    return this.request('/api/exams/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getExamHistory(): Promise<ExamSession[]> {
    return this.request<ExamSession[]>('/api/exams/history');
  }

  // Analytics & Leaderboard
  async getAnalytics(): Promise<UserProgressAnalytics> {
    return this.request<UserProgressAnalytics>('/api/analytics');
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>('/api/leaderboard');
  }

  // Subscription & Payments
  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.request<SubscriptionPlan[]>('/api/subscription/plans');
  }

  async checkout(data: { planId: string; paymentMethod: string; currency?: string }): Promise<{
    success: boolean;
    message: string;
    subscription: Subscription;
    user: User;
  }> {
    return this.request('/api/subscription/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelSubscription(): Promise<{ success: boolean; message: string; subscription: Subscription }> {
    return this.request('/api/subscription/cancel', {
      method: 'POST',
    });
  }

  // AI Features
  async askAITutor(data: { topic: string; level?: string; userQuestion?: string }): Promise<{ explanation: string }> {
    return this.request('/api/ai/explain', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkSentenceWithAI(data: { sentence: string; targetLevel?: string }) {
    return this.request<any>('/api/ai/correct-sentence', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async evaluateEssayWithAI(data: { taskPrompt: string; userEssay: string; cefrLevel?: string }) {
    return this.request<any>('/api/ai/evaluate-essay', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin
  async getAdminStats(): Promise<AdminDashboardStats> {
    return this.request<AdminDashboardStats>('/api/admin/stats');
  }

  async getAdminUsers(): Promise<User[]> {
    return this.request<User[]>('/api/admin/users');
  }

  async updateAdminUserStatus(id: string, data: any): Promise<{ user: User }> {
    return this.request(`/api/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addAdminQuestion(data: any): Promise<Question> {
    return this.request<Question>('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminQuestion(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/admin/questions/${id}`, {
      method: 'DELETE',
    });
  }

  async addAdminVocabulary(data: any): Promise<VocabularyItem> {
    return this.request<VocabularyItem>('/api/admin/vocabulary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminVocabulary(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/admin/vocabulary/${id}`, {
      method: 'DELETE',
    });
  }
  async loginWithGoogle(credential: string): Promise<{ user: User; token: string }> {
  const res = await this.request<{ user: User; token: string }>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });

  this.setToken(res.token);
  return res;
}

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return this.request<NotificationItem[]>('/api/notifications');
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  }
}

export const api = new ApiClient();
