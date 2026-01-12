import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TIDYCAL_URL =
  "https://tidycal.com/essabir02yassine/lets-chat-about-your-idea";

const TidyCallEmbed = ({
  url = DEFAULT_TIDYCAL_URL,
  title = "Book a free call",
  height = "clamp(560px, 80vh, 920px)",
  className = "",
  iframeClassName = "",
}) => (
  <div className={`w-full ${className}`.trim()}>
    <iframe
      src={url}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`w-full rounded-2xl border border-white/10 bg-black/20 ${iframeClassName}`.trim()}
      style={{ height }}
    />
  </div>
);

const TidyCallModal = ({
  url = DEFAULT_TIDYCAL_URL,
  title = "Book a free call",
  buttonLabel = "Book a free call",
  buttonClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="w-full">
      <button
        type="button"
        className={`inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 ${buttonClassName}`.trim()}
        onClick={() => setIsOpen(true)}
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close booking modal"
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-5xl rounded-2xl border border-white/10 bg-primary p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">Book a Free Call</h3>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
            <TidyCallEmbed
              url={url}
              title={title}
              height="clamp(520px, 72vh, 820px)"
              iframeClassName="rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TidyCall = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const header = section.querySelector(".js-tidycall-header");
      const title = section.querySelector(".js-tidycall-title");
      const copy = section.querySelector(".js-tidycall-copy");
      const embed = section.querySelector(".js-tidycall-embed");

      const fadeTargets = [header, embed].filter(Boolean);
      const textTargets = [title, copy].filter(Boolean);

      if (fadeTargets.length) {
        gsap.set(fadeTargets, {
          autoAlpha: 0,
          y: 26,
          filter: "blur(6px)",
        });
      }
      if (textTargets.length) {
        gsap.set(textTargets, { autoAlpha: 0, y: 18 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 30%",
        },
      });

      if (header) {
        tl.to(header, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
        });
      }
      if (title) {
        tl.to(
          title,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          "-=0.45"
        );
      }
      if (copy) {
        tl.to(
          copy,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
      if (embed) {
        tl.to(
          embed,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.25"
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-32 lg:px-48 section-spacing"
      id="tidycall"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center js-tidycall-header">
        <h2 className="services-title js-tidycall-title">Book a Free Call</h2>
        <p className="mt-8 text-base text-neutral-300 js-tidycall-copy">
          Let&apos;s create something amazing. Pick a time that works for you.
        </p>
      </div>

      <div className="mt-10 js-tidycall-embed">
        <TidyCallEmbed />
      </div>
    </section>
  );
};

export default TidyCall;
export { TidyCallEmbed, TidyCallModal };
