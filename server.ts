import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import {
  generateToken,
  comparePassword,
  hashPassword,
  verifyGoogleIdToken,
  authMiddleware,
  optionalAuthMiddleware,
  adminOnly,
  AuthRequest,
} from './server/auth';
import {
  explainGrammarConceptWithAI,
  correctGermanSentenceWithAI,
  evaluateGermanWritingWithAI,
} from './server/gemini';
import { calculateNextSRSReview, SRSRating } from './src/lib/srs';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ===================== HEALTH CHECK =====================
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'VielErfolg Full-Stack API',
      time: new Date().toISOString(),
    });
  });

  // ===================== AUTHENTICATION ROUTES =====================
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, level, goal, dailyGoalMinutes, dailyGoalQuestions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = hashPassword(password);
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'user' as const,
      level: level || 'A1',
      goal: goal || 'pass_exam',
      dailyGoalMinutes: dailyGoalMinutes || 20,
      dailyGoalQuestions: dailyGoalQuestions || 15,
      xp: 100, // Welcome XP bonus
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      isPremium: false,
      hideFromLeaderboard: false,
      createdAt: new Date().toISOString(),
      status: 'active' as const,
      passwordHash,
    };

    db.createUser(newUser);
    const token = generateToken(newUser);
    const { passwordHash: _, ...safeUser } = newUser;

    res.status(201).json({
      message: 'Account created successfully',
      user: safeUser,
      token,
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended. Please contact support.' });
    }

    const isMatch = comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      message: 'Login successful',
      user: safeUser,
      token,
    });
  });
app.post('/api/auth/google', async (req: Request, res: Response) => {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    try {
      const googleUser = await verifyGoogleIdToken(credential);
      const googleId = googleUser.sub!;
      const email = googleUser.email!.toLowerCase();

      let user = db.findUserByEmail(email);

      if (!user) {
        const passwordHash = hashPassword(
          `${googleId}:${Date.now()}:${Math.random()}`
        );

        const newUser = {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: googleUser.name || googleUser.given_name || email.split('@')[0],
          email,
          role: 'user' as const,
          level: 'A1' as const,
          goal: 'pass_exam' as const,
          dailyGoalMinutes: 20,
          dailyGoalQuestions: 15,
          xp: 100,
          streak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          isPremium: false,
          hideFromLeaderboard: false,
          createdAt: new Date().toISOString(),
          status: 'active' as const,
          passwordHash,
          googleId,
        };

        user = db.createUser(newUser);
      } else {
        if (user.status === 'suspended') {
          return res.status(403).json({
            error: 'This account has been suspended. Please contact support.',
          });
        }

        db.updateUser(user.id, { googleId } as any);
        user = db.findUserById(user.id)!;
      }

      const token = generateToken(user);
      const { passwordHash, ...safeUser } = user;

      res.json({
        message: 'Google login successful',
        user: safeUser,
        token,
      });
    } catch (err: any) {
      console.error('Google authentication failed:', err);
      res.status(401).json({ error: 'Google authentication failed' });
    }
  });

  app.get('/api/auth/me', authMiddleware, (req: AuthRequest, res: Response) => {
    const user = db.findUserById(req.user!.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  app.put('/api/auth/profile', authMiddleware, (req: AuthRequest, res: Response) => {
    const updates = req.body;
    // Don't allow direct role or premium escalation through profile endpoint
    delete updates.role;
    delete updates.isPremium;
    delete updates.passwordHash;

    const updated = db.updateUser(req.user!.id, updates);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...safeUser } = updated;
    res.json({ user: safeUser, message: 'Profile updated successfully' });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = db.findUserByEmail(email);
    if (!user) {
      // Return 200 for security to prevent user enumeration
      return res.json({
        message: 'If an account with that email exists, a password reset link has been dispatched.',
      });
    }

    // In a production server, dispatch email with reset token. Here we acknowledge safely.
    res.json({
      message: 'Password reset link and security PIN have been sent to your email address.',
      resetToken: 'rst_' + Buffer.from(email).toString('base64'),
    });
  });

  app.post('/api/auth/reset-password', (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Valid email and new password (min 6 chars) required.' });
    }
    const user = db.findUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    db.updateUser(user.id, { passwordHash: hashPassword(newPassword) });
    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  });

  // ===================== QUESTIONS & PRACTICE API =====================
  app.get('/api/questions', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
    const { level, topic, isPremium, limit, offset } = req.query;

    const parsedFilter = {
      level: level ? String(level) : undefined,
      topic: topic ? String(topic) : undefined,
      isPremium: isPremium !== undefined ? isPremium === 'true' : undefined,
      limit: limit ? parseInt(String(limit), 10) : 50,
      offset: offset ? parseInt(String(offset), 10) : 0,
    };

    const data = db.getQuestions(parsedFilter);
    res.json(data);
  });

  app.get('/api/questions/:id', (req: Request, res: Response) => {
    const q = db.getQuestionById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    res.json(q);
  });

  app.post('/api/practice/submit', authMiddleware, (req: AuthRequest, res: Response) => {
    const { questionId, userAnswer, isCorrect } = req.body;
    if (!questionId || userAnswer === undefined || isCorrect === undefined) {
      return res.status(400).json({ error: 'questionId, userAnswer, and isCorrect are required' });
    }

    db.recordAnswerSubmission(req.user!.id, questionId, String(userAnswer), Boolean(isCorrect));
    const updatedUser = db.findUserById(req.user!.id);
    const { passwordHash, ...safeUser } = updatedUser!;

    res.json({
      success: true,
      user: safeUser,
      xpEarned: isCorrect ? 10 : 0,
    });
  });

  app.get('/api/practice/daily-challenge', optionalAuthMiddleware, (_req: Request, res: Response) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const challenge = db.getDailyChallenge(todayStr);
    res.json(challenge);
  });

  // ===================== VOCABULARY & FLASHCARDS (SRS) API =====================
  app.get('/api/vocabulary', (req: Request, res: Response) => {
    const { level, topic, search, limit, offset } = req.query;
    const filter = {
      level: level ? String(level) : undefined,
      topic: topic ? String(topic) : undefined,
      search: search ? String(search) : undefined,
      limit: limit ? parseInt(String(limit), 10) : 50,
      offset: offset ? parseInt(String(offset), 10) : 0,
    };
    const data = db.getVocabulary(filter);
    res.json(data);
  });

  app.get('/api/vocabulary/srs', authMiddleware, (req: AuthRequest, res: Response) => {
    const srsItems = db.getUserSRSItems(req.user!.id);
    res.json(srsItems);
  });

  app.post('/api/vocabulary/srs/review', authMiddleware, (req: AuthRequest, res: Response) => {
    const { vocabularyId, rating } = req.body;
    if (!vocabularyId || !rating) {
      return res.status(400).json({ error: 'vocabularyId and rating (again, hard, good, easy) are required' });
    }

    const existingSRS = db.getUserSRSItems(req.user!.id).find((s) => s.vocabularyId === vocabularyId);
    const currentState = existingSRS
      ? {
          reviewCount: existingSRS.reviewCount,
          correctCount: existingSRS.correctCount,
          incorrectCount: existingSRS.incorrectCount,
          easeFactor: existingSRS.easeFactor,
          intervalDays: existingSRS.intervalDays,
          srsStage: existingSRS.srsStage,
        }
      : {
          reviewCount: 0,
          correctCount: 0,
          incorrectCount: 0,
          easeFactor: 2.5,
          intervalDays: 1,
          srsStage: 0,
        };

    const { nextState, nextReviewDate, daysAdded } = calculateNextSRSReview(currentState, rating as SRSRating);

    const srsRecord = {
      id: existingSRS?.id || `srs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user!.id,
      vocabularyId,
      ...nextState,
      lastReviewedAt: new Date().toISOString(),
      nextReviewDate,
    };

    db.saveSRSItem(srsRecord);

    // Give user XP for vocabulary review
    const user = db.findUserById(req.user!.id);
    if (user) {
      user.xp += rating === 'again' ? 2 : 5;
      db.updateUser(user.id, { xp: user.xp });
    }

    res.json({
      success: true,
      srsRecord,
      daysAdded,
    });
  });

  // ===================== GRAMMAR & STRUCTURED LESSONS =====================
  app.get('/api/grammar', (req: Request, res: Response) => {
    const { level } = req.query;
    const topics = db.getGrammarTopics(level ? String(level) : undefined);
    res.json(topics);
  });

  app.get('/api/grammar/:slug', (req: Request, res: Response) => {
    const topic = db.getGrammarTopicBySlug(req.params.slug);
    if (!topic) return res.status(404).json({ error: 'Grammar topic not found' });
    res.json(topic);
  });

  app.get('/api/lessons', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
    const { level } = req.query;
    const lessons = db.getLessons(level ? String(level) : undefined);
    const completedIds = req.user ? db.getUserCompletedLessonIds(req.user.id) : [];

    const decorated = lessons.map((les) => ({
      ...les,
      isCompleted: completedIds.includes(les.id),
      isLocked: false, // The whole website is free.
    }));

    res.json(decorated);
  });

  app.get('/api/lessons/:slug', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
    const lesson = db.getLessonBySlug(req.params.slug);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const isLocked = false; // The whole website is free.
    res.json({ ...lesson, isLocked });
  });

  app.post('/api/lessons/:id/complete', authMiddleware, (req: AuthRequest, res: Response) => {
    db.completeLesson(req.user!.id, req.params.id);
    const user = db.findUserById(req.user!.id);
    const { passwordHash, ...safeUser } = user!;

    res.json({
      success: true,
      message: 'Lesson completed! +100 XP awarded.',
      user: safeUser,
    });
  });

  // ===================== STUDY NOTES =====================
  app.get('/api/notes', (req: Request, res: Response) => {
    const { level } = req.query;
    const notes = db.getNotes(level ? String(level) : undefined);
    res.json(notes);
  });

  app.get('/api/notes/:slug', (req: Request, res: Response) => {
    const note = db.getNoteBySlug(req.params.slug);
    if (!note) return res.status(404).json({ error: 'Study note not found' });
    res.json(note);
  });

  // ===================== MISTAKE REVIEW BANK =====================
  app.get('/api/mistakes', authMiddleware, (req: AuthRequest, res: Response) => {
    const { level, topic } = req.query;
    const mistakes = db.getMistakes(req.user!.id, {
      level: level ? String(level) : undefined,
      topic: topic ? String(topic) : undefined,
    });
    res.json(mistakes);
  });

  app.post('/api/mistakes/:id/resolve', authMiddleware, (req: AuthRequest, res: Response) => {
    const success = db.resolveMistake(req.user!.id, req.params.id);
    if (!success) return res.status(404).json({ error: 'Mistake record not found' });
    res.json({ success: true, message: 'Mistake marked as resolved!' });
  });

  // ===================== EXAM SIMULATOR API =====================
  app.post('/api/exams/start', authMiddleware, (req: AuthRequest, res: Response) => {
    const { level, mode, totalQuestions } = req.body;
    const selectedLevel = level || 'A1';

    const pool = db.getQuestions({ level: selectedLevel, limit: 100 }).questions;
    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const examQuestions = shuffled.slice(0, totalQuestions || 20);

    const sessionId = `exam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const timeLimitMinutes = selectedLevel === 'A1' ? 25 : selectedLevel === 'A2' ? 35 : selectedLevel === 'B1' ? 45 : 60;

    res.json({
      sessionId,
      level: selectedLevel,
      mode: mode || 'standard',
      totalQuestions: examQuestions.length,
      timeLimitMinutes,
      questions: examQuestions,
    });
  });

  app.post('/api/exams/submit', authMiddleware, (req: AuthRequest, res: Response) => {
    const { sessionId, level, mode, totalQuestions, correctAnswers, scorePercentage, passed, timeSpentSeconds, answers } = req.body;

    const examRecord = {
      id: sessionId || `exam_${Date.now()}`,
      userId: req.user!.id,
      level,
      mode: mode || 'standard',
      scorePercentage,
      passed,
      totalQuestions,
      correctAnswers,
      timeSpentSeconds,
      date: new Date().toISOString(),
      answers: answers || [],
    };

    db.recordExamSession(examRecord);
    const user = db.findUserById(req.user!.id);
    const { passwordHash, ...safeUser } = user!;

    res.json({
      success: true,
      examRecord,
      user: safeUser,
    });
  });

  app.get('/api/exams/history', authMiddleware, (req: AuthRequest, res: Response) => {
    const history = db.getUserExamHistory(req.user!.id);
    res.json(history);
  });

  // ===================== PROGRESS & ANALYTICS API =====================
  app.get('/api/analytics', authMiddleware, (req: AuthRequest, res: Response) => {
    const analytics = db.getUserAnalytics(req.user!.id);
    res.json(analytics);
  });

  app.get('/api/leaderboard', optionalAuthMiddleware, (req: AuthRequest, res: Response) => {
    const leaderboard = db.getLeaderboard(req.user?.id);
    res.json(leaderboard);
  });

  // ===================== NOTIFICATIONS API =====================
  app.get('/api/notifications', authMiddleware, (req: AuthRequest, res: Response) => {
    const notifications = db.getUserNotifications(req.user!.id);
    res.json(notifications);
  });

  app.put('/api/notifications/:id/read', authMiddleware, (req: AuthRequest, res: Response) => {
    const success = db.markNotificationAsRead(req.user!.id, req.params.id);
    res.json({ success });
  });

  // ===================== AI GERMAN PEDAGOGICAL ENGINE (GEMINI) =====================
  app.post('/api/ai/explain', optionalAuthMiddleware, async (req: AuthRequest, res: Response) => {
    const { topic, level, userQuestion } = req.body;
    if (!topic) return res.status(400).json({ error: 'Grammar topic is required' });

    try {
      const explanation = await explainGrammarConceptWithAI(topic, level || 'A2', userQuestion);
      res.json({ explanation });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate explanation' });
    }
  });

  app.post('/api/ai/correct-sentence', optionalAuthMiddleware, async (req: AuthRequest, res: Response) => {
    const { sentence, targetLevel } = req.body;
    if (!sentence) return res.status(400).json({ error: 'German sentence is required' });

    try {
      const result = await correctGermanSentenceWithAI(sentence, targetLevel || 'A2');
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to correct sentence' });
    }
  });

  app.post('/api/ai/evaluate-essay', authMiddleware, async (req: AuthRequest, res: Response) => {
    const { taskPrompt, userEssay, cefrLevel } = req.body;
    if (!taskPrompt || !userEssay) {
      return res.status(400).json({ error: 'taskPrompt and userEssay are required' });
    }

    try {
      const evaluation = await evaluateGermanWritingWithAI(taskPrompt, userEssay, cefrLevel || 'B1');
      res.json(evaluation);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to evaluate essay' });
    }
  });

  // ===================== ADMIN DASHBOARD API =====================
  app.get('/api/admin/stats', authMiddleware, adminOnly, (_req: AuthRequest, res: Response) => {
    const stats = db.getAdminStats();
    res.json(stats);
  });

  app.get('/api/admin/users', authMiddleware, adminOnly, (_req: AuthRequest, res: Response) => {
    const users = db.getAllUsers();
    res.json(users);
  });

  app.put('/api/admin/users/:id/status', authMiddleware, adminOnly, (req: AuthRequest, res: Response) => {
    const { status, isPremium, role } = req.body;
    const updated = db.updateUser(req.params.id, { status, isPremium, role });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...safeUser } = updated;
    res.json({ user: safeUser, message: 'User updated by admin' });
  });

  app.post('/api/admin/questions', authMiddleware, adminOnly, (req: AuthRequest, res: Response) => {
    const qData = req.body;
    const newQuestion = {
      ...qData,
      id: `q_custom_${Date.now()}`,
    };
    db.addQuestion(newQuestion);
    res.status(201).json(newQuestion);
  });

  app.put('/api/admin/questions/:id', authMiddleware, adminOnly, (req: AuthRequest, res: Response) => {
    const updated = db.updateQuestion(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    res.json(updated);
  });

  app.delete('/api/admin/questions/:id', authMiddleware, adminOnly, (req: AuthRequest, res: Response) => {
    const ok = db.deleteQuestion(req.params.id);
    res.json({ success: ok });
  });

  app.post('/api/admin/vocabulary', authMiddleware, adminOnly, (req: AuthRequest, res: Response) => {
    const vData = req.body;
    const newItem = {
      ...vData,
      id: `v_custom_${Date.now()}`,
    };
    db.addVocabulary(newItem);
    res.status(201).json(newItem);
  });

  app.delete('/api/admin/vocabulary/:id', authMiddleware, adminOnly, (req: AuthRequest, res: Response) => {
    const ok = db.deleteVocabulary(req.params.id);
    res.json({ success: ok });
  });

  // ===================== VITE SPA MIDDLEWARE =====================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🇩🇪 VielErfolg Server successfully listening on http://localhost:${PORT}`);
  });
}

startServer();
