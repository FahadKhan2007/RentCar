import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRental } from '../context/useRental';
import { isValidEmail } from '../data/constants';
import { FaTag, FaCheckCircle, FaTimes } from 'react-icons/fa';

const DiscountPopUp = () => {
  const { isDiscountPopupOpen, closeDiscountPopup, applyDiscount, discountCode, userEmail } = useRental();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  if (!isDiscountPopupOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      setError('Please enter your email address to receive 10% OFF.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address (e.g. yourname@example.com).');
      return;
    }

    const res = applyDiscount(email.trim());
    if (res.success) {
      setError('');
      setSubmitted(true);
    } else {
      setError(res.message || 'Could not apply discount. Please try again.');
    }
  };

  const handleStartBooking = () => {
    closeDiscountPopup();
    navigate('/booking');
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

        {!submitted ? (
          <>
            <div className="w-14 h-14 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-inner">
              <FaTag />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight">
              Get <span className="text-red-500">10% OFF</span>
            </h2>

            <p className="text-gray-300 text-center mt-3 text-sm sm:text-base leading-relaxed">
              Enter your email address below to unlock an exclusive <b>10% OFF</b> discount on all car rentals.
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-red-300 text-xs text-center">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5" noValidate>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg mt-4 transition cursor-pointer shadow-lg shadow-red-600/30 text-sm uppercase tracking-wider"
              >
                Claim 10% OFF Now
              </button>
            </form>

            <p className="text-[11px] text-gray-500 text-center mt-3">
              * Discount applies instantly to your entire rental after entering email.
            </p>
          </>
        ) : (
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
              <FaCheckCircle />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              🎉 Congratulations!
            </h2>

            <p className="text-gray-300 mt-2 text-sm">
              Your 10% discount has been activated for:
            </p>
            <p className="font-semibold text-red-400 text-sm mt-0.5">
              {email.trim() || userEmail}
            </p>

            <div className="bg-gray-800/80 border border-red-500/30 rounded-xl p-4 mt-5">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Active Promo Code
              </p>

              <div className="text-2xl font-mono font-bold text-red-500 mt-1 select-all">
                {discountCode}
              </div>

              <p className="text-xs text-green-400 mt-2 flex items-center justify-center gap-1 font-medium">
                ✓ Auto-applied to all rental prices!
              </p>
            </div>

            <button
              onClick={handleStartBooking}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg mt-5 transition cursor-pointer shadow-lg shadow-red-600/30"
            >
              Start Booking With 10% OFF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountPopUp;
