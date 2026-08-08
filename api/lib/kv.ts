/**
 * Persistent KV store backed by an Upstash / Vercel-KV REST endpoint.
 * No SDK dependency: sends the raw Redis command as a JSON array via
 * POST + Authorization header (the documented body-style REST API), which
 * avoids URL-encoding issues for large JSON values like full blog posts.
 *
 * Falls back to an in-memory Map when env keys are missing so the app still
 * works locally / before env config (ephemeral).
 */
const REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_API_TOKEN || '';

export const kvConfigured: boolean = Boolean(REST_URL && TOKEN);

const mem = new Map<string, string>();

interface UpstashResponse { result: string | null | number; error?: string | null }

export async function command(cmd: string, args: unknown[]): Promise<UpstashResponse | null> {
  if (!kvConfigured) return null;
  try {
    const body = JSON.stringify([cmd, ...args]);
    const res = await fetch(REST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body,
    });
    if (!res.ok) return null;
    return (await res.json()) as UpstashResponse;
  } catch {
    return null;
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (kvConfigured) {
    const r = await command('get', [key]);
    if (!r || r.result === null || r.result === undefined) return null;
    const value = String(r.result);
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  const rawMem = mem.get(key);
  return rawMem ? (JSON.parse(rawMem) as T) : null;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (kvConfigured) {
    await command('set', [key, JSON.stringify(value)]);
  } else {
    mem.set(key, JSON.stringify(value));
  }
}

export async function kvDel(key: string): Promise<void> {
  if (kvConfigured) {
    await command('del', [key]);
  } else {
    mem.delete(key);
  }
}

export async function kvExists(key: string): Promise<boolean> {
  return (await kvGet(key)) !== null;
}