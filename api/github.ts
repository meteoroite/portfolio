import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  listRepos,
  fetchReadme,
  postFromRepo,
  githubConfigured,
  repoHasReadme,
} from './lib/github';
import type { RepoInfo } from './lib/github';
import { loadPosts, savePosts } from './lib/posts';
import { kvConfigured } from './lib/kv';
import type { BlogPost } from '../src/types';

function isAdmin(req: VercelRequest): boolean {
  const k = process.env.ADMIN_PASSKEY;
  if (!k) return false;
  const v = req.headers['x-admin-passkey'] || (req.body as Record<string, unknown>)?.passkey;
  return typeof v === 'string' && v === k;
}

function cors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  if (origin && ['https://mahmoud-wehaiba-portfolio.vercel.app', 'http://localhost:5173', 'http://localhost:4173'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-passkey');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return true;
  return false;
}

/** Augment repo list with README presence + linked generated post (stale detection). */
async function decorate(repos: RepoInfo[], posts: BlogPost[]): Promise<RepoInfo[]> {
  const byRepo = new Map<string, BlogPost>();
  posts.forEach((p) => {
    if (p.sourceRepo) byRepo.set(p.sourceRepo.toLowerCase(), p);
  });
  return Promise.all(
    repos.map(async (repo) => {
      const existing = byRepo.get(repo.full_name.toLowerCase());
      const hasReadme = await repoHasReadme(repo.full_name);
      let stale = false;
      if (existing) {
        const postTs = new Date(existing.date + 'T00:00:00Z').getTime();
        const repoTs = new Date(repo.updated_at).getTime();
        stale = hasReadme ? repoTs > postTs + 1000 * 60 * 60 * 24 : false;
      }
      return {
        ...repo,
        has_readme: hasReadme,
        postId: existing ? existing.id : null,
        postStale: stale,
      };
    })
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return res.status(200).end();

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;

  // GET /api/github — list all repos (public + private when token present)
  if (req.method === 'GET') {
    const raw = (await listRepos())
      .filter((r) => !r.archived);
    const posts = await loadPosts();
    const decorated = await decorate(raw, posts);
    return res.status(200).json({
      success: true,
      tokenConfigured: githubConfigured,
      kv: kvConfigured,
      privateLocked: !githubConfigured,
      repos: decorated,
    });
  }

  if (!process.env.ADMIN_PASSKEY) return res.status(503).json({ success: false, error: 'Admin access is not configured.' });
  if (!isAdmin(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });

  // POST /api/github/sync — bulk generate posts from README for every repo without one.
  if (req.method === 'POST' && body.action === 'sync') {
    const raw = (await listRepos()).filter((r) => !r.archived && !r.fork);
    const posts = await loadPosts();
    const withRepo = new Set(posts.map((p) => p.sourceRepo?.toLowerCase()).filter(Boolean));
    const missing = raw.filter((r) => !withRepo.has(r.full_name.toLowerCase()));

    const created: BlogPost[] = [];
    const skipped: string[] = [];
    let failed = 0;
    for (const repo of missing) {
      try {
        const readme = await fetchReadme(repo.full_name);
        if (!readme) { skipped.push(repo.full_name); continue; }
        const post = postFromRepo(repo, readme);
        created.push(post);
      } catch {
        failed++;
      }
    }
    const next = [...created, ...posts];
    await savePosts(next);

    return res.status(200).json({
      success: true,
      scanned: raw.length,
      created: created.length,
      skippedNoReadme: skipped,
      failed,
      posts: next,
    });
  }

  // POST /api/github — generate (or regenerate) one post from a repo's README.
  if (req.method === 'POST') {
    const repo = typeof body.repo === 'string' ? body.repo : '';
    if (!repo) return res.status(400).json({ success: false, error: 'Missing repo (owner/name)' });

    const raw = (await listRepos()).find((r) => r.full_name.toLowerCase() === repo.toLowerCase());
    const readme = await fetchReadme(repo);
    const source: RepoInfo = raw || { name: repo.split('/').pop() || repo, full_name: repo, html_url: `https://github.com/${repo}`, private: false, description: null, language: null, stargazers_count: 0, forks_count: 0, updated_at: new Date().toISOString(), created_at: new Date().toISOString(), archived: false, fork: false, topics: [], has_readme: readme !== null, postId: null, postStale: false };

    const posts = await loadPosts();
    const post = postFromRepo(source, readme || '');
    const existing = posts.find((p) => p.sourceRepo && p.sourceRepo.toLowerCase() === repo.toLowerCase());
    const next = existing
      ? posts.map((p) => (p.id === existing.id ? { ...p, ...post, id: existing.id, likes: p.likes, comments: p.comments } : p))
      : [...posts, post];
    await savePosts(next);

    return res.status(200).json({
      success: true,
      created: !existing,
      updated: Boolean(existing),
      post: next.find((p) => p.id === (existing ? existing.id : post.id)),
      posts: next,
    });
  }

  if (req.method === 'DELETE') {
    const postId = typeof body.postId === 'string' ? body.postId : '';
    const posts = await loadPosts();
    const target = posts.find((p) => p.id === postId);
    const next = target && target.sourceRepo
      ? posts.filter((p) => p.id !== postId)
      : posts;
    await savePosts(next);
    return res.status(200).json({
      success: true,
      removed: Boolean(target && target.sourceRepo),
      message: target && target.sourceRepo ? 'Generated post removed' : 'Nothing removed (manual posts are not deleted here)',
      posts: next,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}