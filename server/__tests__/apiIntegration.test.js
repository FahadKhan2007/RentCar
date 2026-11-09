import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../index.js';

describe('Express Server HTTP API Integration', () => {
  let server;
  let baseUrl;

  beforeAll(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('responds with 200 on GET /api/health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.service).toContain('RentCar');
  });

  it('rejects invalid email with 400 on POST /api/send-promo', async () => {
    const res = await fetch(`${baseUrl}/api/send-promo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bademail' }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Please provide a valid email address');
  });

  it('rejects unconfigured SMTP gracefully with 500 when using placeholder credentials', async () => {
    // In test environment with default placeholders, it safely reports unconfigured SMTP
    const res = await fetch(`${baseUrl}/api/send-promo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testcustomer@gmail.com' }),
    });
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('SMTP');
  });
});

