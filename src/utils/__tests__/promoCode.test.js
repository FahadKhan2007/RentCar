import { describe, it, expect } from 'vitest';
import {
  validatePromoCode,
  VALID_PROMO_CODE,
  PROMO_DISCOUNT_PERCENT,
} from '../promoCode';

describe('Promo Code Validation', () => {
  it('accepts valid promo code Niazi804 case-insensitively', () => {
    // Exact case
    const exact = validatePromoCode('Niazi804');
    expect(exact.isValid).toBe(true);
    expect(exact.code).toBe(VALID_PROMO_CODE);
    expect(exact.discountPercent).toBe(PROMO_DISCOUNT_PERCENT);
    expect(exact.message).toContain('Promo code Niazi804 applied!');

    // Lowercase
    const lower = validatePromoCode('niazi804');
    expect(lower.isValid).toBe(true);
    expect(lower.code).toBe('Niazi804');
    expect(lower.discountPercent).toBe(10);

    // Uppercase
    const upper = validatePromoCode('NIAZI804');
    expect(upper.isValid).toBe(true);
    expect(upper.code).toBe('Niazi804');

    // Mixed case with leading/trailing whitespace
    const padded = validatePromoCode('  nIaZi804  ');
    expect(padded.isValid).toBe(true);
    expect(padded.code).toBe('Niazi804');
  });

  it('rejects invalid promo codes with an informative error message', () => {
    const invalidCodes = ['SAVE10', 'discount', 'Niazi', '804', 'Niazi805'];

    invalidCodes.forEach((code) => {
      const res = validatePromoCode(code);
      expect(res.isValid).toBe(false);
      expect(res.discountPercent).toBe(0);
      expect(res.error).toBe('Invalid promo code. Please enter a valid promo code.');
    });
  });

  it('rejects empty, null, or whitespace-only promo code', () => {
    expect(validatePromoCode('').isValid).toBe(false);
    expect(validatePromoCode('').error).toBe('Please enter a promo code.');

    expect(validatePromoCode('   ').isValid).toBe(false);
    expect(validatePromoCode('   ').error).toBe('Please enter a promo code.');

    expect(validatePromoCode(null).isValid).toBe(false);
    expect(validatePromoCode(undefined).isValid).toBe(false);
  });

  it('prevents users from receiving multiple discounts when already applied', () => {
    const res = validatePromoCode('Niazi804', true);
    expect(res.isValid).toBe(false);
    expect(res.error).toBe(
      'A promo code has already been applied. Only one discount is allowed per booking.'
    );
  });
});

