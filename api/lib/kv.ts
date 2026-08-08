import { Redis } from '@upstash/redis';

/**
 * Persistent KV store (Upstash / Vercel KV).
 * Falls back to an in-memory Map when env keys are missing so the app
 * still works locally / before env config. The refresh of the Redis client
 * is cheap (lazy), so we build it once per cold start.
 */
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_API_TOKEN || '';

export const kvConfigured: boolean = Boolean(URL && TOKEN);

let redis: Redis | null = null;
function client(): Redis | null {
  if (!kvConfigured) return null;
  redis = redis ?? new Redis({
    url: URL,
    token: TOKEN,
    automaticDeserialization: false,
  });
  return redis;
}

const mem = new Map<string, string>();

export async function kvGet<T>(key: string): Promise<T | null> {
  const c = client();
  if (c) {
    const v = await c.get(key);
    if (v === null || v === undefined) return null;
    return typeof v === 'string' ? (JSON.parse(v) as T) : (v as T);
  }
  const raw = mem.get(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  const c = client();
  if (c) {
    await c.set(key, JSON.stringify(value));
  } else {
    mem.set(key, JSON.stringify(value));
  }
}

export async function kvDel(key: string): Promise<void> {
  const c = client();
  if (c) {
    await c.del(key);
  } else {
    mem.delete(key);
  }
}

export async function kvExists(key: string): Promise<boolean> {
  const v = await kvGet(key);
  return v !== null && v !== undefined;
}