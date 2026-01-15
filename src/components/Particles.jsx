import { twMerge } from "tailwind-merge";
import { useEffect, useRef } from "react";

// Helper to convert hex color to RGB array
const hexToRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized.split("").map((c) => c + c).join("")
      : normalized;

  const int = parseInt(expanded, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// Target FPS for particle animation (30fps is efficient for smooth motion)
const PARTICLE_TARGET_FPS = 30;
const PARTICLE_FRAME_TIME = 1000 / PARTICLE_TARGET_FPS;

/**
 * Interactive particle system with mouse tracking.
 * Creates animated particles that respond to cursor position.
 * Respects prefers-reduced-motion and visibility changes.
 *
 * Props:
 * - className: CSS classes for container
 * - quantity: Number of particles (default: 60)
 * - staticity: Resistance to movement (default: 50)
 * - ease: Animation ease factor (default: 50)
 * - size: Particle size (default: 0.4)
 * - color: Hex color (default: #ffffff)
 * - vx, vy: Particle velocity
 * - refresh: Force reinit when changed
 */
export const Particles = ({
  className = "",
  quantity = 60,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const context = useRef(null);
  const circles = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });

  // DPR optimization for high-DPI displays
  const dpr = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    1.5
  );

  const rafID = useRef(null);
  const resizeTimeout = useRef(null);
  const mouseRaf = useRef(null);
  const isRunning = useRef(false);
  const isVisible = useRef(true);
  const prefersReduced = useRef(false);
  const lastParticleFrameTime = useRef(performance.now());

  const rgb = hexToRgb(color);

  // Create particle with random properties
  const createCircle = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const size_ = Math.floor(Math.random() * 2) + size;

    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size: size_,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  };

  // Draw a single particle
  const drawCircle = (circle, update = false) => {
    if (!context.current) return;

    const { x, y, translateX, translateY, size: s, alpha } = circle;
    context.current.translate(translateX, translateY);
    context.current.beginPath();
    context.current.arc(x, y, s, 0, 2 * Math.PI);
    context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
    context.current.fill();
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!update) {
      circles.current.push(circle);
    }
  };

  // Clear canvas
  const clearContext = () => {
    if (!context.current) return;
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
  };

  // Remap value between ranges (for edge distance calculations)
  const remapValue = (value, start1, end1, start2, end2) => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return Math.max(0, remapped);
  };

  // Resize canvas and reinitialize particles
  const resizeCanvas = () => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !context.current) return;

    canvasSize.current.w = container.offsetWidth;
    canvasSize.current.h = container.offsetHeight;

    canvas.width = canvasSize.current.w * dpr;
    canvas.height = canvasSize.current.h * dpr;
    canvas.style.width = `${canvasSize.current.w}px`;
    canvas.style.height = `${canvasSize.current.h}px`;
    context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Reset particles
    circles.current = [];
    for (let i = 0; i < quantity; i++) {
      drawCircle(createCircle());
    }
  };

  // Handle mouse position updates efficiently
  const updateMousePosition = () => {
    mouseRaf.current = null;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { w, h } = canvasSize.current;
    const x = mousePosition.current.x - rect.left - w / 2;
    const y = mousePosition.current.y - rect.top - h / 2;

    // Only update if within canvas bounds
    if (Math.abs(x) < w / 2 && Math.abs(y) < h / 2) {
      mouse.current.x = x;
      mouse.current.y = y;
    }
  };

  // Animation loop
  const animate = (currentTime) => {
    if (!isRunning.current) return;

    // Throttle to target FPS
    if (currentTime - lastParticleFrameTime.current < PARTICLE_FRAME_TIME) {
      rafID.current = window.requestAnimationFrame(animate);
      return;
    }

    lastParticleFrameTime.current = currentTime;
    clearContext();

    // Update each particle
    for (let i = circles.current.length - 1; i >= 0; i -= 1) {
      const circle = circles.current[i];

      // Calculate distance to nearest edge
      const edgeDistances = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];

      const closestEdge = Math.min(...edgeDistances);
      const edgeFade = Math.max(0, remapValue(closestEdge, 0, 20, 0, 1));

      // Fade particles at edges
      if (edgeFade > 1) {
        circle.alpha = Math.min(circle.alpha + 0.02, circle.targetAlpha);
      } else {
        circle.alpha = circle.targetAlpha * edgeFade;
      }

      // Update position
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      drawCircle(circle, true);

      // Recycle particles that leave the canvas
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        drawCircle(createCircle());
      }
    }

    rafID.current = window.requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (isRunning.current) return;
    isRunning.current = true;
    lastParticleFrameTime.current = performance.now();
    rafID.current = window.requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    isRunning.current = false;
    if (rafID.current != null) {
      window.cancelAnimationFrame(rafID.current);
      rafID.current = null;
    }
  };

  // Manage animation state based on visibility and motion preferences
  const handleVisibility = () => {
    if (document.hidden || prefersReduced.current || !isVisible.current) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  // Initialize canvas and attach event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    context.current = canvas.getContext("2d");
    if (!context.current) return;

    // Check for reduced motion preference
    const motionQuery = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    prefersReduced.current = motionQuery?.matches ?? false;

    const onReduceMotionChange = (event) => {
      prefersReduced.current = event.matches;
      handleVisibility();
    };

    // Listen for motion preference changes
    motionQuery?.addEventListener?.("change", onReduceMotionChange) ||
      motionQuery?.addListener?.(onReduceMotionChange);

    // Track visibility
    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              isVisible.current = entries[0]?.isIntersecting ?? false;
              handleVisibility();
            },
            { threshold: 0.1 }
          )
        : null;

    intersectionObserver?.observe(container);

    // Initialize and start
    resizeCanvas();
    if (!prefersReduced.current) {
      startAnimation();
    }

    // Handle window resize
    const handleResize = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(resizeCanvas, 200);
    };

    // Handle mouse movement
    const handlePointerMove = (event) => {
      mousePosition.current.x = event.clientX;
      mousePosition.current.y = event.clientY;
      if (!mouseRaf.current) {
        mouseRaf.current = window.requestAnimationFrame(updateMousePosition);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopAnimation();
      clearTimeout(resizeTimeout.current);
      if (mouseRaf.current) {
        window.cancelAnimationFrame(mouseRaf.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      intersectionObserver?.disconnect();
      motionQuery?.removeEventListener?.("change", onReduceMotionChange) ||
        motionQuery?.removeListener?.(onReduceMotionChange);
    };
  }, [color]);

  // Reinitialize particles on refresh prop change
  useEffect(() => {
    resizeCanvas();
  }, [refresh]);

  return (
    <div
      className={twMerge("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
