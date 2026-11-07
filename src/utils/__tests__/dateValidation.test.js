import { describe, it, expect } from 'vitest';
import {
  getLocalDateString,
  getLocalTimeString,
  parseLocalDateTime,
  validateBookingDates,
} from '../dateValidation';

describe('Local Date and Time Calculation & Validation', () => {
  it('formats local date strictly using getFullYear, getMonth, getDate without UTC offset issues', () => {
    // June 15, 2026 local time
    const localDate = new Date(2026, 5, 15, 14, 30);
    expect(getLocalDateString(localDate)).toBe('2026-06-15');

    // January 5, 2026 local time (padding checks)
    const janDate = new Date(2026, 0, 5, 8, 5);
    expect(getLocalDateString(janDate)).toBe('2026-01-05');
    expect(getLocalTimeString(janDate)).toBe('08:05');
  });

  it('correctly parses date and time into local Date object', () => {
    const parsed = parseLocalDateTime('2026-08-20', '15:45');
    expect(parsed).not.toBeNull();
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(7); // 0-indexed August
    expect(parsed.getDate()).toBe(20);
    expect(parsed.getHours()).toBe(15);
    expect(parsed.getMinutes()).toBe(45);
  });

  describe('Pickup Date Validation', () => {
    const mockNow = new Date(2026, 5, 10, 12, 0); // 2026-06-10 12:00

    it('rejects missing pickup date', () => {
      const res = validateBookingDates({
        pickupDate: '',
        returnDate: '2026-06-11',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Please choose a pickup date.');
    });

    it('rejects pickup dates in the past', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-09',
        returnDate: '2026-06-11',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Pickup date cannot be in the past.');
    });

    it('rejects pickup time that has already passed today', () => {
      // Current time is 12:00, user chose 10:00 today
      const res = validateBookingDates({
        pickupDate: '2026-06-10',
        pickupTime: '10:00',
        returnDate: '2026-06-11',
        returnTime: '10:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe(
        'Pickup time has already passed today. Please select a future time.'
      );
    });

    it('accepts pickup time in the future today', () => {
      // Current time is 12:00, user chose 14:00 today
      const res = validateBookingDates({
        pickupDate: '2026-06-10',
        pickupTime: '14:00',
        returnDate: '2026-06-11',
        returnTime: '14:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(true);
      expect(res.error).toBeNull();
    });

    it('accepts pickup dates in the future regardless of time of day', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-15',
        pickupTime: '08:00',
        returnDate: '2026-06-16',
        returnTime: '10:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(true);
    });
  });

  describe('Return Date and Time Validation', () => {
    const mockNow = new Date(2026, 5, 10, 9, 0); // 2026-06-10 09:00

    it('rejects missing return date', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-11',
        pickupTime: '10:00',
        returnDate: '',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Please choose a return date.');
    });

    it('rejects return date earlier than pickup date', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-12',
        pickupTime: '10:00',
        returnDate: '2026-06-11',
        returnTime: '10:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe('Return date cannot be earlier than pickup date.');
    });

    it('rejects return time earlier than pickup time on same day', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-12',
        pickupTime: '14:00',
        returnDate: '2026-06-12',
        returnTime: '11:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe(
        'Return date and time must be later than pickup date and time.'
      );
    });

    it('rejects identical pickup and return date and time', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-12',
        pickupTime: '14:00',
        returnDate: '2026-06-12',
        returnTime: '14:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe(
        'Return date and time must be later than pickup date and time.'
      );
    });
  });

  describe('Minimum Rental Duration', () => {
    const mockNow = new Date(2026, 5, 10, 8, 0);

    it('rejects rentals shorter than 1 hour', () => {
      // 30 minutes duration
      const res = validateBookingDates({
        pickupDate: '2026-06-11',
        pickupTime: '10:00',
        returnDate: '2026-06-11',
        returnTime: '10:30',
        now: mockNow,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toBe(
        'Minimum rental duration is 1 hour. Please adjust your return time.'
      );
    });

    it('accepts rentals exactly 1 hour long', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-11',
        pickupTime: '10:00',
        returnDate: '2026-06-11',
        returnTime: '11:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(true);
      expect(res.durationHours).toBe(1);
    });

    it('accepts multi-hour same-day rentals', () => {
      const res = validateBookingDates({
        pickupDate: '2026-06-11',
        pickupTime: '09:00',
        returnDate: '2026-06-11',
        returnTime: '17:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(true);
      expect(res.durationHours).toBe(8);
    });

    it('correctly validates overnight and midnight rentals', () => {
      // 23:30 to 01:00 next day (1.5 hours)
      const res = validateBookingDates({
        pickupDate: '2026-06-11',
        pickupTime: '23:30',
        returnDate: '2026-06-12',
        returnTime: '01:00',
        now: mockNow,
      });
      expect(res.isValid).toBe(true);
      expect(res.durationHours).toBe(1.5);
    });
  });
});

