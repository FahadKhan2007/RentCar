/**
 * In-Memory Sliding Window Rate Limiter
 * Protects email API against spam and abuse.
 */

const MAX_REQUESTS = 3; // Maximum requests allowed in the window
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes window

// Map of key -> array of timestamps
const requestLog = new Map();

/**
 * Checks if a key (IP or email) is within rate limits.
 *
 * @param {string} key - Identifier (e.g. IP address or email)
 * @returns {{ allowed: boolean, retryAfterSeconds: number }}
 */
export const checkRateLimit = (key) => {
  if (!key) return { allowed: true, retryAfterSeconds: 0 };

  const now = Date.now();
  const timestamps = requestLog.get(key) || [];

  // Filter out timestamps outside the active sliding window
  const activeTimestamps = timestamps.filter((time) => now - time < WINDOW_MS);

  if (activeTimestamps.length >= MAX_REQUESTS) {
    const oldest = activeTimestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
    };
  }

  // Record this request
  activeTimestamps.push(now);
  requestLog.set(key, activeTimestamps);

  return { allowed: true, retryAfterSeconds: 0 };
};

/**
 * Helper to reset rate limits (useful for testing)
 */
export const resetRateLimits = () => {
  requestLog.clear();
};

