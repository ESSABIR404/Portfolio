import { gsap } from "gsap";

let isInitialized = false;

/**
 * Initialize custom cursor with hover effects on interactive elements.
 * Respects coarse pointer devices (touch) by hiding the custom cursor.
 * Returns cleanup function to remove event listeners.
 */
export const initCursor = () => {
  if (isInitialized) return () => {};

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  const project = document.getElementById("cursor-project");

  if (!dot || !ring) return () => {};

  // Hide custom cursor on touch devices
  const isCoarsePointer =
    (window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches) ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);

  if (isCoarsePointer) {
    [dot, ring, project].forEach((el) => {
      if (el) el.style.display = "none";
    });
    return () => {};
  }

  isInitialized = true;

  // Position cursors at center
  const tracked = [dot, ring];
  if (project) tracked.push(project);
  gsap.set(tracked, { xPercent: -50, yPercent: -50 });

  // Create GSAP animation tweens
  const moveDotX = gsap.quickTo(dot, "x", {
    duration: 0.12,
    ease: "power3.out",
  });
  const moveDotY = gsap.quickTo(dot, "y", {
    duration: 0.12,
    ease: "power3.out",
  });
  const moveRingX = gsap.quickTo(ring, "x", {
    duration: 0.35,
    ease: "power3.out",
  });
  const moveRingY = gsap.quickTo(ring, "y", {
    duration: 0.35,
    ease: "power3.out",
  });
  const moveProjectX = project
    ? gsap.quickTo(project, "x", { duration: 0.2, ease: "power3.out" })
    : null;
  const moveProjectY = project
    ? gsap.quickTo(project, "y", { duration: 0.2, ease: "power3.out" })
    : null;

  let rafId = null;
  let lastPointer = null;

  // Throttle cursor movement with RAF
  const handleMove = (event) => {
    lastPointer = { x: event.clientX, y: event.clientY };
    if (rafId) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      if (!lastPointer) return;

      const { x, y } = lastPointer;
      moveDotX(x);
      moveDotY(y);
      moveRingX(x);
      moveRingY(y);

      if (moveProjectX && moveProjectY) {
        moveProjectX(x);
        moveProjectY(y);
      }
    });
  };

  // Scale down on pointer down
  const handleDown = () => {
    gsap.to([ring, dot], { scale: 0.85, duration: 0.15, ease: "power2.out" });
  };

  // Scale back on pointer up
  const handleUp = () => {
    gsap.to([ring, dot], { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  // Move cursor
  window.addEventListener("pointermove", handleMove, { passive: true });
  window.addEventListener("pointerdown", handleDown);
  window.addEventListener("pointerup", handleUp);

  // Project card hover effects
  let handleProjectOver;
  let handleProjectOut;

  if (project) {
    const showProjectCursor = () => {
      gsap.to(project, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to([dot, ring], {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const hideProjectCursor = () => {
      gsap.to(project, {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.inOut",
      });
      gsap.to([dot, ring], {
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const PROJECT_SELECTOR =
      ".latest-work__device, .works-page__card, .work-detail__more-card";

    const getProjectTarget = (target) =>
      target?.closest?.(PROJECT_SELECTOR) ?? null;

    handleProjectOver = (event) => {
      if (!getProjectTarget(event.target)) return;
      showProjectCursor();
    };

    handleProjectOut = (event) => {
      const leftTarget = getProjectTarget(event.target);
      if (!leftTarget) return;
      if (getProjectTarget(event.relatedTarget) === leftTarget) return;
      hideProjectCursor();
    };

    window.addEventListener("pointerover", handleProjectOver);
    window.addEventListener("pointerout", handleProjectOut);
  }

  // Interactive element hover effects
  const INTERACTIVE_SELECTOR = "a, button, .btn-neon, .nav-link";
  const RING_INTERACTIVE_STYLE = {
    scale: 1.45,
    borderColor: "rgba(96, 221, 255, 0.9)",
    boxShadow: "0 0 18px rgba(96, 221, 255, 0.6)",
    duration: 0.2,
    ease: "power2.out",
  };
  const RING_DEFAULT_STYLE = {
    scale: 1,
    borderColor: "rgba(122, 87, 219, 0.55)",
    boxShadow: "0 0 14px rgba(122, 87, 219, 0.4)",
    duration: 0.2,
    ease: "power2.out",
  };

  let activeInteractive = null;

  const handleInteractiveOver = (event) => {
    const target = event.target;
    if (!target?.closest) return;

    const interactive = target.closest(INTERACTIVE_SELECTOR);
    if (!interactive || interactive === activeInteractive) return;

    activeInteractive = interactive;
    gsap.to(ring, RING_INTERACTIVE_STYLE);
  };

  const handleInteractiveOut = (event) => {
    if (!activeInteractive) return;

    const target = event.target;
    if (!target?.closest) return;

    const interactive = target.closest(INTERACTIVE_SELECTOR);
    if (!interactive || interactive !== activeInteractive) return;

    if (event.relatedTarget && activeInteractive.contains(event.relatedTarget)) {
      return;
    }

    activeInteractive = null;
    gsap.to(ring, RING_DEFAULT_STYLE);
  };

  window.addEventListener("pointerover", handleInteractiveOver);
  window.addEventListener("pointerout", handleInteractiveOut);

  // Return cleanup function
  return () => {
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerdown", handleDown);
    window.removeEventListener("pointerup", handleUp);

    if (handleProjectOver) {
      window.removeEventListener("pointerover", handleProjectOver);
    }
    if (handleProjectOut) {
      window.removeEventListener("pointerout", handleProjectOut);
    }

    window.removeEventListener("pointerover", handleInteractiveOver);
    window.removeEventListener("pointerout", handleInteractiveOut);

    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }

    isInitialized = false;
  };
};
