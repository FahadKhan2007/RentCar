/**
 * Date and time validation utilities for car rentals.
 * Ensures all calculations rely strictly on the user's local timezone.
 */

/**
 * Returns a date string formatted as YYYY-MM-DD in the user's local timezone.
 * Uses getFullYear(), getMonth(), and getDate() instead of UTC toISOString().
 *
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export const getLocalDateString = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns a time string formatted as HH:MM in the user's local timezone.
 *
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export const getLocalTimeString = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Safely parses local date and time strings into a local Date object.
 *
 * @param {string} dateStr - YYYY-MM-DD
 * @param {string} [timeStr='00:00'] - HH:MM
 * @returns {Date|null}
 */
export const parseLocalDateTime = (dateStr, timeStr = '00:00') => {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const dateParts = dateStr.split('-').map(Number);
  if (dateParts.length !== 3 || dateParts.some(isNaN)) return null;
  const [year, month, day] = dateParts;

  const timeParts = (timeStr || '00:00').split(':').map(Number);
  const hours = isNaN(timeParts[0]) ? 0 : timeParts[0];
  const minutes = isNaN(timeParts[1]) ? 0 : timeParts[1];

  const parsed = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (isNaN(parsed.getTime())) return null;

  return parsed;
};

/**
 * Minimum rental duration in milliseconds (1 hour).
 */
export const MIN_RENTAL_DURATION_MS = 60 * 60 * 1000;

/**
 * Validates pickup and return dates and times according to rental business rules:
 * 1. Pickup date must not be in the past.
 * 2. If pickup date is today, pickup time must not be in the past.
 * 3. Return date and time must be at least 1 hour after pickup date and time.
 *
 * @param {Object} params
 * @param {string} params.pickupDate - YYYY-MM-DD
 * @param {string} [params.pickupTime='10:00'] - HH:MM
 * @param {string} params.returnDate - YYYY-MM-DD
 * @param {string} [params.returnTime='10:00'] - HH:MM
 * @param {Date} [params.now=new Date()]
 * @returns {{ isValid: boolean, error: string|null, pickupDateTime?: Date, returnDateTime?: Date, durationHours?: number }}
 */
export const validateBookingDates = ({
  pickupDate,
  pickupTime = '10:00',
  returnDate,
  returnTime = '10:00',
  now = new Date(),
}) => {
  if (!pickupDate) {
    return { isValid: false, error: 'Please choose a pickup date.' };
  }

  const pickupDateTime = parseLocalDateTime(pickupDate, pickupTime);
  if (!pickupDateTime) {
    return { isValid: false, error: 'Invalid pickup date or time format.' };
  }

  const todayStr = getLocalDateString(now);

  // Check if pickup date is in the past
  if (pickupDate < todayStr) {
    return { isValid: false, error: 'Pickup date cannot be in the past.' };
  }

  // If pickup date is today, compare full pickup datetime with current time
  if (pickupDate === todayStr && pickupDateTime.getTime() < now.getTime()) {
    return {
      isValid: false,
      error: 'Pickup time has already passed today. Please select a future time.',
    };
  }

  if (!returnDate) {
    return { isValid: false, error: 'Please choose a return date.' };
  }

  const returnDateTime = parseLocalDateTime(returnDate, returnTime);
  if (!returnDateTime) {
    return { isValid: false, error: 'Invalid return date or time format.' };
  }

  if (returnDate < pickupDate) {
    return {
      isValid: false,
      error: 'Return date cannot be earlier than pickup date.',
    };
  }

  const diffMs = returnDateTime.getTime() - pickupDateTime.getTime();

  if (diffMs <= 0) {
    return {
      isValid: false,
      error: 'Return date and time must be later than pickup date and time.',
    };
  }

  if (diffMs < MIN_RENTAL_DURATION_MS) {
    return {
      isValid: false,
      error: 'Minimum rental duration is 1 hour. Please adjust your return time.',
    };
  }

  const durationHours = diffMs / (1000 * 60 * 60);

  return {
    isValid: true,
    error: null,
    pickupDateTime,
    returnDateTime,
    durationHours,
  };
};

