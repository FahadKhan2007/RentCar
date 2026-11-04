import { Link } from 'react-router-dom';
import CarsImg from '../assets/cars.png';

const Hero = () => {
  return (
    <section className="min-h-[calc(100vh-73px)] bg-black text-white flex items-center px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <span className="inline-block text-red-500 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-3 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            Premium Car Rental
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Rent Your <span className="text-red-500">Dream Car</span>
          </h1>
          <p className="text-gray-300 mt-4 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
            Find the perfect car for your journey. Affordable prices, comfortable rides, transparent rates, and effortless booking.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap gap-4 items-center">
            <Link
              to="/cars"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg shadow-red-600/30 text-center"
            >
              Browse Cars
            </Link>
            <Link
              to="/booking"
              className="border border-gray-600 hover:border-white text-gray-200 hover:text-white px-6 py-3 rounded-lg hover:bg-white/10 transition text-center"
            >
              Rent Now
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <img
            src={CarsImg}
            alt="Luxury rental cars fleet"
            className="w-full max-w-md md:max-w-full max-h-[300px] sm:max-h-[360px] md:max-h-[420px] lg:max-h-[480px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
