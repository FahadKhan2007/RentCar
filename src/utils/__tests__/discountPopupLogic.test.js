import { describe, it, expect, beforeEach } from 'vitest';
import {
  VALID_PROMO_CODE,
  PROMO_DISCOUNT_PERCENT,
  validatePromoCode,
} from '../promoCode';
import {
  calculateBookingPrice,
  PRICING_RULES_NOTE,
} from '../bookingCalculations';
import {
  savePromoCode,
  loadSavedPromoCode,
} from '../storage';

describe('Discount Popup & Promo Code Integration Logic', () => {
  let mockStorage = {};

  beforeEach(() => {
    mockStorage = {};
  });

  const storageMock = {
    getItem: (key) => (key in mockStorage ? mockStorage[key] : null),
    setItem: (key, val) => {
      mockStorage[key] = String(val);
    },
    removeItem: (key) => {
      delete mockStorage[key];
    },
    clear: () => {
      mockStorage = {};
    },
  };

  it('exports valid promo code Niazi804 as a constant', () => {
    expect(VALID_PROMO_CODE).toBe('Niazi804');
  });

  it('exports default promo discount percentage as 10', () => {
    expect(PROMO_DISCOUNT_PERCENT).toBe(10);
  });

  it('validates promo code for instant popup display', () => {
    const res = validatePromoCode(VALID_PROMO_CODE, false);
    expect(res.isValid).toBe(true);
    expect(res.code).toBe('Niazi804');
    expect(res.discountPercent).toBe(10);
  });

  it('safely saves valid promo code to storage upon user application', () => {
    savePromoCode(VALID_PROMO_CODE, storageMock);
    const loaded = loadSavedPromoCode(storageMock);
    expect(loaded).toBe('Niazi804');
  });

  it('enforces single discount rule so users cannot apply multiple discounts', () => {
    // First attempt succeeds
    const firstAttempt = validatePromoCode('Niazi804', false);
    expect(firstAttempt.isValid).toBe(true);

    // Second attempt is blocked
    const secondAttempt = validatePromoCode('Niazi804', true);
    expect(secondAttempt.isValid).toBe(false);
    expect(secondAttempt.error).toContain('already been applied');
  });

  it('calculates exact 10% discount deduction on single-day luxury rental', () => {
    const price = calculateBookingPrice({
      dailyRate: 200,
      billableDays: 1,
      discountPercent: 10,
    });
    expect(price.subtotal).toBe(200);
    expect(price.discountAmount).toBe(20);
    expect(price.totalPrice).toBe(180);
  });

  it('calculates exact 10% discount deduction on multi-day budget rental', () => {
    const price = calculateBookingPrice({
      dailyRate: 50,
      billableDays: 5,
      discountPercent: 10,
    });
    expect(price.subtotal).toBe(250);
    expect(price.discountAmount).toBe(25);
    expect(price.totalPrice).toBe(225);
  });

  it('calculates zero discount deduction when promo code is not applied', () => {
    const price = calculateBookingPrice({
      dailyRate: 120,
      billableDays: 3,
      discountPercent: 0,
    });
    expect(price.subtotal).toBe(360);
    expect(price.discountAmount).toBe(0);
    expect(price.totalPrice).toBe(360);
  });

  it('removes promo code and clears storage cleanly', () => {
    savePromoCode('Niazi804', storageMock);
    expect(loadSavedPromoCode(storageMock)).toBe('Niazi804');

    savePromoCode(null, storageMock);
    expect(loadSavedPromoCode(storageMock)).toBeNull();
  });

  it('rejects invalid promo codes without touching valid stored promo code', () => {
    savePromoCode('Niazi804', storageMock);
    const invalidAttempt = validatePromoCode('BADCODE', false);
    expect(invalidAttempt.isValid).toBe(false);

    // Storage still contains the original valid promo code
    expect(loadSavedPromoCode(storageMock)).toBe('Niazi804');
  });

  it('gracefully recovers when storage returns corrupt or non-string promo data', () => {
    storageMock.setItem('rentcar_promo_code', 'NOT_NIAZI');
    const loaded = loadSavedPromoCode(storageMock);
    expect(loaded).toBeNull();
  });

  it('gracefully handles missing storage without throwing an exception', () => {
    expect(() => savePromoCode('Niazi804', null)).not.toThrow();
    expect(loadSavedPromoCode(null)).toBeNull();
  });

  it('includes pricing rules note with 10% discount applied', () => {
    const price = calculateBookingPrice({
      dailyRate: 100,
      billableDays: 3,
      discountPercent: 10,
    });
    expect(price.billableDays).toBe(3);
    expect(price.subtotal).toBe(300);
    expect(price.discountAmount).toBe(30);
    expect(price.totalPrice).toBe(270);
    expect(price.pricingNote).toBe(PRICING_RULES_NOTE);
  });

  it('validates promo code with leading and trailing spaces', () => {
    const res = validatePromoCode('   Niazi804   ', false);
    expect(res.isValid).toBe(true);
    expect(res.code).toBe('Niazi804');
    expect(res.discountPercent).toBe(10);
  });
});
