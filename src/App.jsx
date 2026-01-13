import React, { useEffect, Suspense, lazy } from "react";
import Navbar from "./sections/navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import LatestWork from "./sections/LatestWork";
import LatestWorkPricing from "./components/LatestWorkPricing";
import TidyCall from "./components/TidyCall";
import Footer from './sections/Footer';

const WorkDetail = lazy(() => import("./sections/WorkDetail"));
const Works = lazy(() => import("./sections/Works"));

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
        <Suspense fallback={null}>
          <WorkDetail id={workId} />
        </Suspense>
        <Footer />
      </div>
    );
  }

  if (worksIndex) {
    return (
      <div className="w-full max-w-full ">
        <Navbar />
        <Suspense fallback={null}>
          <Works />
        </Suspense>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full ">
      <Navbar />
      <Hero />
      <main className="home-surface">
        <About />
        <LatestWork />
        <LatestWorkPricing />
        <TidyCall />
      </main>
      <Footer/>
    </div>
  );
};

export default App;
