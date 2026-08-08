import type { BlogPost } from '../../src/types';
import { kvGet, kvSet } from './kv';

/** GitHub REST client fetching through the server with optional GITHUB_TOKEN. */
const API = 'https://api.github.com';
const token = process.env.GITHUB_TOKEN || '';

export const githubConfigured = Boolean(token);
export const githubOwner = process.env.GITHUB_OWNER || 'meteoroite';

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'Content-Type': 'application/json',
  'User-Agent': 'mahmoud-portfolio',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (token) headers.Authorization = `Bearer ${token}`;

async function gh<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface RepoInfo {
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  archived: boolean;
  fork: boolean;
  topics: string[];
  has_readme: boolean;
  postId: string | null;
  postStale: boolean;
}

/**
 * Fetch repositories, public + private when a token is configured.
 * Always page until exhaustion (up to last page guard).
 */
export async function listRepos(): Promise<RepoInfo[]> {
  const repos: Array<{
    name: string; full_name: string; html_url: string; private: boolean;
    description: string | null; language: string | null;
    stargazers_count: number; forks_count: number; updated_at: string; created_at: string;
    archived: boolean; fork: boolean; topics: string[];
    has_readme: boolean; postId: string | null; postStale: boolean;
  }> = [];

// Without a token we can only fetch public repos; with a token we use the
// authenticated /user/repos endpoint which returns everything.
  const endpoint = token
    ? '/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator&type=all'
    : `/users/${githubOwner}/repos?per_page=100&sort=updated&type=all`;

  const pages = 2; // generous cap (200 repos), enough for most profiles
  for (let page = 1; page <= pages; page++) {
    const batch = await gh<Array<unknown>>(`${endpoint}&page=${page}`);
    if (!batch || !Array.isArray(batch) || batch.length === 0) break;
    for (const r of batch) {
      const item = r as Record<string, unknown>;
      repos.push({
        name: String(item.name ?? ''),
        full_name: String(item.full_name ?? ''),
        html_url: String(item.html_url ?? ''),
        private: Boolean(item.private),
        description: (item.description as string | null) ?? null,
        language: (item.language as string | null) ?? null,
        stargazers_count: Number(item.stargazers_count ?? 0),
        forks_count: Number(item.forks_count ?? 0),
        updated_at: String(item.updated_at ?? ''),
        created_at: String(item.created_at ?? ''),
        archived: Boolean(item.archived),
        fork: Boolean(item.fork),
        topics: Array.isArray(item.topics) ? (item.topics as string[]) : [],
        has_readme: false,
        postId: null,
        postStale: false,
      });
    }
    if ((batch as Array<{ length?: number }>).length < 100) break;
  }
  return repos;
}

/** Fetch the raw README markdown for a repo. Returns null when absent/inaccessible. */
export async function fetchReadme(repo: string): Promise<string | null> {
  const res = await fetch(`${API}/repos/${repo}/readme`, {
    headers: { ...headers, Accept: 'application/vnd.github.raw' },
  });
  if (!res.ok) return null;
  try {
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Cache README-presence per repo in KV (24h) to avoid hammering the GitHub API
 * on every page load for the repo index.
 */
const README_PRESENCE_KEY = 'github:readmePresence';
interface ReadmePresence { [fullName: string]: boolean }
let readmePresenceCache: ReadmePresence | null = null;

export async function repoHasReadme(repo: string): Promise<boolean> {
  if (!readmePresenceCache) readmePresenceCache = (await kvGet<ReadmePresence>(README_PRESENCE_KEY)) || {};
  const cached = readmePresenceCache[repo];
  if (cached !== undefined) return cached;
  const has = (await fetchReadme(repo)) !== null;
  readmePresenceCache[repo] = has;
  await kvSet(README_PRESENCE_KEY, readmePresenceCache);
  return has;
}

export function slugifyRepo(repo: string): string {
  const slug = repo
    .replace(/^[a-z0-9-]+\//i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
  return slug
    ? `repo-${slug}`
    : `repo-${Date.now()}`;
}

export function humanizeRepoName(repo: string): string {
  return repo
    .split('/')
    .pop()!
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function estimateSummary(readme: string): string {
  const cleaned = readme
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!DOCTYPE[\s\S]*?>/g, ' ')
    .replace(/<[^>]+>/g, ' ') /* strip any remaining HTML tags */
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, 280) || 'No README summary available for this repository yet.';
}

/** Extract topic-like tags from topics + language + keywords detected in the README. */
const TECH_KEYWORDS: Record<string, string[]> = {
  python: ['Python'], javascript: ['JavaScript'], typescript: ['TypeScript'], react: ['React'],
  'node.js': ['Node.js'], nodejs: ['Node.js'], 'node': ['Node.js'], express: ['Express'], nextjs: ['Next.js'],
  docker: ['Docker'], flask: ['Flask'], fastapi: ['FastAPI'], tensorflow: ['TensorFlow'],
  pytorch: ['PyTorch'], opencv: ['OpenCV'], 'c++': ['C++'], go: ['Go'], rust: ['Rust'],
  java: ['Java'], 'c#': ['C#'], dart: ['Dart'], kotlin: ['Kotlin'],
  vue: ['Vue'], angular: ['Angular'], tailwind: ['Tailwind'], sql: ['SQL'], postgres: ['PostgreSQL'],
  mongodb: ['MongoDB'], redis: ['Redis'], llm: ['AI', 'LLM'], ai: ['AI'], api: ['API'],
  backend: ['Backend'], frontend: ['Frontend'], cli: ['CLI'], web: ['Web'],
};

export function deriveTags(repo: RepoInfo, readme: string): string[] {
  const tags = new Set<string>();
  (repo.topics || []).slice(0, 8).forEach((t) => tags.add(t.slice(0, 24)));
  if (repo.language && !repo.fork) tags.add(repo.language);
  const lower = readme.toLowerCase();
  for (const key of Object.keys(TECH_KEYWORDS)) {
    if (lower.includes(`${key} `) || lower.includes(`\n${key}`) || lower.includes(`${key}.`) || lower.includes(`${key}-`)) {
      const mapped = TECH_KEYWORDS[key];
      (mapped || []).forEach((t) => tags.add(t));
    }
  }
  if (lower.includes('machine learning') || lower.includes('machine-learning')) tags.add('Machine Learning');
  if (lower.includes('artificial intelligence') || lower.includes('artificial-intelligence')) tags.add('AI');
  if (lower.includes('computer vision') || lower.includes('computer-vision')) tags.add('Computer Vision');
  if (lower.includes('agric') || lower.includes('agritech') || lower.includes('smart farm') || lower.includes('precision farm')) tags.add('AgTech');
  const filtered = Array.from(tags).filter((t) => t && t.length <= 24);
  return filtered.slice(0, 6);
}

/** Build a BlogPost from a repo and its README. Keeps content concise (max ~3000 chars). */
export function postFromRepo(repo: RepoInfo, readme: string): BlogPost {
  const cleaned = readme
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .filter((line) => line.trim().length > 0 || line.startsWith('#'))
    .join('\n');
  const trimmed =
    cleaned.length > 3000
      ? `${cleaned.slice(0, 3000)}\n\n_Truncated. Full README available on GitHub._`
      : cleaned;

  const id = slugifyRepo(repo.full_name);
  const date = (repo.created_at || new Date().toISOString()).slice(0, 10);
  return {
    id,
    title: humanizeRepoName(repo.name),
    summary: estimateSummary(readme),
    content: trimmed || `# ${humanizeRepoName(repo.name)}\n\n_This repository's README could not be fetched fully, but please explore it on GitHub._`,
    tags: deriveTags(repo, readme),
    date,
    readTime: estimateReadTime(readme),
    likes: 0,
    comments: [],
    status: 'published',
    author: 'Mahmoud Wehaiba',
    sourceRepo: repo.full_name,
    sourceStale: false,
  };
}