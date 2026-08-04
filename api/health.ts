import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PERSONAL_INFO, PROJECTS_DATA, INITIAL_POSTS_DATA } from './_data';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.status(200).json({
    status: 'online',
    system: 'JARVIS Core API Server',
    timestamp: new Date().toISOString(),
    owner: PERSONAL_INFO.name,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    projectCount: PROJECTS_DATA.length,
    postCount: INITIAL_POSTS_DATA.length
  });
}
