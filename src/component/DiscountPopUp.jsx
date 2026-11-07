import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRental } from '../context/useRental';
import { FaTag, FaCheckCircle, FaTimes, FaCopy } from 'react-icons/fa';

const DiscountPopUp = () => {
  const {
    isDiscountPopupOpen,
    closeDiscountPopup,
    applyPromoCode,
    validPromoCode,
    discountApplied,
  } = useRental();

  const [copied, setCopied] = useState(false);
  const [appliedInPopup, setAppliedInPopup] = useState(false);
  const navigate = useNavigate();

  if (!isDiscountPopupOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(validPromoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyAndBook = () => {
    if (!discountApplied) {
      applyPromoCode(validPromoCode);
    }
    setAppliedInPopup(true);
    setTimeout(() => {
      closeDiscountPopup();
      navigate('/booking');
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 transition-opacity duration-300"
      onClick={closeDiscountPopup}
    >
      <div
        className="bg-gray-900 border border-gray-800 text-white rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeDiscountPopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 cursor-pointer"
          aria-label="Close modal"
        >
          <FaTimes size={16} />
        </button>

        <div className="text-center">
          <div className="w-14 h-14 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-inner">
            <FaTag />
          </div>

          <span className="text-xs uppercase font-semibold text-red-500 tracking-wider bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            Exclusive Limited Offer
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Unlock <span className="text-red-500">10% OFF</span>
          </h2>

          <p className="text-gray-300 mt-2 text-sm leading-relaxed">
            Apply promo code <b className="text-white font-mono">{validPromoCode}</b> at checkout to save 10% on any car in our fleet.
          </p>

          <div className="bg-gray-800/80 border border-red-500/30 rounded-xl p-4 mt-5">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Your 10% Discount Code
            </p>

            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-2xl font-mono font-extrabold text-red-500 tracking-wider select-all">
                {validPromoCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="bg-gray-700 hover:bg-gray-600 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition text-gray-200 cursor-pointer"
                title="Copy promo code"
              >
                <FaCopy size={11} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-2">
              Enter this code in the booking price summary to claim 10% OFF.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleApplyAndBook}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition cursor-pointer shadow-lg shadow-red-600/30 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {appliedInPopup ? (
                <>
                  <FaCheckCircle /> Applied! Going to Booking...
                </>
              ) : (
                'Apply Code & Start Booking'
              )}
            </button>

            <button
              type="button"
              onClick={closeDiscountPopup}
              className="w-full text-xs text-gray-400 hover:text-white py-2 transition"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPopUp;
