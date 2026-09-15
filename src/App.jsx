import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Cars from "./component/Cars";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import DiscountPopUp from "./component/DiscountPopUp";

const App = () => {
   const [discountApplied, setDiscountApplied] = useState(false);
  return (
    <BrowserRouter>

      <Navbar />
      <DiscountPopUp setDiscountApplied={setDiscountApplied} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/cars" element={<Cars discountApplied={discountApplied} />} />        
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/booking" element={<Booking />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
};

export default App;
