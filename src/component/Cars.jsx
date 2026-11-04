import { Link } from 'react-router-dom';
import { useRental } from '../context/useRental';
import { CARS_DATA } from '../data/carsData';
import { FaGasPump, FaUserFriends, FaCogs } from 'react-icons/fa';

const Cars = () => {
  const { discountApplied, setSelectedCar } = useRental();

  return (
    <section className="bg-gray-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-red-500 font-semibold tracking-wider uppercase text-sm">
            Our Cars
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            Choose Your <span className="text-red-500">Car</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Choose from our wide range of comfortable, reliable, and luxury vehicles at competitive daily rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARS_DATA.map((car) => {
            const discountedPrice = Math.round(car.pricePerDay * 0.9);

            return (
              <div
                key={car.id}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/50 hover:shadow-xl hover:shadow-red-600/10 transition-all duration-300 flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative bg-gray-900/50 p-4 h-48 flex items-center justify-center overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                    loading="lazy"
                  />
                  {discountApplied && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                      10% OFF
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 bg-gray-800/80 text-gray-300 text-[11px] px-2 py-0.5 rounded">
                    {car.type}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                      {car.name}
                    </h3>

                    {/* Features row */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2.5 pt-2 border-t border-gray-800">
                      <span className="flex items-center gap-1" title="Seats">
                        <FaUserFriends className="text-red-500" /> {car.seats}
                      </span>
                      <span className="flex items-center gap-1" title="Transmission">
                        <FaCogs className="text-red-500" /> {car.transmission}
                      </span>
                      <span className="flex items-center gap-1" title="Fuel">
                        <FaGasPump className="text-red-500" /> {car.fuel}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-4">
                      {discountApplied ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-red-500">
                              ${discountedPrice}
                            </span>
                            <span className="text-xs text-gray-400">/ Day</span>
                            <span className="text-sm text-gray-500 line-through">
                              ${car.pricePerDay}
                            </span>
                          </div>
                          <p className="text-xs text-green-400 font-medium mt-0.5">
                            Special 10% promo applied
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-red-500">
                            ${car.pricePerDay}
                          </span>
                          <span className="text-xs text-gray-400">/ Day</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rent Now Action Button */}
                  <Link
                    to={`/booking?car=${encodeURIComponent(car.name)}`}
                    onClick={() => setSelectedCar(car)}
                    className="mt-5 block w-full text-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-md shadow-red-600/20"
                  >
                    Rent Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Cars;
