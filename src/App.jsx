import React, { useEffect, Suspense, lazy, useState } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import LatestWork from "./sections/LatestWork";
import LazyMount from "./components/LazyMount";
import Footer from "./sections/Footer";
import { initOverlayLoader } from "./loader";
import { initCursor } from "./cursor";
import { normalizePathname } from "./utils/paths";
import ErrorBoundary from "./components/ErrorBoundary";
import { initPerformanceMonitoring } from "./utils/performance";

const WorkDetail = lazy(() => import("./sections/WorkDetail"));
const Works = lazy(() => import("./sections/Works"));
const LatestWorkPricing = lazy(() => import("./components/LatestWorkPricing"));
const TidyCall = lazy(() => import("./components/TidyCall"));

const SuspenseFallback = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[160px] flex items-center justify-center text-sm text-neutral-300"
  >
    {message}
  </div>
);

const App = () => {
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") {
      return { pathname: "/", hash: "" };
    }
    return {
      pathname: window.location.pathname,
      hash: window.location.hash,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    initOverlayLoader();
    const cleanupCursor = initCursor();
    return () => {
      if (typeof cleanupCursor === "function") {
        cleanupCursor();
      }
    };
  }, []);

  useEffect(() => {
    const cleanupPerf = initPerformanceMonitoring();
    return () => {
      if (typeof cleanupPerf === "function") {
        cleanupPerf();
      }
    };
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      setLocation({
        pathname: window.location.pathname,
        hash: window.location.hash,
      });
    };

    window.addEventListener("popstate", updateLocation);
    window.addEventListener("hashchange", updateLocation);

    return () => {
      window.removeEventListener("popstate", updateLocation);
      window.removeEventListener("hashchange", updateLocation);
    };
  }, []);

  useEffect(() => {
    const handleLinkClick = (event) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target;
      if (!target || !target.closest) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (href.startsWith("#")) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      window.history.pushState({}, "", url);
      setLocation({ pathname: url.pathname, hash: url.hash });
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, []);

  const pathname = normalizePathname(location.pathname);
  const workMatch = pathname.match(/^\/works\/([^/]+)\/?$/);
  let workId = null;
  if (workMatch) {
    try {
      workId = decodeURIComponent(workMatch[1]);
    } catch (error) {
      workId = null;
      console.warn("Invalid work identifier", workMatch[1], error);
    }
  }
  const worksIndex = /^\/works\/?$/.test(pathname);

  useEffect(() => {
    if (workId || worksIndex) return;

    const scrollToHash = () => {
      const hash = location.hash;
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

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [location.hash, workId, worksIndex]);

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, location.hash]);

  const route = (() => {
    if (workId) return { type: "work-detail", id: workId };
    if (worksIndex) return { type: "works" };
    if (pathname === "/" || pathname === "") return { type: "home" };
    return { type: "not-found" };
  })();

  if (route.type === "work-detail") {
    return (
      <div className="w-full max-w-full ">
        <Navbar />
        <ErrorBoundary
          fallback={
            <SuspenseFallback message="We couldn't load that case study right now." />
          }
        >
          <Suspense fallback={<SuspenseFallback message="Loading case study…" />}>
            <WorkDetail id={route.id} />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    );
  }

  if (route.type === "works") {
    return (
      <div className="w-full max-w-full ">
        <Navbar />
        <ErrorBoundary
          fallback={
            <SuspenseFallback message="Works failed to load — please refresh." />
          }
        >
          <Suspense fallback={<SuspenseFallback message="Loading works…" />}>
            <Works />
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </div>
    );
  }

  if (route.type === "not-found") {
    return (
      <div className="w-full max-w-full ">
        <Navbar />
        <main className="home-surface c-space section-spacing">
          <h1 className="text-heading">Page not found</h1>
          <p className="font-normal text-neutral-400">
            The page you are looking for doesn&apos;t exist.
          </p>
        </main>
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
        <LazyMount minHeight="clamp(520px, 70vh, 880px)">
          <ErrorBoundary
            fallback={
              <SuspenseFallback message="Pricing failed to load — try again soon." />
            }
          >
            <Suspense fallback={<SuspenseFallback message="Loading pricing…" />}>
              <LatestWorkPricing />
            </Suspense>
          </ErrorBoundary>
        </LazyMount>
        <LazyMount minHeight="clamp(560px, 75vh, 920px)">
          <ErrorBoundary
            fallback={
              <SuspenseFallback message="The booking section is temporarily unavailable." />
            }
          >
            <Suspense fallback={<SuspenseFallback message="Loading booking panel…" />}>
              <TidyCall />
            </Suspense>
          </ErrorBoundary>
        </LazyMount>
      </main>
      <Footer />
    </div>
  );
};

export default App;
