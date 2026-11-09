import { describe, it, expect, beforeEach } from 'vitest';
import { processPromoRequest } from '../promoHandler.js';
import { resetRateLimits } from '../rateLimiter.js';

describe('Promo Handler API Endpoint', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it('rejects missing or empty email with 400 status', async () => {
    const resEmpty = await processPromoRequest({ email: '', clientIp: '127.0.0.1' });
    expect(resEmpty.statusCode).toBe(400);
    expect(resEmpty.body.success).toBe(false);
    expect(resEmpty.body.error).toContain('Please enter your email address');

    const resNull = await processPromoRequest({ email: null, clientIp: '127.0.0.1' });
    expect(resNull.statusCode).toBe(400);
  });

  it('rejects invalid email formats with 400 status', async () => {
    const invalidEmails = ['plainaddress', 'missing@domain', '@nodomain.com', 'test@.com'];

    for (const email of invalidEmails) {
      const res = await processPromoRequest({ email, clientIp: '127.0.0.1' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Please provide a valid email address');
    }
  });

  it('enforces rate limiting with 429 status on repeated attempts', async () => {
    const email = 'spammer@example.com';
    const clientIp = '10.0.0.1';

    // Mock transporter that resolves
    const mockTransporter = {
      sendMail: async () => ({ messageId: '<mock-123@carrent.com>', response: '250 OK' }),
    };

    // 3 attempts succeed
    const res1 = await processPromoRequest({ email, clientIp, options: { customTransporter: mockTransporter } });
    expect(res1.statusCode).toBe(200);

    const res2 = await processPromoRequest({ email, clientIp, options: { customTransporter: mockTransporter } });
    expect(res2.statusCode).toBe(200);

    const res3 = await processPromoRequest({ email, clientIp, options: { customTransporter: mockTransporter } });
    expect(res3.statusCode).toBe(200);

    // 4th attempt is blocked by rate limiting
    const res4 = await processPromoRequest({ email, clientIp, options: { customTransporter: mockTransporter } });
    expect(res4.statusCode).toBe(429);
    expect(res4.body.success).toBe(false);
    expect(res4.body.error).toContain('Too many requests');
  });

  it('returns 500 when email delivery fails', async () => {
    const failingTransporter = {
      sendMail: async () => {
        throw new Error('Connection refused by mail server');
      },
    };

    const res = await processPromoRequest({
      email: 'valid@example.com',
      clientIp: '192.168.1.50',
      options: { customTransporter: failingTransporter },
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Connection refused by mail server');
  });

  it('returns 200 and success confirmation when email delivers successfully', async () => {
    const successfulTransporter = {
      sendMail: async (mailOptions) => {
        expect(mailOptions.to).toBe('customer@example.com');
        expect(mailOptions.subject).toContain('Niazi804');
        return { messageId: '<msg-777@carrent.com>', response: '250 Message accepted' };
      },
    };

    const res = await processPromoRequest({
      email: 'customer@example.com',
      clientIp: '192.168.1.99',
      options: { customTransporter: successfulTransporter },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Promo code successfully sent');
    expect(res.body.messageId).toBe('<msg-777@carrent.com>');
  });
});

