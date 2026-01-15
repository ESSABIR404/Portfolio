import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/ParallaxBackground";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

const HeroScene = lazy(() => import("../components/HeroScene"));

const Hero = () => {
  const sectionRef = useRef(null);
  const [loadScene, setLoadScene] = useState(false);
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

    setAllowScene(!(prefersReduced || saveData || lowMemory || isMobile));
  }, []);

  useEffect(() => {
    if (!allowScene) return;
    const target = sectionRef.current;
    if (!target) return;

    let rafId = null;
    const scheduleLoad = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setLoadScene(true));
    };

    if (typeof IntersectionObserver === "undefined") {
      scheduleLoad();
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          scheduleLoad();
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [allowScene]);

  return (
    <section
      id="home"
      className="relative flex w-full items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space"
      ref={sectionRef}
    >
      <HeroText />
      <ParallaxBackground />
      <figure className="absolute inset-0 h-full w-full">
        {allowScene && loadScene ? (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        ) : null}
      </figure>
    </section>
  );
};

export default Hero;
