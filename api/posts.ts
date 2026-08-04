import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PERSONAL_INFO, INITIAL_POSTS_DATA } from '../src/data/profileData';
import type { BlogPost, Comment } from '../src/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || 'admin123';

  // GET /api/posts
  if (req.method === 'GET') {
    const isAdmin = req.headers['x-admin-passkey'] === ADMIN_PASSKEY;
    const posts = isAdmin ? INITIAL_POSTS_DATA : INITIAL_POSTS_DATA.filter(p => p.status === 'published');
    return res.status(200).json(posts);
  }

  // POST /api/posts/:id/like (no auth required)
  const likeMatch = req.url?.match(/\/api\/posts\/([^/]+)\/like/);
  const commentMatch = req.url?.match(/\/api\/posts\/([^/]+)\/comments/);

  if (req.method === 'POST' && likeMatch) {
    const postId = likeMatch[1];
    const post = INITIAL_POSTS_DATA.find(p => p.id === postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    post.likes += 1;
    return res.status(200).json({ success: true, likes: post.likes });
  }

  if (req.method === 'POST' && commentMatch) {
    const postId = commentMatch[1];
    const { author, text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }
    const post = INITIAL_POSTS_DATA.find(p => p.id === postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      author: author?.trim() || 'Anonymous Tech Visitor',
      text: text.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      likes: 0
    };
    post.comments.push(newComment);
    return res.status(200).json({ success: true, comment: newComment, comments: post.comments });
  }

  // Admin mutations (ephemeral on serverless)
  const passkey = req.headers['x-admin-passkey'] || req.body?.passkey;
  if (passkey !== ADMIN_PASSKEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const newPost: BlogPost = req.body.post;
    if (!newPost?.title || !newPost?.content) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const created: BlogPost = {
      id: newPost.id || `post_${Date.now()}`,
      title: newPost.title,
      summary: newPost.summary || '',
      content: newPost.content,
      tags: newPost.tags || [],
      date: newPost.date || new Date().toISOString().split('T')[0],
      readTime: newPost.readTime || `${Math.max(1, Math.ceil(newPost.content.length / 500))} min read`,
      likes: newPost.likes || 0,
      comments: newPost.comments || [],
      status: newPost.status || 'published',
      author: newPost.author || PERSONAL_INFO.name
    };
    return res.status(200).json({ success: true, post: created });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
