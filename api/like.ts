import type { VercelRequest, VercelResponse } from '@vercel/node';

const POSTS: Record<string, { likes: number }> = {
  "building-jarvis-local-llm": { likes: 24 },
  "agtech-computer-vision-future": { likes: 31 },
  "clean-architecture-node-express": { likes: 18 }
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!rateLimited(req)) return res.status(429).json({ success: false, error: 'Too many requests.' });

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
  const postId = typeof body.postId === 'string' ? body.postId : '';

  if (!postId) return res.status(400).json({ success: false, error: 'postId is required' });

  const post = POSTS[postId];
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  post.likes += 1;
  return res.status(200).json({ success: true, likes: post.likes });
}
