import aboutImg from '../assets/About.png';

const About = () => {
  return (
    <section className="bg-gray-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="flex justify-center">
          <img
            src={aboutImg}
            alt="About CARRENT luxury fleet"
            className="w-full max-w-lg md:max-w-full h-auto max-h-[420px] object-cover rounded-2xl shadow-2xl border border-gray-800/80"
            loading="lazy"
          />
        </div>

        <div>
          <span className="inline-block text-red-500 font-semibold uppercase text-sm tracking-wider mb-2">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            YOUR JOURNEY, <span className="text-red-500">OUR CARS</span>
          </h1>
          <p className="text-gray-300 mt-5 leading-relaxed text-sm sm:text-base">
            We provide reliable, pristine, and affordable car rental services for every journey. Whether you need a vehicle for a quick business commute, a weekend road trip, or an extended family vacation, we have the ideal car ready for you.
          </p>
          <p className="text-gray-400 mt-4 leading-relaxed text-sm sm:text-base">
            Our mission is simple: eliminate hidden fees, offer instant easy bookings, and guarantee safe, comfortable travels wherever your road leads.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-800">
            <div>
              <h3 className="text-3xl font-extrabold text-red-500">50+</h3>
              <p className="text-gray-400 text-sm mt-1">Cars Available</p>
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-red-500">1000+</h3>
              <p className="text-gray-400 text-sm mt-1">Happy Customers</p>
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-red-500">24/7</h3>
              <p className="text-gray-400 text-sm mt-1">Road Assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
