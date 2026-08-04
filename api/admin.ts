import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-passkey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'admin123';
  const { passkey } = req.body;

  if (passkey === ADMIN_PASSKEY) {
    return res.status(200).json({ success: true, message: 'Admin access granted' });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid Admin Passkey' });
  }
}
