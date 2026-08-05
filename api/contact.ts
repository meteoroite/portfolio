import type { VercelRequest, VercelResponse } from '@vercel/node';

const EMAIL = 'mahmoudwheba22@gmail.com';

const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(req: VercelRequest): boolean {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.resetAt <= now) { hits.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  e.count += 1;
  return e.count <= 5;
}

function sanitize(v: unknown, max = 1000): string {
  if (typeof v !== 'string') return '';
  return v.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://mahmoud-wehaiba-portfolio.vercel.app', 'http://localhost:5173', 'http://localhost:4173'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!rateLimited(req)) return res.status(429).json({ success: false, error: 'Too many submissions. Please wait and try again.' });

  try {
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const name = sanitize(body.name, 120);
    const email = sanitize(body.email, 200);
    const subject = sanitize(body.subject, 200);
    const message = sanitize(body.message, 4000);

    if (!name || !email || !message) return res.status(400).json({ success: false, error: 'Name, email, and message are required fields.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email format.' });

    console.log(`[CONTACT] New message from ${name} (${email}): ${subject || 'No Subject'}`);
    return res.status(200).json({
      success: true,
      message: "Message successfully dispatched to Mahmoud Wehaiba's terminal queue.",
      details: { timestamp: new Date().toISOString(), recipient: EMAIL, sender: `${name} <${email}>` }
    });
  } catch (err) {
    console.error('[CONTACT] Handler error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error while processing contact message.' });
  }
}
