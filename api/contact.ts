import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PERSONAL_INFO } from './_data';
import { createRateLimiter, sanitizeText } from './_util';

// Throttle scripted spam: max 5 submissions / minute per IP.
const rateLimit = createRateLimiter({ windowMs: 60000, max: 5 });

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!rateLimit(req)) {
    return res.status(429).json({ success: false, error: 'Too many submissions. Please wait a moment and try again.' });
  }

  try {
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const name = sanitizeText(body.name, 120);
    const email = sanitizeText(body.email, 200);
    const subject = sanitizeText(body.subject, 200);
    const message = sanitizeText(body.message, 4000);

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format.'
      });
    }

    console.log(`[CONTACT] New message from ${name} (${email}): ${subject || 'No Subject'}`);

    return res.status(200).json({
      success: true,
      message: "Message successfully dispatched to Mahmoud Wehaiba's terminal queue.",
      details: {
        timestamp: new Date().toISOString(),
        recipient: PERSONAL_INFO.email,
        sender: `${name} <${email}>`
      }
    });
  } catch (err) {
    console.error('[CONTACT] Handler error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error while processing contact message.' });
  }
}
