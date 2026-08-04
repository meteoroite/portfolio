import type { VercelRequest, VercelResponse } from '@vercel/node';

// ============================================================
// Shared hardening utilities for Vercel serverless functions.
// Self-contained — no ../src imports (those fail at runtime).
// ============================================================

// Fail-closed admin passkey: never fall back to a guessable default.
// If the env var is not set, all admin operations are rejected.
export function getAdminPasskey(): string | undefined {
  return process.env.ADMIN_PASSKEY || undefined;
}

export function isAdminRequest(req: VercelRequest): boolean {
  const passkey = getAdminPasskey();
  if (!passkey) return false; // fail closed
  const supplied = req.headers['x-admin-passkey'] || (req.body as Record<string, unknown>)?.passkey;
  return typeof supplied === 'string' && supplied.length > 0 && supplied === passkey;
}

// Fresh up front: respond 401 when admin is not configured.
export function adminDisabled() {
  return { code: 'ADMIN_DISABLED', error: 'Admin access is not configured on this deployment.' };
}

// Simple in-memory rate limiter scoped to a single function instance.
// Provides practical throttling against scripted abuse; not distributed across instances.
export function createRateLimiter(options: { windowMs?: number; max?: number }) {
  const windowMs = options.windowMs ?? 60000;
  const max = options.max ?? 20;
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: VercelRequest): boolean => {
    const ip =
      req.headers['forwarded']?.toString().split(',')[0]?.trim() ||
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || entry.resetAt <= now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= max;
  };
}

// Strip HTML tags + control characters; guard length. Use on any user text
// before storing/echoing to avoid XSS-ish payloads and render abuse.
export function sanitizeText(value: unknown, maxLen = 1000): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

// Convenience JSON helpers
export function json(res: VercelResponse, status: number, payload: unknown) {
  return res.status(status).json(payload);
}