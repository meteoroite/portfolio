import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PERSONAL_INFO } from '../src/data/profileData';

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

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and message are required fields.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
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
}
