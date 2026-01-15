import { useEffect } from "react";

/**
 * Custom hook for managing scroll behavior based on route changes.
 * Scrolls to hash anchors with smooth behavior support and scroll to top on route change.
 */
export const useScrollBehavior = (location, shouldSkipScroll = false) => {
  // Scroll to hash anchor when hash changes (unless scrolling should be skipped)
  useEffect(() => {
    if (shouldSkipScroll) return;

    const hash = location.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    // Respect user's motion preferences
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  }, [location.hash, shouldSkipScroll]);

  // Scroll to top on pathname change (unless hash is present)
  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);
};
