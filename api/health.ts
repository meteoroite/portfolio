import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://mahmoud-wehaiba-portfolio.vercel.app', 'http://localhost:5173', 'http://localhost:4173'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(200).json({
    status: 'online',
    system: 'JARVIS Core API Server',
    timestamp: new Date().toISOString(),
    owner: 'Mahmoud Wehaiba',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    openrouterConfigured: Boolean(process.env.OPENROUTER_API_KEY),
    projectCount: 8,
    postCount: 3
  });
}
