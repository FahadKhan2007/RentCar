const Services = () => {
  const services = [
    {
      id: "1",
      title: "Easy Booking",
      description: "Book your favorite car quickly and easily with our streamlined, instant booking process.",
      icon: "🚗"
    },
    {
      id: "2",
      title: "Affordable Prices",
      description: "Enjoy premium quality cars at transparent, competitive rates with absolutely no hidden charges.",
      icon: "💰"
    },
    {
      id: "3",
      title: "24/7 Support",
      description: "Our customer service and roadside assistance teams are available 24/7 whenever you need help.",
      icon: "📞"
    },
    {
      id: "4",
      title: "Well Maintained Cars",
      description: "All vehicles undergo comprehensive safety inspections and sanitization before every rental.",
      icon: "🔧"
    },
  ];

  return (
    <section className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-red-500 font-semibold uppercase tracking-wider text-sm">
            Our Services
          </p>

          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            WHAT WE <span className="text-red-500">OFFER</span>
          </h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            We provide reliable, flexible, and convenient car rental services tailored to your itinerary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-900 border border-gray-800 p-6 rounded-xl text-center hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
            >
              <div className="text-5xl mb-5 p-3 bg-gray-800/50 rounded-2xl">
                {service.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {service.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
