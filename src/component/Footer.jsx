import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-black text-white px-10 py-12'>

      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10'>


        <div>
          <h2 className='text-2xl font-bold'>
            CAR
            <span className='text-red-500'> RENT</span>
          </h2>

          <p className='text-gray-400 mt-4 leading-7'>
            Rent your dream car at affordable prices.
            Comfortable, reliable and easy car rental
            services for every journey.
          </p>
        </div>



        <div>
          <h3 className='text-xl font-semibold mb-5'>
            QUICK LINK
          </h3>

          <ul className='space-y-3'>

            <li>
              <Link to="/" className='hover:text-red-500'>
                Home
              </Link>
            </li>

            <li>
              <Link to="/cars" className='hover:text-red-500'>
                Cars
              </Link>
            </li>

            <li>
              <Link to="/about" className='hover:text-red-500'>
                About
              </Link>
            </li>

            <li>
              <Link to="/services" className='hover:text-red-500'>
                Services
              </Link>
            </li>

            <li>
              <Link to="/contact" className='hover:text-red-500'>
                Contact
              </Link>
            </li>

          </ul>
        </div>


        
        <div>

          <h3 className='text-xl font-semibold mb-5'>
            CONTACT US
          </h3>

          <p className='text-gray-400'>
            📍 Bahawalpur, Punjab, Pakistan
          </p>

          <p className='text-gray-400 mt-3'>
            📞 +92 3094157614
          </p>

          <p className='text-gray-400 mt-3'>
            ✉️ fkniazi2007@gmail.com
          </p>


          
          <h3 className='text-xl font-semibold mt-7 mb-4'>
            FOLLOW US
          </h3>

          <div className='flex gap-3'>

        
            <a
              href='#'
              className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition'
            >
              <FaFacebookF />
            </a>

            
            <a
              href='https://www.instagram.com/fahadkhanniazi_812/'
              className='w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center hover:scale-110 transition'
            >
              <FaInstagram />
            </a>

            
            <a
              href='https://www.youtube.com/@F.kgaming-pb4ce'
              className='w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition'
            >
              <FaYoutube />
            </a>

          </div>

        </div>

      </div>


    
      <div className='border-t border-gray-800 mt-10 pt-6 text-center'>

        <p className='text-gray-500'>
          © 2026 CARRENT. All Rights Reserved.
        </p>

      </div>

    </footer>
  )
}

export default Footer


