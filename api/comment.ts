import type { VercelRequest, VercelResponse } from '@vercel/node';

const POSTS: Record<string, Array<{ id: string; author: string; text: string; createdAt: string; likes: number }>> = {
  "building-jarvis-local-llm": [
    { id: "c1", author: "Tarek Mansour", text: "Great breakdown! How did you handle context window degradation?", createdAt: "2026-07-16 14:20", likes: 3 },
    { id: "c2", author: "Elena Rostova", text: "The Qdrant + Ollama combination is brilliant for local RAG.", createdAt: "2026-07-18 09:12", likes: 5 }
  ],
  "agtech-computer-vision-future": [
    { id: "c3", author: "Dr. Ahmed Hassan", text: "Spot on analysis. Edge inference in rural agricultural settings is the future.", createdAt: "2026-06-29 11:05", likes: 7 }
  ],
  "clean-architecture-node-express": []
};

const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(req: VercelRequest): boolean {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.resetAt <= now) { hits.set(ip, { count: 1, resetAt: now + 60000 }); return true; }
  e.count += 1;
  return e.count <= 10;
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
  if (!rateLimited(req)) return res.status(429).json({ success: false, error: 'Too many requests.' });

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
  const postId = typeof body.postId === 'string' ? body.postId : '';
  const text = sanitize(body.text, 1000);

  if (!postId) return res.status(400).json({ success: false, error: 'postId is required' });
  if (!text) return res.status(400).json({ success: false, error: 'Comment text is required' });

  const comments = POSTS[postId];
  if (!comments) return res.status(404).json({ success: false, error: 'Post not found' });

  const c = {
    id: `comm_${Date.now()}`,
    author: sanitize(body.author, 60) || 'Anonymous Tech Visitor',
    text,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    likes: 0
  };
  comments.push(c);
  return res.status(200).json({ success: true, comment: c, comments });
}
