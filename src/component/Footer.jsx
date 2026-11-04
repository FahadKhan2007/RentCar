import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-900 text-white px-4 sm:px-6 lg:px-10 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-extrabold tracking-wider">
            CAR<span className="text-red-500"> RENT</span>
          </h2>

          <p className="text-gray-400 mt-4 leading-relaxed text-sm">
            Rent your dream car at affordable prices. Comfortable, reliable, and easy car rental services for every journey across the country.
          </p>

          <p className="text-xs text-gray-500 mt-4">
            Licensed & Insured Fleet Operator.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-5 uppercase tracking-wider">
            QUICK LINKS
          </h3>

          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-red-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cars" className="text-gray-400 hover:text-red-500 transition">
                Cars Fleet
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-400 hover:text-red-500 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-gray-400 hover:text-red-500 transition">
                Our Services
              </Link>
            </li>
            <li>
              <Link to="/booking" className="text-gray-400 hover:text-red-500 transition">
                Book a Car
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-red-500 transition">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-5 uppercase tracking-wider">
            CONTACT US
          </h3>

          <div className="space-y-2.5 text-sm text-gray-400">
            <p className="flex items-start gap-2">
              <span className="text-red-500 font-bold">📍</span>
              <span>Bahawalpur, Punjab, Pakistan</span>
            </p>

            <p className="flex items-center gap-2">
              <span className="text-red-500 font-bold">📞</span>
              <a href="tel:+923094157614" className="hover:text-red-400 transition">
                +92 3094157614
              </a>
            </p>

            <p className="flex items-center gap-2">
              <span className="text-red-500 font-bold">✉️</span>
              <a href="mailto:fkniazi2007@gmail.com" className="hover:text-red-400 transition">
                fkniazi2007@gmail.com
              </a>
            </p>
          </div>

          <h3 className="text-base font-semibold mt-6 mb-3 uppercase tracking-wider text-gray-200">
            FOLLOW US
          </h3>

          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 hover:bg-blue-500 transition text-sm"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center hover:scale-110 hover:bg-sky-400 transition text-sm"
            >
              <FaTwitter />
            </a>

            <a
              href="https://www.instagram.com/fahadkhanniazi_812/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center hover:scale-110 hover:bg-pink-500 transition text-sm"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.youtube.com/@F.kgaming-pb4ce"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 hover:bg-red-500 transition text-sm"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900 mt-10 pt-6 text-center text-xs text-gray-500">
        <p>© 2026 CARRENT. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
