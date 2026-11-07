import { describe, it, expect } from 'vitest';
import { calculateBookingPrice } from '../bookingCalculations';

describe('Rental Price Calculations', () => {
  it('calculates accurate subtotal and total without discount', () => {
    const result = calculateBookingPrice({
      dailyRate: 40,
      billableDays: 3,
      discountPercent: 0,
    });

    expect(result.dailyRate).toBe(40);
    expect(result.billableDays).toBe(3);
    expect(result.subtotal).toBe(120);
    expect(result.discountPercent).toBe(0);
    expect(result.discountAmount).toBe(0);
    expect(result.totalPrice).toBe(120);
    expect(result.pricingNote).toBe('Partial rental days are charged as full days.');
  });

  it('separately displays daily rate, subtotal, discount, and total', () => {
    const result = calculateBookingPrice({
      dailyRate: 100,
      billableDays: 5,
      discountPercent: 0,
    });

    expect(result).toHaveProperty('dailyRate', 100);
    expect(result).toHaveProperty('billableDays', 5);
    expect(result).toHaveProperty('subtotal', 500);
    expect(result).toHaveProperty('discountAmount', 0);
    expect(result).toHaveProperty('totalPrice', 500);
  });

  it('calculates correct price across different fleet car rates', () => {
    // Toyota Fortuner ($80/day) for 2 days
    expect(calculateBookingPrice({ dailyRate: 80, billableDays: 2 }).totalPrice).toBe(160);

    // Land Cruiser ($120/day) for 4 days
    expect(calculateBookingPrice({ dailyRate: 120, billableDays: 4 }).totalPrice).toBe(480);

    // Toyota Crown ($150/day) for 1 day
    expect(calculateBookingPrice({ dailyRate: 150, billableDays: 1 }).totalPrice).toBe(150);

    // Audi ($70/day) for 3 days
    expect(calculateBookingPrice({ dailyRate: 70, billableDays: 3 }).totalPrice).toBe(210);
  });

  it('handles 0 days or 0 daily rate without crashing', () => {
    expect(calculateBookingPrice({ dailyRate: 50, billableDays: 0 }).totalPrice).toBe(0);
    expect(calculateBookingPrice({ dailyRate: 0, billableDays: 5 }).totalPrice).toBe(0);
    expect(calculateBookingPrice({ dailyRate: -50, billableDays: -2 }).totalPrice).toBe(0);
  });
});

