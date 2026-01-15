import { useState, useEffect, useCallback } from "react";
import { normalizePathname } from "../utils/paths";

/**
 * Custom hook for managing route location and navigation.
 * Handles browser history, hash changes, and internal link clicks.
 * Returns current route type and ID for conditional rendering.
 */
export const useRouteLocation = () => {
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") {
      return { pathname: "/", hash: "" };
    }
    return {
      pathname: window.location.pathname,
      hash: window.location.hash,
    };
  });

  // Update location on history and hash changes
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

  // Handle internal link clicks
  useEffect(() => {
    const handleLinkClick = (event) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!target?.closest) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      // Allow external links, downloads, and special protocols
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (href.startsWith("#")) return;

      // Only handle same-origin navigation
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

  // Resolve route from pathname
  const pathname = normalizePathname(location.pathname);
  const workMatch = pathname.match(/^\/works\/([^/]+)\/?$/);
  let workId = null;

  if (workMatch) {
    try {
      workId = decodeURIComponent(workMatch[1]);
    } catch (error) {
      workId = null;
      if (process.env.NODE_ENV === "development") {
        console.warn("Invalid work identifier", workMatch[1], error);
      }
    }
  }

  const worksIndex = /^\/works\/?$/.test(pathname);

  // Determine route type
  const route = (() => {
    if (workId) return { type: "work-detail", id: workId };
    if (worksIndex) return { type: "works" };
    if (pathname === "/" || pathname === "") return { type: "home" };
    return { type: "not-found" };
  })();

  return {
    location,
    route,
    pathname,
  };
};
