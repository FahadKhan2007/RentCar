/**
 * Rental price and duration calculations.
 * Business Rule: Partial rental days are charged as full days.
 */

export const PRICING_RULES_NOTE = 'Partial rental days are charged as full days.';

/**
 * Calculates billable rental days between pickup and return timestamps.
 * Any fraction of a 24-hour cycle counts as a full billable day.
 *
 * @param {Date} pickupDateTime
 * @param {Date} returnDateTime
 * @returns {number} Integer representing billable days (minimum 1 if valid, 0 if invalid)
 */
export const calculateBillableRentalDays = (pickupDateTime, returnDateTime) => {
  if (
    !(pickupDateTime instanceof Date) ||
    isNaN(pickupDateTime.getTime()) ||
    !(returnDateTime instanceof Date) ||
    isNaN(returnDateTime.getTime())
  ) {
    return 0;
  }

  const diffMs = returnDateTime.getTime() - pickupDateTime.getTime();
  if (diffMs <= 0) return 0;

  const diffHours = diffMs / (1000 * 60 * 60);

  // Partial day is charged as a full day (e.g. 25 hours = 2 days)
  const billableDays = Math.ceil(diffHours / 24);

  return Math.max(1, billableDays);
};

/**
 * Calculates the complete price breakdown for a booking.
 *
 * @param {Object} params
 * @param {number} params.dailyRate - Daily rental rate in USD
 * @param {number} params.billableDays - Number of billable days
 * @param {number} [params.discountPercent=0] - Promo discount percentage (e.g. 10)
 * @returns {{ dailyRate: number, billableDays: number, subtotal: number, discountPercent: number, discountAmount: number, totalPrice: number, pricingNote: string }}
 */
export const calculateBookingPrice = ({
  dailyRate = 0,
  billableDays = 0,
  discountPercent = 0,
}) => {
  const safeDailyRate = Math.max(0, Number(dailyRate) || 0);
  const safeDays = Math.max(0, Math.floor(Number(billableDays) || 0));
  const safeDiscount = Math.max(0, Math.min(100, Number(discountPercent) || 0));

  const subtotal = safeDailyRate * safeDays;
  const discountAmount =
    safeDiscount > 0 ? Math.round((subtotal * safeDiscount) / 100) : 0;
  const totalPrice = Math.max(0, subtotal - discountAmount);

  return {
    dailyRate: safeDailyRate,
    billableDays: safeDays,
    subtotal,
    discountPercent: safeDiscount,
    discountAmount,
    totalPrice,
    pricingNote: PRICING_RULES_NOTE,
  };
};

