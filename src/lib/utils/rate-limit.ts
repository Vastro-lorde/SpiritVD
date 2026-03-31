/**
 * Simple in-memory rate limiter using a sliding window per key (IP).
 * Not shared across serverless instances, but good enough for a portfolio site.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

const CLEANUP_INTERVAL = 60_000; // 1 min

// Periodically clean expired entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store) {
      record.timestamps = record.timestamps.filter(
        (t) => now - t < 60 * 60_000
      );
      if (record.timestamps.length === 0) store.delete(key);
    }
  }, CLEANUP_INTERVAL);
}

/**
 * Check if a request should be rate limited.
 * @param key - Unique identifier (e.g. IP address)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns { limited: boolean, remaining: number, retryAfterMs: number }
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { limited: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  let record = store.get(key);

  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Remove timestamps outside the window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestInWindow = record.timestamps[0];
    const retryAfterMs = windowMs - (now - oldestInWindow);
    return {
      limited: true,
      remaining: 0,
      retryAfterMs: Math.max(retryAfterMs, 0),
    };
  }

  record.timestamps.push(now);
  return {
    limited: false,
    remaining: maxRequests - record.timestamps.length,
    retryAfterMs: 0,
  };
}
