import React from "react";
import Navbar from "./sections/navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import LatestWork from "./sections/LatestWork";
import LatestWorkPricing from "./components/LatestWorkPricing";
import TidyCall from "./components/TidyCall";
import Experiences from "./sections/Experiences";
import Testimonial from "./sections/Testimonial";
import Contact from "./sections/Contact";
import Footer from './sections/Footer';

const App = () => {
  return (
    <div className="w-full max-w-full ">
      <Navbar />
      <Hero />
      <About />
      <LatestWork />
      <LatestWorkPricing />
      <TidyCall />
      {/* <Experiences />
      <Contact /> */}
      <Footer/>
    </div>
  );
};

export default App;
