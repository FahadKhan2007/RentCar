import React, { useEffect, useRef, useState } from 'react'

const Booking = () => {
 const alertShown = useRef(false);

  const [bookingData, setBookingData]=useState({
    name: "",
    email:"",
    phone: "",
    car: "",
    pickupdate: "",
    returndate: "",
    pickuptime: "",
    returntime: "",
  });

  

  const handleChange = (e) => {
  setBookingData({
    ...bookingData,
    [e.target.name]: e.target.value,
  });

  if (e.target.name === "returndate" || e.target.name === "returntime") {
    alertShown.current = false;
  }
};


   const handleSubmit = (e) => {
     e.preventDefault();

     console.log(bookingData);
     alert("Booking submitted successfully!");

  //    setBookingData({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   car: "",
  //   pickupdate: "",
  //   returndate: "",
  //   pickuptime: "",
  //   returntime: "",
  // });
   }

   useEffect(() => {
  if (!bookingData.returndate || !bookingData.returntime) {
    return;
  }

  const checkReturnTime = () => {
    const returnDateTime = new Date(
      `${bookingData.returndate}T${bookingData.returntime}`
    );

    const currentTime = new Date();

    if (currentTime >= returnDateTime && !alertShown.current) {
      alert("Your car return time is over! Please return the car.");

      alertShown.current = true;
    }
  };

  const timer = setInterval(checkReturnTime, 1000);

  return () => clearInterval(timer);
}, [bookingData.returndate, bookingData.returntime]);


  return (
    <section className='min-h-screen bg-gray-950 text-white py-20 px-10'>
      <div className='text-center mb-12'>
        <p className='text-red-500 font-semibold'>BOOK YOUR CAR</p>
        <h2 className='text-4xl font-bold mt-2'>
          RENT
          <span className='text-red-500'> NOW</span>
        </h2>
        <p className='text-gray-400 mt-4'>
          Fill out the form and book your favorite car.
        </p>
      </div>

      <form 
      onSubmit={handleSubmit}
      className='max-w-3xl mx-auto bg-gray-900 p-8 rounded-xl'
      >

         <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

        <input 
        type='text'
        name='name'
        placeholder='ENTER YOUR NAME'
        value={bookingData.name}
        onChange={handleChange}
        className='bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500'
        required
        />

        <input 
        type='email'
        name='email'
        placeholder='ENTER YOUR EMAIL'
        value={bookingData.email}
        onChange={handleChange}
        className='bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500'
        required
        />
        </div>
         
         <input 
        type='tel'
        name='phone'
        placeholder='ENTER YOUR PHONE'
        value={bookingData.phone}
        onChange={handleChange}
        className='w-full bg-gray-800 p-3 rounded-lg mt-5 outline-none focus:ring-2 focus:ring-red-500'
        required
        />

        <select 
        name="car"
        value={bookingData.car}
        onChange={handleChange}
        className='w-full bg-gray-800 p-3 rounded-lg mt-5 outline-none focus:ring-2 focus:ring-red-500'
        required
        >
          <option value="">Select your car</option>
          <option value="Toyota Corolla">Toyota Corolla</option>
          <option value="Toyota Fortuner">Toyota Fortuner</option>
          <option value="Honda Civic">Honda Civic</option>
          <option value="Mercedes Benz">Mercedes Benz</option>
          <option value="BMW 5 Series">BMW 5 Series</option>
          <option value="Land Cruiser">Land Cruiser</option>
          <option value="Audi">Audi</option>
          <option value="Toyota Crown">Toyota Crown</option>
        </select>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
           <div>
            <label className='text-gray-400 text-sm'>
                   Pickup Date
            </label>

            <input 
                type='date'
                name='pickupdate'
                value={bookingData.pickupdate}
                onChange={handleChange}
                className='w-full bg-gray-800 p-3 rounded-lg mt-2 outline-none'
                required
                />
            </div>

             <div>
            <label className='text-gray-400 text-sm'>
                   Return Date
            </label>

            <input 
                type='date'
                name='returndate'
                value={bookingData.returndate}
                onChange={handleChange}
                className='w-full bg-gray-800 p-3 rounded-lg mt-2 outline-none'
                required
                />
            </div>

            <div>
            <label className='text-gray-400 text-sm'>
                   Pickup Time
            </label>

            <input 
                type='time'
                name='pickuptime'
                value={bookingData.pickuptime}
                onChange={handleChange}
                className='w-full bg-gray-800 p-3 rounded-lg mt-2 outline-none'
                required
                />
            </div>

            <div>
            <label className='text-gray-400 text-sm'>
                   Return Time
            </label>

            <input 
                type='time'
                name='returntime'
                value={bookingData.returntime}
                onChange={handleChange}
                className='w-full bg-gray-800 p-3 rounded-lg mt-2 outline-none'
                required
                />
            </div>
        </div>

        <button 
        type='submit'
        className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg mt-8 font-semibold'
        >
           Rent Now
        </button>

      </form>
    </section>
  )
}

export default Booking
