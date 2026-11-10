import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRental } from '../context/useRental';
import {
  FaTag,
  FaCheckCircle,
  FaTimes,
  FaCopy,
  FaArrowRight,
} from 'react-icons/fa';

const DiscountPopUp = () => {
  const {
    isDiscountPopupOpen,
    closeDiscountPopup,
    applyPromoCode,
    validPromoCode,
    discountApplied,
  } = useRental();

  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setCopied(false);
    closeDiscountPopup();
  }, [closeDiscountPopup]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isDiscountPopupOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDiscountPopupOpen, handleClose]);

  if (!isDiscountPopupOpen) return null;

  const handleCopyCode = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(validPromoCode);
      } else {
        // Fallback for older browsers or restricted environments
        const textArea = document.createElement('textarea');
        textArea.value = validPromoCode;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleApplyAndBook = () => {
    // Only apply if not already applied
    if (!discountApplied) {
      applyPromoCode(validPromoCode);
    }
    closeDiscountPopup();
    navigate('/booking');
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-heading"
    >
      <div
        className="bg-gray-900 border border-gray-800 text-white rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 cursor-pointer"
          aria-label="Close modal"
        >
          <FaTimes size={16} />
        </button>

        <div className="text-center">
          {/* Tag Icon Header */}
          <div className="w-14 h-14 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-inner">
            <FaTag />
          </div>

          <span className="text-xs uppercase font-semibold text-red-500 tracking-wider bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            Exclusive 10% Discount
          </span>

          <h2
            id="promo-popup-heading"
            className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight"
          >
            Get <span className="text-red-500">10% OFF</span> Your Rental
          </h2>

          <p className="text-gray-300 mt-2 text-sm leading-relaxed">
            Apply our official promo code at checkout to unlock an instant 10% discount on any vehicle in our fleet.
          </p>

          {/* Promo Code Box */}
          <div className="bg-gray-800/80 border border-red-500/30 rounded-xl p-4 mt-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Official Promo Code
            </p>

            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-red-500 tracking-wider select-all">
                {validPromoCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition text-gray-200 cursor-pointer shadow-sm font-medium"
                title="Copy promo code to clipboard"
                aria-label="Copy promo code"
              >
                {copied ? (
                  <>
                    <FaCheckCircle className="text-green-400" size={12} />
                    <span className="text-green-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy size={12} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Success message after copying */}
            {copied ? (
              <div className="mt-2.5 p-2 bg-green-950/60 border border-green-500/40 rounded-lg text-green-300 text-xs flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
                <FaCheckCircle className="text-green-400 shrink-0" size={12} />
                <span>Congratulations! Promo code copied to clipboard.</span>
              </div>
            ) : (
              <p className="text-xs text-green-400 mt-2.5 font-medium flex items-center justify-center gap-1">
                ✓ Valid for 10% OFF on all vehicles
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleApplyAndBook}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-lg transition cursor-pointer shadow-lg shadow-red-600/30 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>
                {discountApplied ? 'Continue to Booking' : 'Apply Code & Start Booking'}
              </span>
              <FaArrowRight size={12} />
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-gray-400 hover:text-white py-1.5 transition cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPopUp;
