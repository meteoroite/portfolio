import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PERSONAL_INFO, INITIAL_POSTS_DATA } from './_data';
import { getAdminPasskey, isAdminRequest, adminDisabled, createRateLimiter, sanitizeText } from './_util';

const syncLimit = createRateLimiter({ windowMs: 60000, max: 10 });

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;

  // GET /api/posts
  if (req.method === 'GET') {
    const posts = isAdminRequest(req) ? INITIAL_POSTS_DATA : INITIAL_POSTS_DATA.filter(p => p.status === 'published');
    return res.status(200).json(posts);
  }

  // POST /api/posts/:id/like + POST /api/posts/:id/comments (public, rate-limited)
  const likeMatch = req.url?.match(/\/api\/posts\/([^/]+)\/like/);
  const commentMatch = req.url?.match(/\/api\/posts\/([^/]+)\/comments/);

  if (req.method === 'POST' && (likeMatch || commentMatch)) {
    if (!syncLimit(req)) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please slow down.' });
    }

    if (likeMatch) {
      const postId = likeMatch[1];
      const post = INITIAL_POSTS_DATA.find(p => p.id === postId);
      if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
      post.likes += 1;
      return res.status(200).json({ success: true, likes: post.likes });
    }

    const postId = commentMatch![1];
    const text = sanitizeText(body.text, 1000);
    if (!text) {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }
    const post = INITIAL_POSTS_DATA.find(p => p.id === postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    const newComment = {
      id: `comm_${Date.now()}`,
      author: sanitizeText(body.author, 60) || 'Anonymous Tech Visitor',
      text,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      likes: 0
    };
    post.comments.push(newComment);
    return res.status(200).json({ success: true, comment: newComment, comments: post.comments });
  }

  // Other mutations (admin) — fail closed if ADMIN_PASSKEY is not configured.
  if (!getAdminPasskey()) {
    return res.status(503).json(adminDisabled());
  }
  if (!isAdminRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const newPost = body.post && typeof body.post === 'object' ? (body.post as Record<string, unknown>) : {};
    if (!sanitizeText(newPost.title) || !sanitizeText(newPost.content)) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const created = {
      id: sanitizeText(newPost.id, 100) || `post_${Date.now()}`,
      title: sanitizeText(newPost.title, 200),
      summary: sanitizeText(newPost.summary, 500),
      content: sanitizeText(newPost.content, 10000),
      tags: (Array.isArray(newPost.tags) ? newPost.tags.map(t => sanitizeText(t, 40)).filter(Boolean) : []),
      date: sanitizeText(newPost.date, 20) || new Date().toISOString().split('T')[0],
      readTime: sanitizeText(newPost.readTime, 40) || `${Math.max(1, Math.ceil(String(newPost.content).length / 500))} min read`,
      likes: Number(newPost.likes) || 0,
      comments: Array.isArray(newPost.comments) ? newPost.comments : [],
      status: sanitizeText(newPost.status, 20) || 'published',
      author: sanitizeText(newPost.author, 100) || PERSONAL_INFO.name
    };
    return res.status(200).json({ success: true, post: created });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}