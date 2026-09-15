import React,{useEffect, useState } from 'react'

const DiscountPopUp = ({ setDiscountApplied }) => {

    const [showPopUp , setShowPopUp]=useState(false)
    const [email ,setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    useEffect(()=> {
           setShowPopUp(true);
    },[]);

   const handleSubmit = (e) => {
   e.preventDefault()

   if (!email) return

   localStorage.setItem("discount", "true")

  window.dispatchEvent(new Event("discountApplied"))
   setSubmitted(true)
  }
    const closePopup = () => {

        setShowPopUp(false);
    }

    if(!showPopUp) return null;

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4'>
      <div className='bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl'>

       <button 
       onClick={closePopup}
       className='absolute top-3 right-4 text-xl text-gray-500 hover:text-black'>
        ×
       </button>

       {!submitted ? (
          <>
             <h2 className='text-3xl font-bold text-center'>
                Get 10% oFF
             </h2>

            <p className='text-gray-600 text-center mt-3'> 
                Enter your email and get <b>10% OFF</b> on every car booking.
            </p>

            <form onSubmit={handleSubmit}  className='mt-6'>
                
            <input 
                type='email'
                placeholder='Enter Your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black '
            />

            <button 
               type='submit'
               className='w-full bg-black text-white py-3 rounded-lg mt-4 hover:bg-gray-800'>
                Get 10% oFF
            </button>
            </form>
          </>
       ):(
           <div className='text-center'>
              <h2 className='text-3xl font-bold'>
                  🎉 Congratulation 
              </h2>

            <p className='text-gray-600 mt-3'>
                 You got 10% OFF on every car booking.
            </p>

            <div className='bg-gray-100 rounded-lg p-4 mt-5'>
                <p className='text-sm text-gray-400'>
                    Your Discount Code
                </p>

                <h3 className='text-2xl font-bold mt-1'>
                    Niazi804
                </h3>

                <button
                onClick={()=> setShowPopUp(false)}
                className='bg-black text-white py-3 px-6 rounded-lg mt-5'
                >
                    Start Booking
                </button>
            </div>
           </div>
       )}
      </div>
    </div>
  );
};

export default DiscountPopUp
