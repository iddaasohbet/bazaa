// Client-side safe fetch helper:
// - Timeout via AbortController
// - Ensures we only JSON.parse when the body is valid JSON
// - In-flight request dedupe to prevent request storms
// - Optional tiny cache (memory) for the lifetime of the page

export type SafeFetchJsonOptions = {
  timeoutMs?: number;
  retries?: number; // max retries (0 = no retry)
  retryDelayMs?: number;
  cacheKey?: string; // if provided, caches successful response in memory
  cacheTtlMs?: number; // default 0 (no TTL). If set, expires cached value
  headers?: HeadersInit;
};

type CacheEntry = { value: unknown; expiresAt: number | null };

const inFlight = new Map<string, Promise<unknown>>();
const cache = new Map<string, CacheEntry>();

function now() {
  return Date.now();
}

function getCache(key: string): unknown | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt !== null && entry.expiresAt <= now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

function setCache(key: string, value: unknown, ttlMs?: number) {
  const expiresAt = ttlMs && ttlMs > 0 ? now() + ttlMs : null;
  cache.set(key, { value, expiresAt });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isLikelyJson(contentType: string | null) {
  if (!contentType) return false;
  return contentType.includes("application/json") || contentType.includes("+json");
}

async function fetchJsonOnce<T>(url: string, options: SafeFetchJsonOptions): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 10_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: options.headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const ct = res.headers.get("content-type");
    const text = await res.text();

    if (!isLikelyJson(ct)) {
      throw new Error("Non-JSON response");
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error("Invalid JSON response");
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function safeFetchJson<T>(url: string, options: SafeFetchJsonOptions = {}): Promise<T> {
  const cacheKey = options.cacheKey;
  if (cacheKey) {
    const cached = getCache(cacheKey);
    if (cached !== undefined) return cached as T;
  }

  const sig = `${url}::${JSON.stringify(options.headers ?? {})}::${cacheKey ?? ""}`;
  const existing = inFlight.get(sig);
  if (existing) return (await existing) as T;

  const promise = (async () => {
    const retries = Math.max(0, options.retries ?? 0);
    const retryDelayMs = options.retryDelayMs ?? 1000;
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const data = await fetchJsonOnce<T>(url, options);
        if (cacheKey) setCache(cacheKey, data, options.cacheTtlMs);
        return data;
      } catch (err) {
        if (attempt >= retries) throw err;
        attempt += 1;
        await sleep(retryDelayMs);
      }
    }
  })();

  inFlight.set(sig, promise);
  try {
    return (await promise) as T;
  } finally {
    inFlight.delete(sig);
  }
}
