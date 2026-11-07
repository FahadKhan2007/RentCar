import { describe, it, expect } from 'vitest';
import {
  calculateBillableRentalDays,
  PRICING_RULES_NOTE,
} from '../bookingCalculations';

describe('Rental Day Calculations', () => {
  it('charges a minimum of 1 billable day for valid rentals under 24 hours', () => {
    // 2 hours same-day
    const pickup = new Date(2026, 5, 10, 10, 0);
    const returnTime = new Date(2026, 5, 10, 12, 0);
    expect(calculateBillableRentalDays(pickup, returnTime)).toBe(1);

    // Exactly 1 hour (minimum rental duration)
    const pickup1h = new Date(2026, 5, 10, 10, 0);
    const return1h = new Date(2026, 5, 10, 11, 0);
    expect(calculateBillableRentalDays(pickup1h, return1h)).toBe(1);

    // 23 hours same-day / next-day
    const pickup23h = new Date(2026, 5, 10, 10, 0);
    const return23h = new Date(2026, 5, 11, 9, 0);
    expect(calculateBillableRentalDays(pickup23h, return23h)).toBe(1);
  });

  it('charges exactly 1 day for a 24-hour rental', () => {
    const pickup = new Date(2026, 5, 10, 10, 0);
    const returnTime = new Date(2026, 5, 11, 10, 0);
    expect(calculateBillableRentalDays(pickup, returnTime)).toBe(1);
  });

  it('charges partial rental days as a full day (25 hours = 2 days)', () => {
    // 24 hours and 1 minute
    const pickup = new Date(2026, 5, 10, 10, 0);
    const returnTime1m = new Date(2026, 5, 11, 10, 1);
    expect(calculateBillableRentalDays(pickup, returnTime1m)).toBe(2);

    // 25 hours (late return by 1 hour)
    const returnTime25h = new Date(2026, 5, 11, 11, 0);
    expect(calculateBillableRentalDays(pickup, returnTime25h)).toBe(2);

    // 48 hours (exactly 2 days)
    const returnTime48h = new Date(2026, 5, 12, 10, 0);
    expect(calculateBillableRentalDays(pickup, returnTime48h)).toBe(2);

    // 49 hours (2 days and 1 hour -> 3 full days)
    const returnTime49h = new Date(2026, 5, 12, 11, 0);
    expect(calculateBillableRentalDays(pickup, returnTime49h)).toBe(3);
  });

  it('handles midnight boundary transitions accurately', () => {
    // 23:00 to 01:00 next day (2 hours total duration -> 1 billable day)
    const pickupMidnight = new Date(2026, 5, 10, 23, 0);
    const returnMidnight = new Date(2026, 5, 11, 1, 0);
    expect(calculateBillableRentalDays(pickupMidnight, returnMidnight)).toBe(1);

    // 23:00 to 00:30 two days later (25.5 hours total -> 2 billable days)
    const returnNextDayPast24h = new Date(2026, 5, 12, 0, 30);
    expect(calculateBillableRentalDays(pickupMidnight, returnNextDayPast24h)).toBe(2);
  });

  it('accurately calculates longer multi-day periods', () => {
    const pickup = new Date(2026, 5, 1, 10, 0);
    const returnTime = new Date(2026, 5, 8, 10, 0); // exactly 7 days
    expect(calculateBillableRentalDays(pickup, returnTime)).toBe(7);

    // 7 days and 30 minutes -> 8 billable days
    const returnTimePartial = new Date(2026, 5, 8, 10, 30);
    expect(calculateBillableRentalDays(pickup, returnTimePartial)).toBe(8);
  });

  it('safely returns 0 for invalid or reverse dates', () => {
    const pickup = new Date(2026, 5, 10, 10, 0);
    const returnEarlier = new Date(2026, 5, 9, 10, 0);
    expect(calculateBillableRentalDays(pickup, returnEarlier)).toBe(0);
    expect(calculateBillableRentalDays(null, pickup)).toBe(0);
    expect(calculateBillableRentalDays(pickup, undefined)).toBe(0);
    expect(calculateBillableRentalDays('invalid', 'dates')).toBe(0);
  });

  it('provides the official pricing rules note', () => {
    expect(PRICING_RULES_NOTE).toBe('Partial rental days are charged as full days.');
  });
});

