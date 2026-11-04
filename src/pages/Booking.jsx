import { useState, useMemo } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { useRental } from '../context/useRental';
import { CARS_DATA, getCarByName } from '../data/carsData';
import {
  FaCalendarAlt,
  FaClock,
  FaCar,
  FaCheckCircle,
  FaTrashAlt,
  FaTag,
  FaShieldAlt,
} from 'react-icons/fa';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const {
    userEmail,
    discountApplied,
    discountCode,
    applyDiscount,
    openDiscountPopup,
    selectedCar,
    bookings,
    saveBooking,
    deleteBooking,
  } = useRental();

  // Get today's date formatted as YYYY-MM-DD
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Determine initial car from query param, router state, or context
  const initialCarParam = searchParams.get('car');
  const initialCarState = location.state?.carName;
  const resolvedInitialCar = useMemo(() => {
    const name = initialCarParam || initialCarState || selectedCar?.name;
    return getCarByName(name);
  }, [initialCarParam, initialCarState, selectedCar]);

  // Form state initialized with pre-selected car
  const [bookingData, setBookingData] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    car: resolvedInitialCar ? resolvedInitialCar.name : '',
    pickupdate: '',
    returndate: '',
    pickuptime: '10:00',
    returntime: '10:00',
  }));

  const [dateError, setDateError] = useState('');
  const [discountEmailInput, setDiscountEmailInput] = useState('');
  const [discountEmailError, setDiscountEmailError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showBookingsList, setShowBookingsList] = useState(false);

  // Sync selected car object whenever bookingData.car changes
  const currentCar = useMemo(() => {
    return getCarByName(bookingData.car) || null;
  }, [bookingData.car]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDateError('');
  };

  // Date and duration calculation
  const rentalCalculations = useMemo(() => {
    if (!bookingData.pickupdate || !bookingData.returndate || !currentCar) {
      return { days: 1, subtotal: currentCar?.pricePerDay || 0, discount: 0, total: currentCar?.pricePerDay || 0 };
    }

    const start = new Date(`${bookingData.pickupdate}T${bookingData.pickuptime || '00:00'}`);
    const end = new Date(`${bookingData.returndate}T${bookingData.returntime || '00:00'}`);

    if (end < start) {
      return { days: 0, subtotal: 0, discount: 0, total: 0, invalidDates: true };
    }

    const diffMs = end - start;
    let days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) days = 1; // Minimum 1 day

    const subtotal = days * currentCar.pricePerDay;
    const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount;

    return { days, subtotal, discount, total, invalidDates: false };
  }, [bookingData.pickupdate, bookingData.returndate, bookingData.pickuptime, bookingData.returntime, currentCar, discountApplied]);

  // Validate dates before submission
  const validateForm = () => {
    if (!bookingData.car) {
      setDateError('Please select a car from our fleet.');
      return false;
    }

    if (!bookingData.pickupdate) {
      setDateError('Please choose a valid pickup date.');
      return false;
    }

    if (bookingData.pickupdate < today) {
      setDateError('Pickup date cannot be in the past.');
      return false;
    }

    if (!bookingData.returndate) {
      setDateError('Please choose a valid return date.');
      return false;
    }

    if (bookingData.returndate < bookingData.pickupdate) {
      setDateError('Return date cannot be earlier than pickup date.');
      return false;
    }

    if (bookingData.pickupdate === bookingData.returndate) {
      if (bookingData.pickuptime && bookingData.returntime && bookingData.returntime <= bookingData.pickuptime) {
        setDateError('For same-day rentals, return time must be later than pickup time.');
        return false;
      }
    }

    setDateError('');
    return true;
  };

  const handleApplyDiscountEmail = (e) => {
    e.preventDefault();
    if (!discountEmailInput.trim()) {
      setDiscountEmailError('Please enter your email to unlock 10% OFF.');
      return;
    }

    const res = applyDiscount(discountEmailInput.trim());
    if (res.success) {
      setDiscountEmailError('');
      setDiscountEmailInput('');
    } else {
      setDiscountEmailError(res.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bookingRecord = {
      customerName: bookingData.name.trim(),
      customerEmail: bookingData.email.trim(),
      customerPhone: bookingData.phone.trim(),
      carName: currentCar.name,
      carId: currentCar.id,
      carImage: currentCar.image,
      dailyRate: currentCar.pricePerDay,
      pickupDate: bookingData.pickupdate,
      pickupTime: bookingData.pickuptime,
      returnDate: bookingData.returndate,
      returnTime: bookingData.returntime,
      rentalDays: rentalCalculations.days,
      subtotal: rentalCalculations.subtotal,
      discountApplied: discountApplied,
      discountAmount: rentalCalculations.discount,
      totalPrice: rentalCalculations.total,
      status: 'Confirmed',
    };

    const saved = saveBooking(bookingRecord);
    setConfirmedBooking(saved);

    // Reset form
    setBookingData({
      name: '',
      email: '',
      phone: '',
      car: '',
      pickupdate: '',
      returndate: '',
      pickuptime: '10:00',
      returntime: '10:00',
    });
  };

  return (
    <section className="min-h-screen bg-gray-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-red-500 font-semibold tracking-wider uppercase text-sm">
            BOOK YOUR CAR
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 tracking-tight">
            RENT <span className="text-red-500">NOW</span>
          </h1>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Select your car, pick your dates, and enjoy instant online booking with no hidden fees.
          </p>

          {/* Toggle View Saved Bookings */}
          {bookings.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowBookingsList(!showBookingsList)}
                className="text-xs sm:text-sm font-medium text-red-400 hover:text-red-300 underline underline-offset-4 cursor-pointer"
              >
                {showBookingsList
                  ? '← Hide My Saved Bookings'
                  : `View My Saved Bookings (${bookings.length})`}
              </button>
            </div>
          )}
        </div>

        {/* Saved Bookings Drawer/Section */}
        {showBookingsList && bookings.length > 0 && (
          <div className="mb-12 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> My Saved Bookings
              </h3>
              <span className="text-xs text-gray-400">
                Stored securely in your browser
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-red-600/20 text-red-400 px-2 py-0.5 rounded font-bold">
                        {b.id}
                      </span>
                      <h4 className="font-bold text-base text-white mt-1">
                        {b.carName}
                      </h4>
                      <p className="text-xs text-gray-400">
                        Rented by: {b.customerName} ({b.customerPhone})
                      </p>
                    </div>

                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="text-gray-400 hover:text-red-400 p-1.5 rounded transition cursor-pointer"
                      title="Cancel Booking"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-700/60 text-xs text-gray-300 space-y-1">
                    <p>
                      📅 {b.pickupDate} ({b.pickupTime}) → {b.returnDate} ({b.returnTime})
                    </p>
                    <div className="flex items-center justify-between font-semibold pt-1">
                      <span>Duration: {b.rentalDays} day(s)</span>
                      <span className="text-red-400 text-sm font-bold">
                        Total: ${b.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Confirmation Receipt Modal */}
        {confirmedBooking && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                <FaCheckCircle />
              </div>

              <h2 className="text-2xl font-extrabold text-center">
                Booking Confirmed!
              </h2>
              <p className="text-center text-xs text-gray-400 mt-1">
                Booking Reference:{' '}
                <span className="font-mono text-red-400 font-bold">
                  {confirmedBooking.id}
                </span>
              </p>

              <div className="mt-6 bg-gray-800/70 border border-gray-700 rounded-xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Vehicle:</span>
                  <span className="font-bold text-white">{confirmedBooking.carName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Customer:</span>
                  <span className="text-white">{confirmedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Contact:</span>
                  <span className="text-white">{confirmedBooking.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pickup:</span>
                  <span className="text-white">
                    {confirmedBooking.pickupDate} at {confirmedBooking.pickupTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Return:</span>
                  <span className="text-white">
                    {confirmedBooking.returnDate} at {confirmedBooking.returnTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rental Duration:</span>
                  <span className="text-white">{confirmedBooking.rentalDays} Day(s)</span>
                </div>
                {confirmedBooking.discountApplied && (
                  <div className="flex justify-between text-green-400">
                    <span>10% Discount Applied:</span>
                    <span>-${confirmedBooking.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-700 pt-2 text-base font-extrabold">
                  <span className="text-white">Total Amount Paid:</span>
                  <span className="text-red-500">${confirmedBooking.totalPrice}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setShowBookingsList(true);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition cursor-pointer text-center"
                >
                  View in My Bookings
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmedBooking(null)}
                  className="flex-1 border border-gray-700 hover:bg-gray-800 py-3 rounded-lg font-semibold transition cursor-pointer text-center"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main 2-Column Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form (7 Cols) */}
          <div className="lg:col-span-7 bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-white pb-3 border-b border-gray-800 flex items-center gap-2">
              <FaCar className="text-red-500" /> Rental Details
            </h2>

            {dateError && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 text-sm">
                ⚠️ {dateError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={bookingData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={bookingData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +92 300 1234567"
                  value={bookingData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                  required
                />
              </div>

              {/* Car Selection */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  Select Your Vehicle *
                </label>
                <select
                  name="car"
                  value={bookingData.car}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm cursor-pointer"
                  required
                >
                  <option value="">-- Choose a Car from Our Fleet --</option>
                  {CARS_DATA.map((car) => (
                    <option key={car.id} value={car.name}>
                      {car.name} (${car.pricePerDay}/day - {car.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup & Return Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-800">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    <FaCalendarAlt className="text-red-500" /> Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupdate"
                    min={today}
                    value={bookingData.pickupdate}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    <FaCalendarAlt className="text-red-500" /> Return Date *
                  </label>
                  <input
                    type="date"
                    name="returndate"
                    min={bookingData.pickupdate || today}
                    value={bookingData.returndate}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    <FaClock className="text-red-500" /> Pickup Time *
                  </label>
                  <input
                    type="time"
                    name="pickuptime"
                    value={bookingData.pickuptime}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    <FaClock className="text-red-500" /> Return Time *
                  </label>
                  <input
                    type="time"
                    name="returntime"
                    value={bookingData.returntime}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg mt-8 transition shadow-lg shadow-red-600/30 cursor-pointer text-base uppercase tracking-wider"
              >
                Confirm & Rent Now
              </button>
            </form>
          </div>

          {/* Pricing & Summary Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Price Breakdown */}
            <div className="bg-gray-900 border border-gray-800 p-6 sm:p-7 rounded-2xl shadow-xl sticky top-24">
              <h3 className="text-lg font-bold text-white pb-3 border-b border-gray-800 flex items-center justify-between">
                <span>Rental Summary</span>
                {discountApplied && (
                  <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                    10% OFF
                  </span>
                )}
              </h3>

              {currentCar ? (
                <div>
                  {/* Selected car preview */}
                  <div className="mt-4 p-3 bg-gray-800/60 rounded-xl flex items-center gap-4 border border-gray-700/60">
                    <img
                      src={currentCar.image}
                      alt={currentCar.name}
                      className="w-20 h-14 object-contain"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {currentCar.name}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {currentCar.type} • {currentCar.transmission} • {currentCar.fuel}
                      </p>
                      <p className="text-xs text-red-400 font-semibold mt-0.5">
                        ${currentCar.pricePerDay} / day
                      </p>
                    </div>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="mt-5 space-y-3 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Rate:</span>
                      <span className="font-medium text-white">${currentCar.pricePerDay}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Rental Duration:</span>
                      <span className="font-medium text-white">
                        {rentalCalculations.days} Day{rentalCalculations.days > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="font-medium text-white">${rentalCalculations.subtotal}</span>
                    </div>

                    {discountApplied ? (
                      <div className="flex justify-between text-green-400 font-medium">
                        <span className="flex items-center gap-1">
                          <FaTag size={12} /> 10% Promo Discount ({userEmail || discountCode}):
                        </span>
                        <span>-${rentalCalculations.discount}</span>
                      </div>
                    ) : (
                      <div className="pt-2 bg-gray-800/40 border border-gray-700/60 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                            <FaTag size={10} /> Want 10% OFF?
                          </span>
                          <button
                            type="button"
                            onClick={openDiscountPopup}
                            className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
                          >
                            Open Popup
                          </button>
                        </div>

                        <form onSubmit={handleApplyDiscountEmail} className="flex gap-2" noValidate>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={discountEmailInput}
                            onChange={(e) => {
                              setDiscountEmailInput(e.target.value);
                              if (discountEmailError) setDiscountEmailError('');
                            }}
                            className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-xs outline-none focus:border-red-500"
                          />
                          <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition shrink-0 cursor-pointer shadow-md shadow-red-600/30"
                          >
                            Claim
                          </button>
                        </form>

                        {discountEmailError && (
                          <p className="text-[11px] text-red-400 mt-1">{discountEmailError}</p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                          Enter email to unlock instant 10% discount on this booking.
                        </p>
                      </div>
                    )}

                    {/* Total Price */}
                    <div className="pt-4 border-t border-gray-800 flex justify-between items-baseline">
                      <div>
                        <span className="text-base font-bold text-white block">
                          Total Price
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Includes all taxes & standard insurance
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-red-500">
                        ${rentalCalculations.total}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm">
                  <FaCar className="text-4xl mx-auto mb-3 text-gray-600" />
                  <p>Please select a car from the form to view real-time pricing and calculate totals.</p>
                  <Link
                    to="/cars"
                    className="inline-block mt-3 text-red-500 hover:text-red-400 text-xs font-semibold"
                  >
                    Or browse all cars →
                  </Link>
                </div>
              )}

              {/* Guarantees */}
              <div className="mt-6 pt-5 border-t border-gray-800/80 space-y-2 text-xs text-gray-400">
                <p className="flex items-center gap-2">
                  <FaShieldAlt className="text-red-500 shrink-0" /> Free cancellation up to 24 hours before pickup
                </p>
                <p className="flex items-center gap-2">
                  <FaCheckCircle className="text-red-500 shrink-0" /> Clean, inspected, fully sanitized vehicle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
