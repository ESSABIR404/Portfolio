import { useEffect, useRef, useState } from "react";

/**
 * Lazy mounting component that renders children only when visible in viewport.
 * Uses IntersectionObserver for efficient viewport detection.
 * Supports custom root margin for early/late loading and placeholder content.
 *
 * Props:
 * - children: Content to render when visible
 * - rootMargin: IntersectionObserver root margin (default: "200px")
 * - minHeight: CSS min-height for content area
 * - placeholder: Content to show while hidden
 * - className: CSS classes for container
 */
const LazyMount = ({
  children,
  rootMargin = "200px",
  minHeight,
  placeholder = null,
  className = "",
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (isVisible) return; // Skip if already visible

    const target = ref.current;
    if (!target) return;

    // Reveal and schedule render on next frame for smooth transition
    const reveal = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    };

    // Fall back to immediate reveal if IntersectionObserver unavailable
    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    // Set up observer with specified margin
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, rootMargin]);

  // Use containIntrinsicSize for layout stability
  const wrapperStyle = minHeight
    ? { minHeight, containIntrinsicSize: minHeight }
    : undefined;

  return (
    <div ref={ref} style={wrapperStyle} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
};

export default LazyMount;
