import {
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { easing } from "maath";
import Loader from "./Loader";
import { Astronaut } from "./Astronaut";
import { ScrollTrigger } from "../utils/gsap";

/* -------------------------------- constants -------------------------------- */

const LOW_CONNECTION_TYPES = new Set(["slow-2g", "2g", "3g"]);
const MIN_CONCURRENCY = 4;
const FRAME_DURATION_MS = 1000 / 45;

/* ------------------------------ helpers ------------------------------------- */

const evaluateSceneSupport = (prefersReducedMotion) => {
  if (prefersReducedMotion) return false;
  if (typeof navigator === "undefined") return true;

  const hardwareConcurrency = navigator.hardwareConcurrency ?? MIN_CONCURRENCY;
  const effectiveType =
    navigator.connection?.effectiveType?.toLowerCase?.() ?? "";

  const isSlow = effectiveType && LOW_CONNECTION_TYPES.has(effectiveType);
  return hardwareConcurrency > MIN_CONCURRENCY && !isSlow;
};

const useMatchMedia = (query, fallback = false) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return fallback;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!window?.matchMedia) return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener?.("change", update);
    media.addListener?.(update);

    return () => {
      media.removeEventListener?.("change", update);
      media.removeListener?.(update);
    };
  }, [query]);

  return matches;
};

/* -------------------- THE ACTUAL FIX (IMPORTANT) ----------------------------- */
/**
 * This component reproduces EXACTLY what a "tiny scroll" does:
 * - waits for layout + fonts
 * - dispatches resize
 * - refreshes ScrollTrigger
 * - invalidates ONE frame
 *
 * Runs ONCE.
 */
function ForceStableFirstFrame({ active }) {
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  const ran = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (ran.current) return;
    if (!size.width || !size.height) return;

    const run = async () => {
      // Wait for fonts (text reflow affects layout)
      try {
        await document.fonts?.ready;
      } catch {}

      // Wait for layout to fully settle
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));

      // 1) Trigger resize observers (R3F listens to this)
      window.dispatchEvent(new Event("resize"));

      // 2) Force GSAP ScrollTrigger to apply initial state
      try {
        ScrollTrigger?.refresh?.(true);
        ScrollTrigger?.update?.();
      } catch {}

      // 3) Render exactly one correct frame
      invalidate();

      ran.current = true;
    };

    run();
  }, [active, size.width, size.height, invalidate]);

  return null;
}

/* ----------------------------- R3F hooks ------------------------------------ */

function Rig({ active }) {
  useFrame((state, delta) => {
    if (!active) return;
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const x = clamp(state.mouse.x, -0.45, 0.45);
    const y = clamp(state.mouse.y, -0.35, 0.35);
    easing.damp3(
      state.camera.position,
      [x * 0.15, 1 + y * 0.15, 3],
      0.5,
      delta
    );
  });
  return null;
}

function FrameLoop({ active }) {
  const invalidate = useThree((s) => s.invalidate);
  const lastTime = useRef(0);

  useEffect(() => {
    if (!active) return;
    lastTime.current = performance.now();
    invalidate();
  }, [active, invalidate]);

  useFrame(() => {
    if (!active) return;
    const now = performance.now();
    if (now - lastTime.current >= FRAME_DURATION_MS) {
      invalidate();
      lastTime.current = now;
    }
  });

  return null;
}

/* ------------------------------- MAIN --------------------------------------- */

function HeroScene() {
  const containerRef = useRef(null);

  const isMobile = useMatchMedia("(max-width: 853px)");
  const prefersReducedMotion = useMatchMedia(
    "(prefers-reduced-motion: reduce)",
    false
  );

  const [isVisible, setIsVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const isActive = isVisible && isPageVisible;

  const [deviceCapable, setDeviceCapable] = useState(() =>
    evaluateSceneSupport(prefersReducedMotion)
  );

  useEffect(() => {
    setDeviceCapable(evaluateSceneSupport(prefersReducedMotion));
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handle = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handle);
    handle();
    return () => document.removeEventListener("visibilitychange", handle);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !window.IntersectionObserver) return;

    const io = new IntersectionObserver(
      ([entry]) => entry && setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dpr = useMemo(() => {
    if (!window) return 1;
    return Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
  }, [isMobile]);

  const camera = useMemo(() => ({ position: [0, 1, 3] }), []);

  const quality = useMemo(() => {
    const lowMem =
      typeof navigator.deviceMemory === "number" &&
      navigator.deviceMemory <= 4;
    if (lowMem || isMobile) return "low";
    return "high";
  }, [isMobile]);

  const astronautProps = useMemo(
    () =>
      isMobile
        ? { scale: 0.23, position: [0, -1.5, 0], quality, active: isActive }
        : { quality, active: isActive },
    [isMobile, quality, isActive]
  );

  if (!deviceCapable) {
    return <div ref={containerRef} className="h-screen w-full" />;
  }

  return (
    <div ref={containerRef} className="relative h-screen w-full">
      <Canvas
        camera={camera}
        dpr={dpr}
        frameloop={isActive ? "demand" : "never"}
        gl={{ powerPreference: "high-performance", antialias: !isMobile }}
      >
        <Suspense fallback={<Loader />}>
          <ForceStableFirstFrame active={isActive} />
          <Float>
            <Astronaut {...astronautProps} />
          </Float>
          <Rig active={isActive} />
          <FrameLoop active={isActive} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default memo(HeroScene);
