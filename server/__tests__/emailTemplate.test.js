import { describe, it, expect } from 'vitest';
import { generatePromoEmail } from '../emailTemplate.js';

describe('Email Template Generation', () => {
  it('generates HTML and text containing promo code Niazi804 and 10% discount', () => {
    const email = generatePromoEmail({
      promoCode: 'Niazi804',
      discountPercent: 10,
      recipientEmail: 'driver@example.com',
      siteUrl: 'https://rentcar.com',
    });

    expect(email.subject).toContain('Niazi804');
    expect(email.subject).toContain('10%');

    // Text version checks
    expect(email.text).toContain('Niazi804');
    expect(email.text).toContain('10% OFF');
    expect(email.text).toContain('Rental Summary');
    expect(email.text).toContain('support@carrent.com');

    // HTML version checks
    expect(email.html).toContain('CAR<span style="color: #dc2626;">RENT</span>');
    expect(email.html).toContain('Niazi804');
    expect(email.html).toContain('10% OFF');
    expect(email.html).toContain('driver@example.com');
    expect(email.html).toContain('How to Redeem Your Discount');
  });
});

