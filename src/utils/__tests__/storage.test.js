import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadSavedBookings,
  saveBookings,
  loadSavedMessages,
  saveMessages,
  loadSavedPromoCode,
  savePromoCode,
  STORAGE_KEYS,
} from '../storage';

// Mock localStorage for Vitest
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

describe('Storage & Data Validation (Array.isArray)', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = new LocalStorageMock();
  });

  describe('loadSavedBookings with Invalid Data Protection', () => {
    it('safely returns [] when localStorage is empty', () => {
      expect(loadSavedBookings(mockStorage)).toEqual([]);
    });

    it('safely returns [] when localStorage contains corrupted JSON', () => {
      mockStorage.setItem(STORAGE_KEYS.BOOKINGS, '{not-valid-json: true,');
      expect(loadSavedBookings(mockStorage)).toEqual([]);
    });

    it('safely returns [] when localStorage contains a non-array JSON object', () => {
      mockStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify({ id: 'CR-123', car: 'Fortuner' }));
      expect(loadSavedBookings(mockStorage)).toEqual([]);
    });

    it('safely returns [] when localStorage contains primitive types', () => {
      mockStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify('a string'));
      expect(loadSavedBookings(mockStorage)).toEqual([]);

      mockStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(12345));
      expect(loadSavedBookings(mockStorage)).toEqual([]);

      mockStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(true));
      expect(loadSavedBookings(mockStorage)).toEqual([]);
    });

    it('safely returns [] if storage.getItem throws an exception', () => {
      const errorStorage = {
        getItem: () => {
          throw new Error('Storage access denied');
        },
      };
      expect(loadSavedBookings(errorStorage)).toEqual([]);
    });

    it('successfully loads a valid array of bookings', () => {
      const validBookings = [
        { id: 'CR-1', customerName: 'John', carName: 'Toyota Corolla' },
        { id: 'CR-2', customerName: 'Alice', carName: 'BMW 5 Series' },
      ];
      mockStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(validBookings));

      const loaded = loadSavedBookings(mockStorage);
      expect(Array.isArray(loaded)).toBe(true);
      expect(loaded).toHaveLength(2);
      expect(loaded[0].id).toBe('CR-1');
    });

    it('filters out null or malformed items from an array', () => {
      const mixedData = [
        { id: 'CR-1', customerName: 'John' },
        null,
        undefined,
        'random-string',
        { customerName: 'Missing ID' },
      ];
      mockStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(mixedData));

      const loaded = loadSavedBookings(mockStorage);
      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe('CR-1');
    });
  });

  describe('saveBookings', () => {
    it('saves a valid array of bookings', () => {
      const bookings = [{ id: 'CR-100', carName: 'Audi' }];
      const saved = saveBookings(bookings, mockStorage);
      expect(saved).toBe(true);
      expect(JSON.parse(mockStorage.getItem(STORAGE_KEYS.BOOKINGS))).toEqual(bookings);
    });

    it('safely saves an empty array if passed a non-array', () => {
      saveBookings('not-an-array', mockStorage);
      expect(mockStorage.getItem(STORAGE_KEYS.BOOKINGS)).toBe('[]');
    });
  });

  describe('Contact Messages Storage Protection', () => {
    it('safely returns [] when messages data is corrupted or non-array', () => {
      mockStorage.setItem(STORAGE_KEYS.MESSAGES, 'corrupt-json');
      expect(loadSavedMessages(mockStorage)).toEqual([]);

      mockStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify({ message: 'Hello' }));
      expect(loadSavedMessages(mockStorage)).toEqual([]);
    });

    it('saves and loads valid contact inquiries array', () => {
      const messages = [{ id: 'MSG-1', name: 'Bob', message: 'Test message' }];
      saveMessages(messages, mockStorage);

      const loaded = loadSavedMessages(mockStorage);
      expect(Array.isArray(loaded)).toBe(true);
      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe('MSG-1');
    });
  });

  describe('Promo Code Storage', () => {
    it('saves and loads valid promo code Niazi804', () => {
      savePromoCode('Niazi804', mockStorage);
      expect(loadSavedPromoCode(mockStorage)).toBe('Niazi804');

      // Case-insensitivity normalization
      savePromoCode('niazi804', mockStorage);
      expect(loadSavedPromoCode(mockStorage)).toBe('Niazi804');
    });

    it('clears promo code when passed invalid or null code', () => {
      savePromoCode('Niazi804', mockStorage);
      expect(loadSavedPromoCode(mockStorage)).toBe('Niazi804');

      savePromoCode(null, mockStorage);
      expect(loadSavedPromoCode(mockStorage)).toBeNull();
    });
  });
});

