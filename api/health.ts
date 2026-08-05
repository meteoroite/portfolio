import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'online',
    system: 'JARVIS Core API Server',
    timestamp: new Date().toISOString(),
    owner: 'Mahmoud Wehaiba',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    projectCount: 8,
    postCount: 3
  });
}
