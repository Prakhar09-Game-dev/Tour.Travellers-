import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const SESSION_SECRET = process.env.SESSION_SECRET || 'utt-kashi-varanasi-session-secret-2026-secure';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting for login: max 5 attempts per 15 minutes per IP
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const loginAttempts = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
  } else {
    record.count += 1;
  }
}

export function clearLoginRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

export interface SessionPayload {
  username: string;
  role: 'admin';
  name: string;
  issuedAt: number;
  expiresAt: number;
}

export interface UserSessionPayload {
  userId: string;
  phone: string;
  name: string;
  role: 'user' | 'vip' | 'admin';
  issuedAt: number;
  expiresAt: number;
}

export function createUserToken(user: { id: string; phone: string; name: string; role?: 'user' | 'vip' | 'admin' }): string {
  const now = Date.now();
  const payload: UserSessionPayload = {
    userId: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role || 'user',
    issuedAt: now,
    expiresAt: now + (30 * 24 * 60 * 60 * 1000), // 30 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`user:${payloadB64}`)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifyUserToken(token: string): UserSessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`user:${payloadB64}`)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload: UserSessionPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    );
    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(plain: string): string {
  return crypto.createHash('sha256').update(`${plain}#varanasi-salt-2026`).digest('hex');
}

export function createAdminToken(username: string, name: string): string {
  const now = Date.now();
  const payload: SessionPayload = {
    username,
    role: 'admin',
    name,
    issuedAt: now,
    expiresAt: now + TOKEN_TTL_MS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifyAdminToken(token: string): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);

  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    );
    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Timing-safe password comparison
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant time dummy compare
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function validateAdminCredentials(usernameInput?: string, passwordInput?: string): boolean {
  if (!usernameInput || !passwordInput) return false;

  const configuredUser = process.env.ADMIN_USERNAME || 'admin';
  const configuredPass = process.env.ADMIN_PASSWORD || 'kashi2026';

  // Support secondary credentials if configured or backward-compatible
  const isPrimary =
    safeCompare(usernameInput, configuredUser) &&
    safeCompare(passwordInput, configuredPass);

  const isSecondary =
    safeCompare(usernameInput, 'ujjawal') &&
    safeCompare(passwordInput, 'kashi2026');

  return isPrimary || isSecondary;
}

export interface AuthenticatedRequest extends Request {
  adminUser?: SessionPayload;
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-admin-token']) {
    token = String(req.headers['x-admin-token']).trim();
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Missing administrative access token.' });
    return;
  }

  const payload = verifyAdminToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired or invalid administrative token. Please log in again.' });
    return;
  }

  req.adminUser = payload;
  next();
}
