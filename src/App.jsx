import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from './component/Navbar';
import Footer from './component/Footer';
import DiscountPopUp from './component/DiscountPopUp';
import FloatingDiscountBtn from './component/FloatingDiscountBtn';

import Home from './pages/Home';
import About from './pages/About';
import Cars from './component/Cars';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import { RentalProvider } from './context/RentalContext';

// Helper component to smoothly scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <RentalProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
          <Navbar />
          <DiscountPopUp />
          <FloatingDiscountBtn />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              {/* Catch-all route for any undefined paths */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </RentalProvider>
    </BrowserRouter>
  );
};

export default App;
