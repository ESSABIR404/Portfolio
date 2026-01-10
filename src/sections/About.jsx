import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TechMarquee from "../components/TechMarquee";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const mobileSliderRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const track = mobileSliderRef.current;
    if (!track) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let tween;

    const setup = () => {
      if (tween) tween.kill();
      const slides = Array.from(track.querySelectorAll("img"));
      const sets = Number(track.dataset.sets || 2);
      const setSize = Math.floor(slides.length / sets);
      if (!setSize) return;
      const gap = parseFloat(getComputedStyle(track).gap || "0");
      const setWidth =
        slides
          .slice(0, setSize)
          .reduce((sum, slide) => sum + slide.getBoundingClientRect().width, 0) +
        gap * Math.max(0, setSize - 1);

      if (!setWidth) return;

      const wrapX = gsap.utils.wrap(-setWidth, 0);

      gsap.set(track, { x: 0 });
      tween = gsap.to(track, {
        x: -setWidth,
        duration: 18,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (value) => `${wrapX(parseFloat(value))}px`,
        },
      });
    };

    setup();
    window.addEventListener("resize", setup);
    window.addEventListener("load", setup);

    return () => {
      window.removeEventListener("resize", setup);
      window.removeEventListener("load", setup);
      if (tween) tween.kill();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const header = gsap.utils.toArray(
        ".services-title, .services-cta",
        section
      );
      const cards = gsap.utils.toArray(".service-card", section);
      const marquee = section.querySelector(".logo-marquee");
      const media = gsap.utils.toArray(
        ".service-card__media, .service-card__media-slider",
        section
      );

      gsap.set(header, { autoAlpha: 0, y: 24, filter: "blur(6px)" });
      gsap.set(cards, {
        autoAlpha: 0,
        y: 48,
        filter: "blur(8px)",
        scale: 0.98,
        transformPerspective: 1200,
      });
      if (marquee) {
        gsap.set(marquee, { autoAlpha: 0, y: 32, filter: "blur(8px)" });
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 20%",
        },
      })
        .to(header, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          overwrite: true,
        })
        .to(
          header,
          {
            y: 0,
          },
          0
        );

      const getCardOffsetX = (card) =>
        card.closest(".services-column--alt") ? 36 : -36;

      const revealCards = (batch, direction) => {
        const fromY = direction === "down" ? -44 : 44;
        batch.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              autoAlpha: 0,
              y: fromY,
              x: getCardOffsetX(card),
              rotateX: direction === "down" ? -6 : 6,
              scale: 0.98,
              filter: "blur(8px)",
            },
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              rotateX: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.0,
              ease: "power2.out",
              delay: index * 0.08,
              overwrite: true,
            }
          );
        });
      };

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        end: "bottom 20%",
        onEnter: (batch) => revealCards(batch, "up"),
        onEnterBack: (batch) => revealCards(batch, "down"),
      });

      if (marquee) {
        ScrollTrigger.create({
          trigger: marquee,
          start: "top 90%",
          onEnter: () =>
            gsap.to(marquee, {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              ease: "power2.out",
              overwrite: true,
            }),
          onEnterBack: () =>
            gsap.fromTo(
              marquee,
              { autoAlpha: 0, y: -28, filter: "blur(6px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                ease: "power2.out",
                overwrite: true,
              }
            ),
        });
      }

      media.forEach((item) => {
        gsap.fromTo(
          item,
          { yPercent: 6 },
          {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "bottom 10%",
              scrub: 0.6,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);
  return (
    <section
      className="c-space section-spacing services-section"
      id="about"
      ref={sectionRef}
    >
      <div className="services-header">
        <h2 className="services-title">How I Can Help Your Business</h2>
        <a
          className="services-cta button1"
          href="#contact"
          style={{ "--clr": "#7808d0" }}
        >
          Get in Touch
          <span className="button1__icon-wrapper" aria-hidden="true">
            <svg
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="button1__icon-svg"
              width="10"
            >
              <path
                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                fill="currentColor"
              ></path>
            </svg>

            <svg
              viewBox="0 0 14 15"
              fill="none"
              width="10"
              xmlns="http://www.w3.org/2000/svg"
              className="button1__icon-svg button1__icon-svg--copy"
            >
              <path
                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
        </a>
      </div>

      <div className="services-grid">
        <div className="services-column">
          <article className="service-card service-card--xl">
            <div className="service-card__head">
              <span className="service-card__icon">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 9H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <h3 className="service-card__title">
                Website Design & Development
              </h3>
            </div>
            <p className="service-card__text">
              Get a unique website built with strong performance, polished UI,
              and SEO-ready foundations. I blend design and engineering to
              create fast, conversion-focused experiences.
            </p>
            <div className="service-card__media">
              <img
                src="assets/projects/wordpress-theme.jpg"
                alt="Website preview"
                loading="lazy"
              />
            </div>
          </article>

          <article className="service-card service-card--compact">
            <div className="service-card__head">
              <span className="service-card__icon">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                >
                  <path
                    d="M4 6.5h16M8 11.5h8M6.5 16.5H13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h3 className="service-card__title">Strategic Consultations</h3>
            </div>
            <p className="service-card__text">
              Need clarity on your next move? I provide actionable roadmaps,
              audits, and product strategy tailored to your goals and timeline.
            </p>
          </article>
        </div>

        <div className="services-column services-column--alt">
          <article className="service-card service-card--compact">
            <div className="service-card__head">
              <span className="service-card__icon">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                >
                  <rect
                    x="7"
                    y="4"
                    width="10"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 8h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h3 className="service-card__title">UI/UX Design</h3>
            </div>
            <p className="service-card__text">
              I craft intuitive interfaces for web and mobile, optimizing user
              journeys and elevating your brand with thoughtful, human-centered
              design.
            </p>
          </article>

          <article className="service-card service-card--media">
            <div className="service-card__head">
              <span className="service-card__icon">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                >
                  <rect
                    x="6"
                    y="3"
                    width="12"
                    height="18"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="17"
                    r="0.8"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <h3 className="service-card__title">Mobile App Development</h3>
            </div>
            <p className="service-card__text">
              Launch polished mobile experiences with smooth performance,
              scalable architecture, and delightful UI across iOS and Android.
            </p>
            <div className="service-card__media-slider">
              <div
                className="service-card__media-track"
                ref={mobileSliderRef}
                data-sets="3"
              >
                <img
                  className="service-card__media-slide"
                  src="assets/projects/elearning.jpg"
                  alt="Mobile app interface preview"
                  loading="lazy"
                />
                <img
                  className="service-card__media-slide"
                  src="assets/projects/image2.png"
                  alt="Mobile app flow preview"
                  loading="lazy"
                />
                <img
                  className="service-card__media-slide"
                  src="assets/projects/elearning.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <img
                  className="service-card__media-slide"
                  src="assets/projects/image2.png"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <img
                  className="service-card__media-slide"
                  src="assets/projects/elearning.jpg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <img
                  className="service-card__media-slide"
                  src="assets/projects/image2.png"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
      <TechMarquee />
    </section>
  );
};

export default About;
