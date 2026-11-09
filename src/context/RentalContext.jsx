import { useState, useEffect, useCallback } from 'react';
import { RentalContext } from './RentalContextInstance';
import { VALID_PROMO_CODE, PROMO_DISCOUNT_PERCENT, validatePromoCode } from '../utils/promoCode';
import {
  loadSavedBookings,
  saveBookings,
  loadSavedPromoCode,
  savePromoCode,
} from '../utils/storage';

export const RentalProvider = ({ children }) => {
  // Promo code state loaded safely from localStorage
  const [promoCode, setPromoCode] = useState(() => {
    return loadSavedPromoCode();
  });

  // 10% Discount is strictly applied ONLY when the correct promo code Niazi804 is active
  const [discountApplied, setDiscountApplied] = useState(() => {
    const saved = loadSavedPromoCode();
    return Boolean(saved && saved.toUpperCase() === VALID_PROMO_CODE.toUpperCase());
  });

  const [isDiscountPopupOpen, setIsDiscountPopupOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Saved bookings backed by safe localStorage parser with Array.isArray() validation
  const [bookings, setBookings] = useState(() => {
    return loadSavedBookings();
  });

  // Clean up legacy auto-discount keys from previous sessions to prevent accidental free discounts
  useEffect(() => {
    try {
      localStorage.removeItem('discount');
      localStorage.removeItem('discount_applied');
      localStorage.removeItem('discount_email');
      localStorage.removeItem('discount_user_email');
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  // Show promotional popup on load if discount is not yet applied
  useEffect(() => {
    let timer;
    try {
      const savedCode = loadSavedPromoCode();
      if (!savedCode && !discountApplied) {
        timer = setTimeout(() => {
          setIsDiscountPopupOpen(true);
        }, 1000);
      }
    } catch {
      // Fallback
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [discountApplied]);

  // Apply promo code with case-insensitivity and single-discount enforcement
  const applyPromoCode = useCallback(
    (code = '') => {
      const result = validatePromoCode(code, discountApplied);

      if (!result.isValid) {
        return { success: false, error: result.error };
      }

      setPromoCode(result.code);
      setDiscountApplied(true);
      savePromoCode(result.code);

      return {
        success: true,
        message: result.message,
        code: result.code,
        discountPercent: result.discountPercent,
      };
    },
    [discountApplied]
  );

  // Remove applied promo code
  const removePromoCode = useCallback(() => {
    setPromoCode(null);
    setDiscountApplied(false);
    savePromoCode(null);
  }, []);

  const closeDiscountPopup = useCallback(() => {
    setIsDiscountPopupOpen(false);
  }, []);

  const openDiscountPopup = useCallback(() => {
    setIsDiscountPopupOpen(true);
  }, []);

  // Safe booking persistence
  const saveBooking = useCallback((bookingData) => {
    const newBooking = {
      id: `CR-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...bookingData,
    };

    setBookings((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = [newBooking, ...safePrev];
      saveBookings(updated);
      return updated;
    });

    return newBooking;
  }, []);

  const deleteBooking = useCallback((bookingId) => {
    setBookings((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.filter((b) => b && b.id !== bookingId);
      saveBookings(updated);
      return updated;
    });
  }, []);

  return (
    <RentalContext.Provider
      value={{
        promoCode,
        discountApplied,
        discountPercent: discountApplied ? PROMO_DISCOUNT_PERCENT : 0,
        validPromoCode: VALID_PROMO_CODE,
        applyPromoCode,
        removePromoCode,
        isDiscountPopupOpen,
        openDiscountPopup,
        closeDiscountPopup,
        selectedCar,
        setSelectedCar,
        bookings,
        saveBooking,
        deleteBooking,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};
