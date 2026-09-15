import React from "react";
import Hero from "../component/Hero";
import About from "./About";
import Cars from "../component/Cars";
import Services from "./Services";
import Contact from "./Contact";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Cars />
      <Services />
      <Contact />
    </div>
  );
};

export default Home;