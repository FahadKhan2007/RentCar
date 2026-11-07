import { describe, it, expect } from 'vitest';
import { calculateBookingPrice } from '../bookingCalculations';

describe('Discount Calculations', () => {
  it('correctly calculates 10% promo discount deduction', () => {
    // 3 days at $40/day = $120 subtotal, 10% discount = $12, total = $108
    const result = calculateBookingPrice({
      dailyRate: 40,
      billableDays: 3,
      discountPercent: 10,
    });

    expect(result.subtotal).toBe(120);
    expect(result.discountPercent).toBe(10);
    expect(result.discountAmount).toBe(12);
    expect(result.totalPrice).toBe(108);
  });

  it('correctly rounds discount amounts on fractional subtotals', () => {
    // 1 day at $95/day = $95 subtotal, 10% discount = $9.5 -> rounds to $10, total = $85
    const result = calculateBookingPrice({
      dailyRate: 95,
      billableDays: 1,
      discountPercent: 10,
    });

    expect(result.subtotal).toBe(95);
    expect(result.discountAmount).toBe(10);
    expect(result.totalPrice).toBe(85);
  });

  it('ensures total price cannot fall below 0 even with large discount', () => {
    const result = calculateBookingPrice({
      dailyRate: 50,
      billableDays: 1,
      discountPercent: 100,
    });

    expect(result.subtotal).toBe(50);
    expect(result.discountAmount).toBe(50);
    expect(result.totalPrice).toBe(0);
  });

  it('handles negative or invalid discount percentages safely', () => {
    const result = calculateBookingPrice({
      dailyRate: 50,
      billableDays: 2,
      discountPercent: -10,
    });

    expect(result.subtotal).toBe(100);
    expect(result.discountAmount).toBe(0);
    expect(result.totalPrice).toBe(100);
  });
});

