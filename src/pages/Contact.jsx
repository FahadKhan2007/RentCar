import React,{useState} from 'react'

const Contact = () => {
  const [formData,setFormData]=useState({
    name: "",
    email: "",
    phone: "",
    message:"",
  });

  const handleChange=(e)=> {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit= (e)=>{
     e.preventDefault();
     console.log(formData);
     alert("Your message has been sent!");

      setFormData({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  };
  return (
    <section className='bg-gray-950 text-white py-20 px-10'>

      <div className='text-center mb-12'>

        <p className='text-red-500 font-semibold'>
          CONTACT US
        </p>
        <h2 className='text-4xl font-bold mt-2'>
          GET IN 
           <span className='text-red-500'>TOUCH</span>
        </h2>

        <p className='text-gray-400 mt-4'>
          Have any questions? Feel free to contact us.
        </p>
      </div>

      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div className='bg-gray-900 p-8 rounded-xl'>
          <h3 className='text-2xl font-semibold mb-6'>Contact Information</h3>
          <div className='space-y-5'>
            <div>
              <h4 className='text-red-500 font-semibold'>
                Address
              </h4>

              <p className='text-gray-400 mt-1'>
                Bahawalpur, Punjab, Pakistan
              </p>
            </div>

            <div>
              <h4 className='text-red-500 font-semibold'>
                Phone
              </h4>

              <p className='text-gray-400 mt-1'>
                  +92 3094157614
              </p>
            </div>

            <div>
              <h4 className='text-red-500 font-semibold'>
                Email
              </h4>

              <p className='text-gray-400 mt-1'>
                  fkniazi2007@gmail.com
              </p>
            </div>

            <div>
              <h4 className='text-red-500 font-semibold'>
                Working Hours
              </h4>

              <p className='text-gray-400 mt-1'>
                  Monday - Sunday: 24/7
              </p>
            </div>
          </div>
        </div>

        <form 
        onSubmit={handleSubmit}
        className='bg-gray-900 p-8 rounded-xl'
        >
 
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input type='text'
              name='name'
              placeholder='Enter Your Name'
              value={formData.name}
              onChange={handleChange}
              className='bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500'
              required
              />

              <input type='email'
              name='email'
              placeholder='Enter Your Email'
              value={formData.email}
              onChange={handleChange}
              className='bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500'
              required
              />

              </div>
              

              <input type='tel'
              name='phone'
              placeholder='Enter Your Phone'
              value={formData.phone}
              onChange={handleChange}
              className='w-full bg-gray-800 p-3 rounded-lg mt-5 outline-none focus:ring-2 focus:ring-red-500'
              required
              />

              <textarea
              name='message'
              placeholder='Enter Your Message'
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className='w-full bg-gray-800 p-3 rounded-lg mt-5 outline-none focus:ring-2 focus:ring-red-500'
              required
              >

              </textarea>

             <button 
             type='submit'
             className='bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg mt-5 w-full font-semibold'
             >
              Send Message
             </button>
             
        </form>
      </div>
    </section>
  );
};

export default Contact
