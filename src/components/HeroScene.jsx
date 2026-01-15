import { Suspense, memo, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { easing } from "maath";
import Loader from "./Loader";
import { Astronaut } from "./Astronaut";

const useMatchMedia = (query, fallback = false) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return fallback;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia(query);
    const update = (event) => setMatches(event.matches);
    update(media);
    if (media.addEventListener) {
      media.addEventListener("change", update);
    } else if (media.addListener) {
      media.addListener(update);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", update);
      } else if (media.removeListener) {
        media.removeListener(update);
      }
    };
  }, [query]);

  return matches;
};

const HeroScene = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const isMobile = useMatchMedia("(max-width: 853px)");
  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const maxDpr = isMobile ? 1 : 1.5;
    return Math.min(window.devicePixelRatio || 1, maxDpr);
  }, [isMobile]);
  const isActive = isVisible && isPageVisible;
  const camera = useMemo(() => ({ position: [0, 1, 3] }), []);
  const quality = useMemo(() => {
    if (typeof navigator === "undefined") return "high";
    const saveData = navigator.connection && navigator.connection.saveData;
    const lowMemory =
      typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
    if (saveData || lowMemory || isMobile) return "low";
    return "high";
  }, [isMobile]);
  const astronautProps = useMemo(
    () =>
      isMobile
        ? { scale: 0.23, position: [0, -1.5, 0], quality, active: isActive }
        : { quality, active: isActive },
    [isActive, isMobile, quality]
  );

  useEffect(() => {
    const handleVisibility = () => {
      setIsPageVisible(!document.hidden);
    };
    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visibleClass = isActive ? "hero-scene--visible" : "hero-scene--hidden";

  return (
    <div
      ref={containerRef}
      className={`h-full w-full transition-opacity duration-500 ${visibleClass}`}
      aria-hidden={!isActive}
    >
      <Canvas
        camera={camera}
        dpr={dpr}
        frameloop={isActive ? "demand" : "never"}
        gl={{ powerPreference: "high-performance", antialias: !isMobile }}
      >
        <Suspense fallback={<Loader />}>
          <Float>
            <Astronaut {...astronautProps} />
          </Float>
          <Rig active={isActive} />
          <FrameLoop active={isActive} />
        </Suspense>
      </Canvas>
    </div>
  );
};

function Rig({ active }) {
  return useFrame((state, delta) => {
    if (!active) return;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const x = clamp(state.mouse.x, -0.45, 0.45);
    const y = clamp(state.mouse.y, -0.35, 0.35);
    easing.damp3(state.camera.position, [x * 0.15, 1 + y * 0.15, 3], 0.5, delta);
  });
}

function FrameLoop({ active }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  useFrame(() => {
    if (active) invalidate();
  });
  return null;
}

export default memo(HeroScene);
