import React from 'react'
import about from '../assets/About.png'

const About = () => {
  return (
    <section className='bg-gray-950 text-white py-22 px-10'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
          <div>
            <img src={about} alt="Car Rental" className="w-full h-90 object-cover rounded-xl"/>
          </div>

          <div>
            <p className='text-red-500 font-semibold'>
              About Us
            </p>
            <h1 className='text-4xl font-bold mt-2'>
               YOUR JOURNEY, OUR CARS
            </h1>
            <p className='text-gray-400 mt-5 leading-7'>
               We provide reliable and affordable car rental services
            for every journey. Whether you need a car for a short trip
            or a long journey, we have the perfect vehicle for you.
            </p>
            <p className='text-gray-400 mt-4 leading-7'>
              Our goal is to make car rental simple, comfortable and
            convenient for everyone.
            </p>

            <div className='grid grid-cols-2 gap-5 mt-8'>

              <div>
                <h3 className='text-2xl font-bold text-red-500'>
                  50+
                </h3>
                <p className='text-gray-400'>
                  Cars Available
                </p>
              </div>

              <div>
                <h3 className='text-2xl font-bold text-red-500'>
                  1000+
                </h3>
                <p className='text-gray-400'>
                        Happy Customers
                </p>
              </div>
            </div>
          </div>
      </div>
    </section>
  )
}

export default About
