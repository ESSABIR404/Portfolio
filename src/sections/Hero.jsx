import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/ParallaxBackground";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

const HeroScene = lazy(() => import("../components/HeroScene"));

const HeroSceneFallback = () => (
  <div
    className="hero-scene__fallback absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"
    aria-hidden="true"
  />
);

const isWebGLSupported = () => {
  if (typeof document === "undefined") return true;
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl2") ||
    canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl");
  return Boolean(gl);
};

const Hero = () => {
  const sectionRef = useRef(null);
  const [renderScene, setRenderScene] = useState(false);
  const [allowScene, setAllowScene] = useState(false);

  useEffect(() => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      typeof navigator !== "undefined" &&
      navigator.connection &&
      navigator.connection.saveData;
    const lowMemory =
      typeof navigator !== "undefined" &&
      typeof navigator.deviceMemory === "number" &&
      navigator.deviceMemory <= 4;
    const isMobile =
      window.matchMedia && window.matchMedia("(max-width: 853px)").matches;
    const hardwareConcurrency =
      typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined;
    const connectionType =
      typeof navigator !== "undefined" && navigator.connection?.effectiveType
        ? navigator.connection.effectiveType.toLowerCase()
        : "";
    const slowConnectionTypes = ["slow-2g", "2g", "3g"];
    const isSlowConnection =
      connectionType && slowConnectionTypes.includes(connectionType);
    const isLowConcurrency =
      typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4;

    const shouldAvoidScene = isSlowConnection || isLowConcurrency;
    setAllowScene(
      !(prefersReduced || saveData || lowMemory || isMobile || shouldAvoidScene) &&
        isWebGLSupported()
    );
  }, []);

  useEffect(() => {
    if (!allowScene || renderScene) return;
    const target = sectionRef.current;
    if (!target) return;

    let idleId;
    const loadScene = () => {
      setRenderScene(true);
    };
    const scheduleIdle = () => {
      if (typeof window === "undefined") {
        loadScene();
        return;
      }
      const callback =
        window.requestIdleCallback ||
        ((cb) => window.setTimeout(cb, 0));
      idleId = callback(() => loadScene(), { timeout: 1000 });
    };

    const cleanupIdle = () => {
      if (typeof window === "undefined" || idleId == null) {
        idleId = null;
        return;
      }
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      idleId = null;
    };

    const triggerLoad = () => {
      cleanupIdle();
      loadScene();
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (entry?.isIntersecting) {
                triggerLoad();
                observer.disconnect();
              }
            },
            { rootMargin: "150px" }
          )
        : null;

    if (observer) {
      observer.observe(target);
    }

    target.addEventListener("pointerenter", triggerLoad, { once: true });
    target.addEventListener("focus", triggerLoad, { once: true });
    scheduleIdle();

    return () => {
      cleanupIdle();
      if (observer) {
        observer.disconnect();
      }
      target.removeEventListener("pointerenter", triggerLoad);
      target.removeEventListener("focus", triggerLoad);
    };
  }, [allowScene, renderScene]);

  return (
    <section
      id="home"
      className="relative flex w-full items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space"
      ref={sectionRef}
    >
      <HeroText />
      <ParallaxBackground />
      <figure className="absolute inset-0 h-full w-full">
        {allowScene && renderScene ? (
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
