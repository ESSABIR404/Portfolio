import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for lazy loading expensive components.
 * Uses IntersectionObserver for viewport detection, with fallback to requestIdleCallback.
 * Optimizes performance by deferring component rendering until needed.
 */
export const useIntersectionLoad = (containerRef, options = {}) => {
  const {
    rootMargin = "150px",
    timeout = 1000,
    onLoad = null,
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const idleCallbackRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (isLoaded) return;

    const target = containerRef.current;
    if (!target) return;

    const loadComponent = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const cleanupIdle = () => {
      if (idleCallbackRef.current == null) return;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleCallbackRef.current);
      } else {
        window.clearTimeout(idleCallbackRef.current);
      }
      idleCallbackRef.current = null;
    };

    const scheduleLoad = () => {
      cleanupIdle();

      // Use requestIdleCallback if available, otherwise queue on next frame
      const callback =
        window.requestIdleCallback ||
        ((cb) => window.setTimeout(cb, 0));

      idleCallbackRef.current = callback(() => loadComponent(), {
        timeout,
      });
    };

    const triggerLoad = () => {
      cleanupIdle();
      loadComponent();
    };

    // Set up IntersectionObserver for viewport detection
    if (typeof IntersectionObserver !== "undefined") {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            triggerLoad();
            observerRef.current?.disconnect();
          }
        },
        { rootMargin }
      );

      observerRef.current.observe(target);
    }

    // Trigger load on interaction
    const handleInteraction = () => triggerLoad();
    target.addEventListener("pointerenter", handleInteraction, { once: true });
    target.addEventListener("focus", handleInteraction, { once: true });

    // Schedule idle load
    scheduleLoad();

    return () => {
      cleanupIdle();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      target.removeEventListener("pointerenter", handleInteraction);
      target.removeEventListener("focus", handleInteraction);
    };
  }, [isLoaded, rootMargin, timeout, onLoad]);

  return isLoaded;
};
