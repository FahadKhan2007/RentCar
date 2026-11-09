import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRental } from '../context/useRental';
import {
  FaTag,
  FaCheckCircle,
  FaTimes,
  FaCopy,
  FaPaperPlane,
  FaSpinner,
  FaExclamationTriangle,
  FaRedo,
  FaExternalLinkAlt,
} from 'react-icons/fa';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DiscountPopUp = () => {
  const {
    isDiscountPopupOpen,
    closeDiscountPopup,
    applyPromoCode,
    validPromoCode,
  } = useRental();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setError('');
    closeDiscountPopup();
  }, [closeDiscountPopup]);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isDiscountPopupOpen && !submitted) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isDiscountPopupOpen, submitted]);

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

  // Cooldown countdown effect for the resend button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  if (!isDiscountPopupOpen) return null;

  const handleSendEmail = async (targetEmail) => {
    const trimmed = targetEmail.trim();

    if (!trimmed) {
      setError('Please enter your email address to receive your 10% promo code.');
      return false;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address (e.g. yourname@example.com).');
      return false;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            'Unable to deliver email at this time. Please verify your email and try again.'
        );
      }

      setSubmitted(true);
      setSuccessEmail(trimmed);
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
      setResendCooldown(30); // 30 seconds cooldown between resends
      return true;
    } catch (err) {
      setError(
        err.message || 'Network error: could not connect to email delivery service.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    await handleSendEmail(email);
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return;
    await handleSendEmail(successEmail || email);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(validPromoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyAndBook = () => {
    applyPromoCode(validPromoCode);
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

        {!submitted ? (
          /* Form View: Offer + Email Input + Get My Promo Code Button */
          <div className="text-center">
            <div className="w-14 h-14 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-inner">
              <FaTag />
            </div>

            <span className="text-xs uppercase font-semibold text-red-500 tracking-wider bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              Exclusive 10% Discount
            </span>

            <h2 id="promo-popup-heading" className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
              Get <span className="text-red-500">10% OFF</span>
            </h2>

            <p className="text-gray-300 mt-2 text-sm leading-relaxed">
              Enter your email address to receive your exclusive 10% discount promo code sent directly to your inbox with full redemption instructions.
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-red-300 text-xs text-left flex items-start gap-2">
                <FaExclamationTriangle className="text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5" noValidate>
              <div className="text-left">
                <label
                  htmlFor="promo-popup-email-input"
                  className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
                >
                  Your Email Address *
                </label>
                <input
                  id="promo-popup-email-input"
                  ref={inputRef}
                  type="email"
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800/60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg mt-4 transition cursor-pointer shadow-lg shadow-red-600/30 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-base" />
                    <span>Sending Promo Code...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    <span>Get My Promo Code</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-[11px] text-gray-500 text-center mt-4">
              🔒 We respect your privacy. No spam, only your 10% promo code.
            </p>
          </div>
        ) : (
          /* Success View: Delivery Confirmation + Code Details + Resend Option */
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
              <FaCheckCircle />
            </div>

            <h2 id="promo-popup-heading" className="text-2xl sm:text-3xl font-extrabold text-white">
              Promo Code Sent!
            </h2>

            <p className="text-gray-300 mt-2 text-sm leading-relaxed">
              We have dispatched your exclusive 10% discount promo code to:
            </p>
            <p className="font-semibold text-red-400 text-sm mt-0.5 break-all">
              {successEmail}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Please check your inbox (and spam/junk folder) for your promo code and redemption instructions.
            </p>

            {previewUrl && (
              <div className="mt-3">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 underline font-medium bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-lg"
                >
                  <FaExternalLinkAlt size={10} />
                  <span>View Sent Email (Preview Link)</span>
                </a>
              </div>
            )}

            {/* Promo Code Box */}
            <div className="bg-gray-800/80 border border-red-500/30 rounded-xl p-4 mt-5">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Your Promo Code
              </p>

              <div className="flex items-center justify-center gap-3 mt-1.5">
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

              <p className="text-xs text-green-400 mt-2 font-medium flex items-center justify-center gap-1">
                ✓ Valid for 10% OFF on all vehicles
              </p>
            </div>

            {error && (
              <div className="mt-3 p-2.5 bg-red-950/80 border border-red-500/50 rounded-lg text-red-300 text-xs text-left">
                ⚠️ {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleApplyAndBook}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-lg transition cursor-pointer shadow-lg shadow-red-600/30 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Apply Code & Start Booking
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isLoading}
                className="text-xs text-gray-400 hover:text-white py-1.5 transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FaRedo size={10} className={isLoading ? 'animate-spin' : ''} />
                <span>
                  {resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : 'Didn’t receive email? Resend Promo Code'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setError('');
                }}
                className="text-[11px] text-gray-400 hover:text-red-400 underline transition cursor-pointer mt-1"
              >
                Send to a different email address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountPopUp;
