import { Link } from "react-router-dom"



const Navbar = () => {
  return (
    <nav className='flex items-center justify-between px-10 py-5  bg-black text-white'>
      <h1 className='text-2xl font-bold'>
        CAR<span className='text-red-500'>RENT</span>
      </h1>

      <ul className="flex gap-8">
        <li>
            <Link to="/" >Home</Link>
        </li>

        <li>
            <Link to="/cars">Cars</Link>
        </li>

        <li>
            <Link to="/about">About</Link>
        </li>

        <li>
            <Link to="/services">Services</Link>
        </li>

        <li>
            <Link to="/contact">Contact</Link>
        </li> 
      </ul>

         <Link to="/booking"
         className="bg-red-600 px-5 py-2 rounded-lg">
            Rent Now
         </Link>

    </nav>
  );
};

export default Navbar
