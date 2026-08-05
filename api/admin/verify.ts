import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-passkey');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const PASSKEY = process.env.ADMIN_PASSKEY;
  if (!PASSKEY) return res.status(503).json({ success: false, error: 'Admin access is not configured.' });

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
  const { passkey } = body;

  if (passkey === PASSKEY) return res.status(200).json({ success: true, message: 'Admin access granted' });
  return res.status(401).json({ success: false, error: 'Invalid Admin Passkey' });
}
