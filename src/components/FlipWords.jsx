import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { twMerge } from "tailwind-merge";

export const FlipWords = ({ words = [], duration = 3000, className }) => {
  const [index, setIndex] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const containerRef = useRef(null);
  const hasMultiple = words.length > 1;

  const currentWord = useMemo(
    () => words[index % words.length] || "",
    [index, words]
  );

  useEffect(() => {
    if (!hasMultiple || prefersReduced) return;
    const container = containerRef.current;
    if (!container) return;

    const letters = container.querySelectorAll("[data-letter]");
    const enterDuration = 0.25;
    const exitDuration = 0.35;
    const total = Math.max(duration / 1000, enterDuration + exitDuration + 0.2);
    const hold = Math.max(total - enterDuration - exitDuration, 0.2);

    gsap.set(container, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIndex((prev) => (prev + 1) % words.length);
      },
    });

    tl.fromTo(
      letters,
      { opacity: 0, y: 10, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: enterDuration,
        ease: "power2.out",
        stagger: 0.05,
      }
    ).to(
      container,
      {
        opacity: 0,
        y: -40,
        x: 40,
        filter: "blur(8px)",
        scale: 2,
        duration: exitDuration,
        ease: "power2.inOut",
      },
      `+=${hold}`
    );

    return () => {
      tl.kill();
    };
  }, [currentWord, duration, hasMultiple, prefersReduced, words.length]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();
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

  if (!words.length) return null;

  return (
    <div
      ref={containerRef}
      className={twMerge("z-10 inline-block relative text-left", className)}
    >
      {currentWord.split(" ").map((word, wordIndex) => (
        <span
          key={`${currentWord}-${wordIndex}`}
          className="inline-block whitespace-nowrap"
        >
          {word.split("").map((letter, letterIndex) => (
            <span
              key={`${currentWord}-${letterIndex}`}
              data-letter
              className="inline-block"
            >
              {letter}
            </span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </div>
  );
};
