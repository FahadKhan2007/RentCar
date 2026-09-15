import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Cars = () => {

  const [discountApplied, setDiscountApplied] = useState(false)

  useEffect(() => {

    const handleDiscount = () => {
      setDiscountApplied(true)
    }

    window.addEventListener("discountApplied", handleDiscount)

    return () => {
      window.removeEventListener("discountApplied", handleDiscount)
    }

  }, [])

  const cars = [
    {
      id: 1,
      name: "Toyota Corolla",
      price: "$40 / Day",
      image: "/corolla.png",
    },

    {
      id: 2,
      name: "Toyota Fortuner",
      price: "$80 / Day",
      image: "/Fortuner.png",
    },

    {
      id: 3,
      name: "Honda Civic",
      price: "$50 / Day",
      image: "/honda.png",
    },

    {
      id: 4,
      name: "Mercedes Benz",
      price: "$100 / Day",
      image: "/mercedes.png",
    },

    {
      id: 5,
      name: "BMW 5 Series",
      price: "$95 / Day",
      image: "/BMW_5_series.png",
    },

    {
      id: 6,
      name: "Land Cruiser",
      price: "$120 / Day",
      image: "land.png",
    },

    {
      id: 7,
      name: "Audi",
      price: "$70 / Day",
      image: "Audi.png",
    },

    {
      id: 8,
      name: "Toyota Crown",
      price: "$150 / Day",
      image: "Crown.png",
    },
  ]

  return (
    <section className='bg-gray-950 text-white py-20 px-10'>

      <div className='text-center mb-12'>

        <p className='text-red-500 font-semibold'>
          Ours Cars
        </p>

        <h2 className='text-2xl font-bold mt-2'>
          Choose Your
          <span className='text-red-500'> Car</span>
        </h2>

        <p className='text-gray-400 mt-4'>
          Choose from our wide range of comfortable and luxury cars.
        </p>

      </div>

      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>

        {cars.map((car) => (

          <div
            key={car.id}
            className='bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition'
          >

            <img
              src={car.image}
              alt={car.name}
              className='w-full h-48 object-cover'
            />

            <div className='p-5'>

              <h3 className='text-xl font-bold'>
                {car.name}
              </h3>

              {discountApplied ? (

                <div className='mt-2'>

                  <p className='text-gray-500 line-through'>
                    {car.price}
                  </p>

                  <p className='text-red-500 font-semibold'>
                    $
                    {(parseFloat(car.price.replace('$', '')) * 0.90).toFixed(0)}
                    {' / Day'}
                  </p>

                  <p className='text-green-500 text-sm'>
                    10% OFF
                  </p>

                </div>

              ) : (

                <p className='text-red-500 font-semibold mt-2'>
                  {car.price}
                </p>

              )}

              <Link
                to="/booking"
                className="block text-center bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg mt-5"
              >
                Rent Now
              </Link>

            </div>

          </div>

        ))}

      </div>

    </section>
  )
}

export default Cars