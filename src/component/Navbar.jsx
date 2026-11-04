import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaTag } from 'react-icons/fa';
import { useRental } from '../context/useRental';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { discountApplied, openDiscountPopup } = useRental();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cars', path: '/cars' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-900">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 text-white">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold tracking-wider flex items-center gap-1 group"
        >
          <span>CAR</span>
          <span className="text-red-500 group-hover:text-red-400 transition">RENT</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm font-medium transition py-1 relative ${
                  isActive(link.path)
                    ? 'text-red-500 font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Buttons & Discount Badge */}
        <div className="hidden md:flex items-center gap-4">
          {discountApplied ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
              <FaTag className="text-[10px]" />
              10% OFF Active
            </span>
          ) : (
            <button
              onClick={openDiscountPopup}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white transition cursor-pointer"
            >
              <FaTag className="text-[10px]" />
              Get 10% OFF
            </button>
          )}

          <Link
            to="/booking"
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition shadow-md shadow-red-600/30"
          >
            Rent Now
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-3 md:hidden">
          {!discountApplied && (
            <button
              onClick={openDiscountPopup}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600/20 text-red-400 border border-red-500/40"
            >
              10% OFF
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none rounded-lg hover:bg-gray-900 transition"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-950 border-b border-gray-800 px-6 py-5 animate-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={closeMenu}
                  className={`block py-2 text-base transition ${
                    isActive(link.path)
                      ? 'text-red-500 font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 mt-4 border-t border-gray-800 flex flex-col gap-3">
            {discountApplied ? (
              <div className="flex items-center justify-between text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                <span className="flex items-center gap-1.5 font-medium">
                  <FaTag /> 10% Promo Discount Applied
                </span>
                <span className="font-bold">Niazi804</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  closeMenu();
                  openDiscountPopup();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-gray-800 text-red-400 border border-red-500/30 hover:bg-gray-700 transition"
              >
                Claim 10% Discount
              </button>
            )}

            <Link
              to="/booking"
              onClick={closeMenu}
              className="w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition shadow-md shadow-red-600/30"
            >
              Rent Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
