import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from
  'google-auth-library';
import { db } from './db';
import { User } from '../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'deutschmeister_secure_jwt_secret_dev_key_2026';

export interface AuthRequest extends Request {
  user?: User;
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      level: user.level,
      isPremium: user.isPremium,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function hashPassword(plainText: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainText, salt);
}

export function comparePassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found or deactivated' });
    }
    const { passwordHash, ...safeUser } = user as any;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = db.findUserById(decoded.id);
      if (user) {
        const { passwordHash, ...safeUser } = user as any;
        req.user = safeUser;
      }
    } catch {
      // ignore invalid optional token
    }
  }
  next();
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}

export function premiumOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || (!req.user.isPremium && req.user.role !== 'admin')) {
    return res.status(403).json({
      error: 'Premium subscription required for B1/B2 content, full exams, and advanced AI features.',
      requiresPremium: true,
    });
  }
  next();
}
export async function verifyGoogleIdToken(idToken: string) {
  const clientId = process.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error('Google client ID is not configured');
  }

  const client = new OAuth2Client(clientId);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw new Error('Invalid Google account information');
  }

  return payload;
}
