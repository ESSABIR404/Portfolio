import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const logos = [
  { name: "Next.js", src: "assets/logos/marque/next.svg" },
  { name: "React", src: "assets/logos/marque/react.svg" },
  {
    name: "HTML5",
    src: "assets/logos/marque/html5-with-wordmark-blackwhite-seeklogo 1.svg",
  },
  { name: "CSS3", src: "assets/logos/marque/css-3-seeklogo 1.svg" },
  {
    name: "JavaScript",
    src: "assets/logos/marque/javascript-js-seeklogo 1.svg",
  },
  {
    name: "TypeScript",
    src: "assets/logos/marque/typescript-seeklogo 1.svg",
  },
  { name: "Figma", src: "assets/logos/marque/figma-seeklogo 1.svg" },
  { name: "GitHub", src: "assets/logos/marque/github-seeklogo 1.svg" },
  { name: "Node.js", src: "assets/logos/marque/node-js-seeklogo 1.svg" },
  {
    name: "Framer",
    src: "assets/logos/marque/framer-icon-seeklogo 1.svg",
  },
  {
    name: "Tailwind CSS",
    src: "assets/logos/marque/tailwind-css-seeklogo 1.svg",
  },
  { name: "Vite", src: "assets/logos/marque/vite.svg" },
  { name: "Vue", src: "assets/logos/marque/vue.svg" },
  { name: "WordPress", src: "assets/logos/marque/wordpress.svg" },
  {
    name: "Shopify",
    src: "assets/logos/marque/shopify-seeklogo 1.svg",
  },
  { name: "Flutter", src: "assets/logos/marque/flutter-seeklogo 1.svg" },
];

export default function TechMarquee() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let rafId;

    const setup = () => {
      tweenRef.current?.kill();

      const items = Array.from(track.children);
      const half = Math.floor(items.length / 2);
      const gap = parseFloat(getComputedStyle(track).gap || "0");

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
        modifiers: {
          x: (v) => `${wrapX(parseFloat(v))}px`,
        },
      });
    };

    const handleImageLoad = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(setup);
    };

    setup();
    window.addEventListener("resize", setup);

    const images = Array.from(track.querySelectorAll("img"));
    images.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", handleImageLoad);
    });

    const onEnter = () => tweenRef.current?.pause();
    const onLeave = () => tweenRef.current?.resume();
    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", setup);
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mouseleave", onLeave);
      images.forEach((img) => img.removeEventListener("load", handleImageLoad));
      if (rafId) cancelAnimationFrame(rafId);
      tweenRef.current?.kill();
    };
  }, []);

  const items = [...logos, ...logos];

  return (
    <section className="logo-marquee" aria-label="Technology stack">
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
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
