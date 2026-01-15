import { forwardRef, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { assetUrl } from "../utils/paths";

const logoPath = (file) => assetUrl(`logos/marque/${file}`);

const logos = [
  { name: "Next.js", src: logoPath("next.svg") },
  { name: "React", src: logoPath("react.svg") },
  {
    name: "HTML5",
    src: logoPath("html5-with-wordmark-blackwhite-seeklogo 1.svg"),
  },
  { name: "CSS3", src: logoPath("css-3-seeklogo 1.svg") },
  {
    name: "JavaScript",
    src: logoPath("javascript-js-seeklogo 1.svg"),
  },
  {
    name: "TypeScript",
    src: logoPath("typescript-seeklogo 1.svg"),
  },
  { name: "Figma", src: logoPath("figma-seeklogo 1.svg") },
  { name: "GitHub", src: logoPath("github-seeklogo 1.svg") },
  { name: "Node.js", src: logoPath("node-js-seeklogo 1.svg") },
  {
    name: "Framer",
    src: logoPath("framer-icon-seeklogo 1.svg"),
  },
  {
    name: "Tailwind CSS",
    src: logoPath("tailwind-css-seeklogo 1.svg"),
  },
  { name: "Vite", src: logoPath("vite.svg") },
  { name: "Vue", src: logoPath("vue.svg") },
  { name: "WordPress", src: logoPath("wordpress.svg") },
  {
    name: "Shopify",
    src: logoPath("shopify-seeklogo 1.svg"),
  },
  { name: "Flutter", src: logoPath("flutter-seeklogo 1.svg") },
];

const TechMarquee = forwardRef(function TechMarquee(_, ref) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (event) => setPrefersReduced(event.matches);
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
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    if (prefersReduced) return;

    let rafId = null;
    let resizeObserver;
    let intersectionObserver;
    let isHovered = false;
    let isVisible = true;

    const updatePlayback = () => {
      const tween = tweenRef.current;
      if (!tween) return;
      if (!isVisible || isHovered) {
        tween.pause();
      } else {
        tween.play();
      }
    };

    const setup = () => {
      tweenRef.current?.kill();

      const items = Array.from(track.children);
      const half = Math.floor(items.length / 2);
      const gapValue = parseFloat(getComputedStyle(track).gap);
      const gap = Number.isFinite(gapValue) ? gapValue : 0;

      let setWidth = 0;
      for (let i = 0; i < half; i += 1) {
        setWidth += items[i].getBoundingClientRect().width;
        if (i < half - 1) setWidth += gap;
      }
      if (!setWidth) return;

      const wrapX = gsap.utils.wrap(-setWidth, 0);
      gsap.set(track, { x: 0 });

      tweenRef.current = gsap.to(track, {
        x: -setWidth,
        duration: 40,
        ease: "none",
        repeat: -1,
        paused: !isVisible || isHovered,
        modifiers: {
          x: (v) => `${wrapX(parseFloat(v))}px`,
        },
      });

      updatePlayback();
    };

    const scheduleSetup = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(setup);
    };

    const handleImageLoad = () => {
      scheduleSetup();
    };

    scheduleSetup();

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleSetup);
      resizeObserver.observe(wrap);
    } else {
      window.addEventListener("resize", scheduleSetup);
    }

    const images = Array.from(track.querySelectorAll("img"));
    images.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", handleImageLoad);
    });

    if (typeof IntersectionObserver !== "undefined") {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isVisible = entry.isIntersecting;
          updatePlayback();
        },
        { threshold: 0.15 }
      );
      intersectionObserver.observe(wrap);
    }

    const onEnter = () => {
      isHovered = true;
      updatePlayback();
    };
    const onLeave = () => {
      isHovered = false;
      updatePlayback();
    };
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", scheduleSetup);
      }
      if (intersectionObserver) intersectionObserver.disconnect();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      images.forEach((img) => img.removeEventListener("load", handleImageLoad));
      if (rafId) cancelAnimationFrame(rafId);
      tweenRef.current?.kill();
    };
  }, [prefersReduced]);

  const items = [...logos, ...logos];

  return (
    <section className="logo-marquee" aria-label="Technology stack" ref={ref}>
      <div className="logo-marquee__wrap" ref={wrapRef}>
        <div className="logo-marquee__track" ref={trackRef}>
          {items.map((logo, idx) => (
            <span
              className="logo-marquee__item"
              key={`${logo.name}-${idx}`}
              aria-hidden={idx >= logos.length}
            >
              <img
                className="logo-marquee__logo"
                src={logo.src}
                alt={logo.name}
                draggable="false"
                loading="lazy"
                decoding="async"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TechMarquee;
