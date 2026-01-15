import { useEffect, useMemo, useRef } from "react";
import { gsap } from "../utils/gsap";
import { assetUrl } from "../utils/paths";

const layerVariants = {
  sky: [
    {
      path: assetUrl("optimized/sky.avif"),
      type: "image/avif",
      density: "2x",
    },
    {
      path: assetUrl("optimized/sky.webp"),
      type: "image/webp",
      density: "1x",
    },
  ],
  "mountain-3": [
    {
      path: assetUrl("optimized/mountain-3.avif"),
      type: "image/avif",
      density: "2x",
    },
    {
      path: assetUrl("optimized/mountain-3-1280.webp"),
      type: "image/webp",
      density: "1x",
    },
  ],
  planets: [
    {
      path: assetUrl("optimized/planets.avif"),
      type: "image/avif",
      density: "2x",
    },
    {
      path: assetUrl("optimized/planets-1280.webp"),
      type: "image/webp",
      density: "1x",
    },
  ],
  "mountain-2": [
    {
      path: assetUrl("optimized/mountain-2.avif"),
      type: "image/avif",
      density: "2x",
    },
    {
      path: assetUrl("optimized/mountain-2-1280.webp"),
      type: "image/webp",
      density: "1x",
    },
  ],
  "mountain-1": [
    {
      path: assetUrl("optimized/mountain-1.avif"),
      type: "image/avif",
      density: "2x",
    },
    {
      path: assetUrl("optimized/mountain-1-1280.webp"),
      type: "image/webp",
      density: "1x",
    },
  ],
};

const buildBackgroundStyle = (variants) => {
  if (!variants || variants.length === 0) return {};
  const descriptor = variants
    .map(
      ({ path, type, density }) =>
        `url("${path}") type("${type}") ${density}`
    )
    .join(", ");
  const fallbackUrl = variants[variants.length - 1].path;
  const imageSetValue = `image-set(${descriptor})`;
  const webkitImageSetValue = `-webkit-image-set(${descriptor})`;
  return {
    backgroundImage: `${imageSetValue}, url("${fallbackUrl}")`,
    WebkitImageSet: webkitImageSetValue,
    backgroundPosition: "bottom",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
};

const ParallaxBackground = () => {
  const rootRef = useRef(null);
  const skyStyle = useMemo(() => buildBackgroundStyle(layerVariants.sky), []);
  const mountain3Style = useMemo(
    () => buildBackgroundStyle(layerVariants["mountain-3"]),
    []
  );
  const planetsStyle = useMemo(
    () => buildBackgroundStyle(layerVariants.planets),
    []
  );
  const mountain2Style = useMemo(
    () => buildBackgroundStyle(layerVariants["mountain-2"]),
    []
  );
  const gradientStyle = useMemo(
    () => ({
      background:
        "radial-gradient(900px 520px at 12% 12%, #4a86ff24, transparent 60%), radial-gradient(700px 600px at 85% 14%, var(--pricing-accent-shadow), transparent 70%), radial-gradient(820px 520px at 18% 78%, #4a86ff1f, transparent 65%), radial-gradient(650px 520px at 80% 92%, var(--pricing-accent-shadow), transparent 70%)",
    }),
    []
  );
  const mountain1Style = useMemo(
    () => buildBackgroundStyle(layerVariants["mountain-1"]),
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const scrollConfig = {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };

      const layers = [
        { ref: root.querySelector(".parallax-layer--mountain3"), y: 70 },
        { ref: root.querySelector(".parallax-layer--planets"), x: -20 },
        { ref: root.querySelector(".parallax-layer--mountain2"), y: 30 },
      ];

      layers.forEach(({ ref, x, y }) => {
        if (!ref) return;
        const target = x ? { xPercent: x } : { yPercent: y };
        gsap.to(ref, {
          ...target,
          ease: "none",
          scrollTrigger: scrollConfig,
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="absolute inset-0 bg-black/40" ref={rootRef}>
      <div className="relative h-screen overflow-y-hidden">
        <div
          className="absolute inset-0 w-full h-screen -z-50 parallax-layer--sky"
          style={skyStyle}
        />
        <div
          className="absolute inset-0 -z-40 parallax-layer--mountain3"
          style={mountain3Style}
        />
        <div
          className="absolute inset-0 -z-30 parallax-layer--planets"
          style={planetsStyle}
        />
        <div
          className="absolute inset-0 -z-20 parallax-layer--mountain2"
          style={mountain2Style}
        />
        <div
          className="absolute inset-0 -z-10 parallax-layer--mountain1"
          style={mountain1Style}
        />
        <div
          className="absolute inset-0 -z-5 parallax-layer__gradient"
          style={gradientStyle}
        />
      </div>
    </section>
  );
};

export default ParallaxBackground;
