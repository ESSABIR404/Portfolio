import { useEffect, useRef, useState } from "react";

const LazyMount = ({
  children,
  rootMargin = "200px",
  minHeight,
  placeholder = null,
  className = "",
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const target = ref.current;
    if (!target) return;

    let rafId = null;
    const reveal = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsVisible(true));
    };

    if (typeof IntersectionObserver === "undefined") {
      reveal();
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible, rootMargin]);

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
