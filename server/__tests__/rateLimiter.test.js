import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, resetRateLimits } from '../rateLimiter.js';

describe('Backend Email Rate Limiter', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it('allows the first 3 requests within the sliding window', () => {
    const key = 'ip:192.168.1.1';

    expect(checkRateLimit(key).allowed).toBe(true);
    expect(checkRateLimit(key).allowed).toBe(true);
    expect(checkRateLimit(key).allowed).toBe(true);
  });

  it('rejects the 4th request and provides retryAfterSeconds', () => {
    const key = 'email:test@example.com';

    checkRateLimit(key);
    checkRateLimit(key);
    checkRateLimit(key);

    const fourth = checkRateLimit(key);
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
    expect(fourth.retryAfterSeconds).toBeLessThanOrEqual(600);
  });

  it('rate limits keys independently', () => {
    const userA = 'email:userA@example.com';
    const userB = 'email:userB@example.com';

    checkRateLimit(userA);
    checkRateLimit(userA);
    checkRateLimit(userA);

    expect(checkRateLimit(userA).allowed).toBe(false);
    expect(checkRateLimit(userB).allowed).toBe(true);
  });
});

