import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LatestWorkPricing = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const left = section.querySelector(".latest-work__pricing-left");
      const accents = gsap.utils.toArray(
        ".latest-work__pricing-toggle, .latest-work__pricing-bespoke",
        section
      );
      const cards = gsap.utils.toArray(".pricing-card", section);

      gsap.set([left, ...accents], {
        autoAlpha: 0,
        y: 24,
        filter: "blur(6px)",
      });
      gsap.set(cards, {
        autoAlpha: 0,
        y: 36,
        scale: 0.98,
        filter: "blur(8px)",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 30%",
          },
        })
        .to(left, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
        })
        .to(
          accents,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
          },
          "-=0.35"
        )
        .to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.25"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="latest-work__pricing c-space">
      <div className="latest-work__pricing-left">
        <h3 className="latest-work__pricing-title">Pricing</h3>
        <p className="latest-work__pricing-copy">
          From launch to scale, we&apos;ve got you covered at every stage.
        </p>
        <div
          className="latest-work__pricing-toggle"
          role="group"
          aria-label="Billing period"
        >
          <button
            type="button"
            className="latest-work__pricing-toggle-btn is-active"
          >
            Monthly
          </button>
          <button type="button" className="latest-work__pricing-toggle-btn">
            Annual
            <span className="latest-work__pricing-discount">-20%</span>
          </button>
        </div>
        <div className="latest-work__pricing-divider" />
        <div className="latest-work__pricing-bespoke">
          <div>
            <h4 className="latest-work__pricing-bespoke-title">Bespoke</h4>
            <p className="latest-work__pricing-bespoke-copy">
              Perfect for specialized needs or early-stage projects.
            </p>
          </div>
          <button type="button" className="latest-work__pricing-contact">
            Contact us
          </button>
        </div>
      </div>

      <div className="latest-work__pricing-grid">
        <article className="pricing-card">
          <header className="pricing-card__header">
            <div>
              <h4 className="pricing-card__title">Starter</h4>
              <p className="pricing-card__subtitle">
                Perfect for solo founders and early stage brands.
              </p>
            </div>
          </header>
          <div className="pricing-card__divider" />
          <ul className="pricing-card__features">
            <li>1 Senior designer</li>
            <li>72 hours turnaround time</li>
            <li>One request at a time</li>
            <li>Pause or cancel anytime</li>
            <li>Up to 40 hours per month</li>
            <li>Async communication</li>
          </ul>
          <div className="pricing-card__price">
            <span className="pricing-card__price-currency">$</span>
            <span className="pricing-card__price-value">5999</span>
            <span className="pricing-card__price-period">/mo</span>
          </div>
          <button type="button" className="pricing-card__cta">
            Book this package
          </button>
        </article>

        <article className="pricing-card pricing-card--featured">
          <header className="pricing-card__header">
            <div>
              <h4 className="pricing-card__title">Growth</h4>
              <p className="pricing-card__subtitle">
                Perfect for scaling businesses ready to go deeper.
              </p>
            </div>
            <span className="pricing-card__tag">Popular</span>
          </header>
          <div className="pricing-card__divider" />
          <ul className="pricing-card__features">
            <li>2 Senior designers</li>
            <li>48 hours turnaround time</li>
            <li>Two requests at a time</li>
            <li>Pause or cancel anytime</li>
            <li>Up to 70 hours per month</li>
            <li>Async communication</li>
          </ul>
          <div className="pricing-card__price">
            <span className="pricing-card__price-currency">$</span>
            <span className="pricing-card__price-value">8999</span>
            <span className="pricing-card__price-period">/mo</span>
          </div>
          <button type="button" className="pricing-card__cta">
            Book this package
          </button>
        </article>
      </div>
    </div>
  );
};

export default LatestWorkPricing;
