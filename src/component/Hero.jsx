import React from 'react'
import { Link } from "react-router-dom";
import Cars from '../assets/cars.png';

const Hero = () => {
  return (
    <section className='min-h-[90vh] bg-black text-white flex items-center px-10'>
      <div className='max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
       <div>
        <p className='text-red-500 font-semibold mb-4'>Premium Car Rental</p>
        <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
          Rent Your 
           <span className='text-red-500'> Dream Car</span>
        </h1>
        <p className='text-gray-600 mt-5 text-lg'>
           Find the perfect car for your journey.
            Affordable prices, comfortable rides and easy booking.
        </p>

        <div className='mt-8 flex gap-4'>
          
          <Link to="/cars" className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700">Browse Cars</Link>
          <Link to="/booking"
          className='border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black'>Rent Now</Link>
        </div>
       </div>

       <div>
        <img src={Cars} alt="image not found"  className='w-full rounded-xl '/>
       </div>
      </div>
    </section>
  )
}

export default Hero
