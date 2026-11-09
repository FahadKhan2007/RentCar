import { useRental } from '../context/useRental';
import { FaTag } from 'react-icons/fa';

const FloatingDiscountBtn = () => {
  const { discountApplied, openDiscountPopup } = useRental();

  if (discountApplied) return null;

  return (
    <button
      onClick={openDiscountPopup}
      className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-full shadow-2xl shadow-red-600/50 flex items-center gap-2 text-xs sm:text-sm transition-all duration-300 hover:scale-105 cursor-pointer border border-red-400/40 animate-bounce"
      title="Get 10% OFF Promo Code"
    >
      <FaTag className="text-white text-xs" />
      <span>Promo: 10% OFF</span>
    </button>
  );
};

export default FloatingDiscountBtn;

