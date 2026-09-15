import React from 'react'

const Services = () => {
  const services=[
    {
      id:"1",
      title: "Easy Booking",
      description: "Book your favorite car quickly and easily with our simple booking process.",
      icon: "🚗"
    },

    {
      id:"2",
      title: "Affordable Prices",
      description: "Enjoy quality cars at affordable prices with no hidden charges.",
      icon: "💰"
    },

    {
      id:"3",
      title: "24/7 Support",
      description: "Our support team is available 24/7 to help you whenever you need.",
      icon: "📞"
    },

    {
      id:"4",
      title: "Well Maintained Cars",
      description: "All our cars are regularly checked and maintained for a safe journey.",
      icon: "🔧"
    },
  ]
  return (
    <section className='bg-black text-white py-20 px-10'>
      <div className='text-center mb-12'>
        <p className='text-red-500 font-semibold'>OUR SERVICES</p>

        <h2 className='text-4xl font-bold mt-2'>
          WHAT WE 
          <span className='text-red-500'>OFFER</span>
        </h2>
        <p className='text-gray-400 mt-4'> We provide reliable and convenient car rental services.</p>
      </div>

      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {services.map((service)=>(
           <div 
           key={service.id}
           className='bg-gray-900 p-6 rounded-xl text-center hover:bg-gray-800 transition'
           >
           <div className='text-5xl mb-5'>
               {service.icon}
           </div>

           <h3 className='text-xl font-bold'>
            {service.title}
           </h3>

           <p className='text-gray-400 mt-3 leading-6'>
            {service.description}
           </p>

           </div>
        ))}
      </div>
    </section>
  )
}

export default Services
