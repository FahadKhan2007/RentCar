/**
 * Promo code validation and discount configuration.
 */

export const VALID_PROMO_CODE = 'Niazi804';
export const PROMO_DISCOUNT_PERCENT = 10;

/**
 * Validates a promo code string.
 *
 * Requirements:
 * - Valid code is Niazi804 (case-insensitive)
 * - Only applies when correctly entered
 * - Rejects multiple discounts if already applied
 *
 * @param {string} inputCode
 * @param {boolean} [isAlreadyApplied=false]
 * @returns {{ isValid: boolean, error: string|null, code: string|null, discountPercent: number, message?: string }}
 */
export const validatePromoCode = (inputCode, isAlreadyApplied = false) => {
  if (isAlreadyApplied) {
    return {
      isValid: false,
      error: 'A promo code has already been applied. Only one discount is allowed per booking.',
      code: null,
      discountPercent: 0,
    };
  }

  if (!inputCode || typeof inputCode !== 'string' || !inputCode.trim()) {
    return {
      isValid: false,
      error: 'Please enter a promo code.',
      code: null,
      discountPercent: 0,
    };
  }

  const normalized = inputCode.trim();

  if (normalized.toUpperCase() === VALID_PROMO_CODE.toUpperCase()) {
    return {
      isValid: true,
      error: null,
      code: VALID_PROMO_CODE,
      discountPercent: PROMO_DISCOUNT_PERCENT,
      message: `Promo code ${VALID_PROMO_CODE} applied! 10% OFF discount unlocked.`,
    };
  }

  return {
    isValid: false,
    error: 'Invalid promo code. Please enter a valid promo code.',
    code: null,
    discountPercent: 0,
  };
};

