import { Suspense, lazy, useRef } from "react";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/ParallaxBackground";
import ErrorBoundary from "../components/ErrorBoundary";
import { useWebGLCapability } from "../hooks/useWebGLCapability";
import { useIntersectionLoad } from "../hooks/useIntersectionLoad";

const HeroScene = lazy(() => import("../components/HeroScene"));

const HeroSceneFallback = () => (
  <div
    className="hero-scene__fallback absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"
    aria-hidden="true"
  />
);

/**
 * Hero section with lazy-loaded 3D scene.
 * Renders based on device capabilities and viewport visibility.
 * Uses IntersectionObserver and requestIdleCallback for optimal loading timing.
 */
const Hero = () => {
  const sectionRef = useRef(null);
  const canRenderWebGL = useWebGLCapability();
  const shouldLoadScene = useIntersectionLoad(sectionRef, {
    rootMargin: "150px",
    timeout: 1000,
  });

  const showScene = canRenderWebGL && shouldLoadScene;

  return (
    <section
      id="home"
      className="relative flex w-full items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space"
      ref={sectionRef}
    >
      <HeroText />
      <ParallaxBackground />
      <figure className="absolute inset-0 h-full w-full">
        {showScene ? (
          <ErrorBoundary fallback={<HeroSceneFallback />}>
            <Suspense fallback={<HeroSceneFallback />}>
              <HeroScene />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <HeroSceneFallback />
        )}
      </figure>
    </section>
  );
};

export default Hero;
