/**
 * Safe localStorage wrapper with Array.isArray() validation
 * Prevents application crashes caused by corrupted, missing, or malformed data.
 */

export const STORAGE_KEYS = {
  BOOKINGS: 'car_rental_bookings',
  MESSAGES: 'car_rental_contact_messages',
  PROMO_CODE: 'car_rental_applied_promo',
};

const getStorage = (customStorage) => {
  if (customStorage) return customStorage;
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

/**
 * Safely loads and validates saved bookings from localStorage.
 * Always returns an Array, never throws.
 *
 * @param {Storage} [customStorage]
 * @returns {Array}
 */
export const loadSavedBookings = (customStorage) => {
  const storage = getStorage(customStorage);
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Filter valid booking objects with string IDs
    return parsed.filter(
      (b) => b && typeof b === 'object' && typeof b.id === 'string'
    );
  } catch {
    return [];
  }
};

/**
 * Safely saves bookings array to localStorage.
 *
 * @param {Array} bookings
 * @param {Storage} [customStorage]
 * @returns {boolean}
 */
export const saveBookings = (bookings, customStorage) => {
  const storage = getStorage(customStorage);
  if (!storage) return false;

  try {
    const safeData = Array.isArray(bookings) ? bookings : [];
    storage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(safeData));
    return true;
  } catch (err) {
    console.error('Failed to write bookings to localStorage:', err);
    return false;
  }
};

/**
 * Safely loads contact inquiries from localStorage with Array.isArray() validation.
 *
 * @param {Storage} [customStorage]
 * @returns {Array}
 */
export const loadSavedMessages = (customStorage) => {
  const storage = getStorage(customStorage);
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((m) => m && typeof m === 'object');
  } catch {
    return [];
  }
};

/**
 * Safely saves contact inquiries array to localStorage.
 *
 * @param {Array} messages
 * @param {Storage} [customStorage]
 * @returns {boolean}
 */
export const saveMessages = (messages, customStorage) => {
  const storage = getStorage(customStorage);
  if (!storage) return false;

  try {
    const safeData = Array.isArray(messages) ? messages : [];
    storage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(safeData));
    return true;
  } catch (err) {
    console.error('Failed to write contact messages to localStorage:', err);
    return false;
  }
};

/**
 * Safely loads active promo code from localStorage.
 *
 * @param {Storage} [customStorage]
 * @returns {string|null}
 */
export const loadSavedPromoCode = (customStorage) => {
  const storage = getStorage(customStorage);
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEYS.PROMO_CODE);
    if (!raw || typeof raw !== 'string') return null;

    if (raw.trim().toUpperCase() === 'NIAZI804') {
      return 'Niazi804';
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Safely saves or clears active promo code in localStorage.
 *
 * @param {string|null} code
 * @param {Storage} [customStorage]
 * @returns {boolean}
 */
export const savePromoCode = (code, customStorage) => {
  const storage = getStorage(customStorage);
  if (!storage) return false;

  try {
    if (code && typeof code === 'string' && code.trim().toUpperCase() === 'NIAZI804') {
      storage.setItem(STORAGE_KEYS.PROMO_CODE, 'Niazi804');
    } else {
      storage.removeItem(STORAGE_KEYS.PROMO_CODE);
    }
    return true;
  } catch {
    return false;
  }
};
