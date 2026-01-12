import React, { useEffect } from "react";
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
import WorkDetail from "./sections/WorkDetail";
import Works from "./sections/Works";

const App = () => {
  const pathname = window.location.pathname;
  const workMatch = pathname.match(/^\/works\/([^/]+)\/?$/);
  const workId = workMatch ? decodeURIComponent(workMatch[1]) : null;
  const worksIndex = /^\/works\/?$/.test(pathname);

  useEffect(() => {
    if (workId || worksIndex) return;

    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      const prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    };

    const rafId = window.requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [workId, worksIndex]);

  if (workId) {
    return (
      <div className="w-full max-w-full ">
        <Navbar />
        <WorkDetail id={workId} />
        <Footer />
      </div>
    );
  }

  if (worksIndex) {
    return (
      <div className="w-full max-w-full ">
        <Navbar />
        <Works />
        <Footer />
      </div>
    );
  }

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
