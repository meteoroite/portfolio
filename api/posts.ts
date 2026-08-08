import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BlogPost } from '../src/types';
import { loadPosts, savePosts } from './lib/posts';
import { kvConfigured } from './lib/kv';

function isAdmin(req: VercelRequest): boolean {
  const k = process.env.ADMIN_PASSKEY;
  if (!k) return false;
  const v = req.headers['x-admin-passkey'] || (req.body as Record<string, unknown>)?.passkey;
  return typeof v === 'string' && v === k;
}
function sanitize(v: unknown, max = 1000): string {
  if (typeof v !== 'string') return '';
  return v.replace(/<[^>]*>/g, '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function visible(posts: BlogPost[]): BlogPost[] {
  return posts.filter(p => p.status === 'published');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://mahmoud-wehaiba-portfolio.vercel.app', 'http://localhost:5173', 'http://localhost:4173'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const posts = await loadPosts();

  // GET /api/posts
  if (req.method === 'GET') {
    return res.status(200).json(isAdmin(req) ? posts : visible(posts));
  }

  if (!process.env.ADMIN_PASSKEY) return res.status(503).json({ success: false, error: 'Admin access is not configured.' });
  if (!isAdmin(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;

  // Admin: create/update post (persistent via KV)
  if (req.method === 'POST') {
    const np = body.post && typeof body.post === 'object' ? (body.post as Record<string, unknown>) : {};
    if (!sanitize(np.title) || !sanitize(np.content)) return res.status(400).json({ success: false, error: 'Missing required fields' });
    const c: BlogPost = {
      id: sanitize(np.id, 100) || `post_${Date.now()}`,
      title: sanitize(np.title, 200),
      summary: sanitize(np.summary, 500),
      content: sanitize(np.content, 10000),
      tags: (Array.isArray(np.tags) ? np.tags.map(t => sanitize(t, 40)).filter(Boolean) : []),
      date: sanitize(np.date, 20) || new Date().toISOString().split('T')[0],
      readTime: sanitize(np.readTime, 40) || '5 min read',
      likes: Number(np.likes) || 0,
      comments: Array.isArray(np.comments) ? np.comments : [],
      status: sanitize(np.status, 20) === 'draft' ? 'draft' : 'published',
      author: sanitize(np.author, 100) || 'Mahmoud Wehaiba',
      sourceRepo: typeof np.sourceRepo === 'string' ? np.sourceRepo : undefined,
    };
    const exists = posts.some(p => p.id === c.id);
    const next = exists
      ? posts.map(p => (p.id === c.id ? { ...c, likes: p.likes, comments: p.comments } : p))
      : [...posts, c];
    await savePosts(next);
    return res.status(200).json({ success: true, post: c, posts: isAdmin(req) ? next : visible(next) });
  }

  if (req.method === 'PUT') {
    const id = sanitize(body.id, 100) || sanitize((body.post as Record<string, unknown> | undefined)?.id, 100);
    const target = posts.find(p => p.id === id);
    if (!target) return res.status(404).json({ success: false, error: 'Post not found' });
    const np = body.post && typeof body.post === 'object' ? (body.post as Record<string, unknown>) : {};
    const updated: BlogPost = {
      id: target.id,
      title: sanitize(np.title, 200) || target.title,
      summary: typeof np.summary === 'string' ? sanitize(np.summary, 500) : target.summary,
      content: sanitize(np.content, 10000) || target.content,
      tags: Array.isArray(np.tags) ? np.tags.map(t => sanitize(t, 40)).filter(Boolean) : target.tags,
      date: sanitize(np.date, 20) || target.date,
      readTime: sanitize(np.readTime, 40) || target.readTime,
      likes: Number(np.likes) >= 0 ? Number(np.likes) : target.likes,
      comments: Array.isArray(np.comments) ? np.comments : target.comments,
      status: sanitize(np.status, 20) === 'published' || sanitize(np.status, 20) === 'draft' ? (sanitize(np.status, 20) as BlogPost['status']) : target.status,
      author: sanitize(np.author, 100) || target.author,
      sourceRepo: typeof np.sourceRepo === 'string' ? (sanitize(np.sourceRepo, 200) || undefined) : target.sourceRepo,
      sourceStale: typeof np.sourceStale === 'boolean' ? np.sourceStale : target.sourceStale,
    };
    const next = posts.map(p => (p.id === id ? updated : p));
    await savePosts(next);
    return res.status(200).json({ success: true, post: updated, posts: next });
  }

  if (req.method === 'DELETE') {
    const id = sanitize(body.postId, 100);
    const next = posts.filter(p => p.id !== id);
    await savePosts(next);
    return res.status(200).json({ success: true, posts: next });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}