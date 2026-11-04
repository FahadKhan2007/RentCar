import { useState, useEffect, useCallback } from 'react';
import { RentalContext } from './RentalContextInstance';
import { DISCOUNT_CODE, isValidEmail } from '../data/constants';

export const RentalProvider = ({ children }) => {
  // Store user email that unlocked the 10% discount
  const [userEmail, setUserEmail] = useState(() => {
    try {
      const email = localStorage.getItem('discount_user_email') || localStorage.getItem('discount_email');
      return isValidEmail(email) ? email.trim() : '';
    } catch {
      return '';
    }
  });

  // Discount is STRICTLY applied only when a valid email has been entered
  const [discountApplied, setDiscountApplied] = useState(() => {
    try {
      const email = localStorage.getItem('discount_user_email') || localStorage.getItem('discount_email');
      return isValidEmail(email);
    } catch {
      return false;
    }
  });

  const [isDiscountPopupOpen, setIsDiscountPopupOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Saved bookings backed by localStorage
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('car_rental_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Automatically trigger discount popup for visitors who have not yet entered their email
  useEffect(() => {
    let timer;
    try {
      const email = localStorage.getItem('discount_user_email') || localStorage.getItem('discount_email');
      const hasEnteredEmail = isValidEmail(email);

      // If user has not entered their email to claim the discount, show popup automatically
      if (!hasEnteredEmail) {
        timer = setTimeout(() => {
          setIsDiscountPopupOpen(true);
        }, 700);
      }
    } catch {
      // Fallback
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Apply discount: only succeeds if a valid email is provided
  const applyDiscount = useCallback((email = '') => {
    const trimmed = typeof email === 'string' ? email.trim() : '';
    if (!isValidEmail(trimmed)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    try {
      localStorage.setItem('discount_user_email', trimmed);
      localStorage.setItem('discount_email', trimmed);
      localStorage.setItem('discount', 'true');
      localStorage.setItem('discount_applied', 'true');
      window.dispatchEvent(new Event('discountApplied'));
    } catch (e) {
      console.warn('LocalStorage not available', e);
    }

    setUserEmail(trimmed);
    setDiscountApplied(true);
    return { success: true, message: '10% Discount applied successfully!' };
  }, []);

  const removeDiscount = useCallback(() => {
    try {
      localStorage.removeItem('discount_user_email');
      localStorage.removeItem('discount_email');
      localStorage.removeItem('discount');
      localStorage.removeItem('discount_applied');
      window.dispatchEvent(new Event('discountRemoved'));
    } catch (e) {
      console.warn('LocalStorage not available', e);
    }
    setUserEmail('');
    setDiscountApplied(false);
  }, []);

  const closeDiscountPopup = useCallback(() => {
    setIsDiscountPopupOpen(false);
  }, []);

  const openDiscountPopup = useCallback(() => {
    setIsDiscountPopupOpen(true);
  }, []);

  const saveBooking = useCallback((bookingData) => {
    const newBooking = {
      id: `CR-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...bookingData,
    };

    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('car_rental_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save booking to localStorage', e);
      }
      return updated;
    });

    return newBooking;
  }, []);

  const deleteBooking = useCallback((bookingId) => {
    setBookings((prev) => {
      const updated = prev.filter((b) => b.id !== bookingId);
      try {
        localStorage.setItem('car_rental_bookings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update bookings in localStorage', e);
      }
      return updated;
    });
  }, []);

  return (
    <RentalContext.Provider
      value={{
        userEmail,
        discountApplied,
        discountCode: DISCOUNT_CODE,
        applyDiscount,
        removeDiscount,
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
