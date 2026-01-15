import { useEffect, Suspense, lazy } from "react";
import Hero from "./sections/Hero";
import About from "./sections/About";
import LatestWork from "./sections/LatestWork";
import LazyMount from "./components/LazyMount";
import { initOverlayLoader } from "./loader";
import { initCursor } from "./cursor";
import { initPerformanceMonitoring } from "./utils/performance";
import { useRouteLocation } from "./hooks/useRouteLocation";
import { useScrollBehavior } from "./hooks/useScrollBehavior";
import { PageLayout, ErrorPageLayout } from "./components/PageLayout";

const WorkDetail = lazy(() => import("./sections/WorkDetail"));
const Works = lazy(() => import("./sections/Works"));
const LatestWorkPricing = lazy(() => import("./components/LatestWorkPricing"));
const TidyCall = lazy(() => import("./components/TidyCall"));

const HomePageContent = () => (
  <main className="home-surface">
    <About />
    <LatestWork />
    <LazyMount minHeight="clamp(520px, 70vh, 880px)">
      <LatestWorkPricing />
    </LazyMount>
    <LazyMount minHeight="clamp(560px, 75vh, 920px)">
      <TidyCall />
    </LazyMount>
  </main>
);

/**
 * Main application component with client-side routing.
 * Initializes animations, scroll behavior, and cursor effects.
 */
const App = () => {
  const { location, route } = useRouteLocation();
  const shouldSkipScroll = route.type === "work-detail" || route.type === "works";
  
  useScrollBehavior(location, shouldSkipScroll);

  // Initialize animations and effects once
  useEffect(() => {
    if (typeof window === "undefined") return;

    initOverlayLoader();
    const cleanupCursor = initCursor();
    const cleanupPerf = initPerformanceMonitoring();

    return () => {
      cleanupCursor?.();
      cleanupPerf?.();
    };
  }, []);

  // Route rendering
  switch (route.type) {
    case "work-detail":
      return (
        <PageLayout
          loadingMessage="Loading case study…"
          fallbackMessage="We couldn't load that case study right now."
        >
          <WorkDetail id={route.id} />
        </PageLayout>
      );

    case "works":
      return (
        <PageLayout
          loadingMessage="Loading works…"
          fallbackMessage="Works failed to load — please refresh."
        >
          <Works />
        </PageLayout>
      );

    case "not-found":
      return (
        <ErrorPageLayout
          title="Page not found"
          message="The page you are looking for doesn't exist."
        />
      );

    case "home":
    default:
      return (
        <PageLayout loadingMessage="Loading…" fallbackMessage="Failed to load.">
          <Hero />
          <HomePageContent />
        </PageLayout>
      );
  }
};

export default App;
