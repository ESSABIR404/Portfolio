import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pricingOptions = {
  single: { starter: 999, growth: 2000 },
  double: { starter: 1600, growth: 3200 },
};

const LatestWorkPricing = () => {
  const sectionRef = useRef(null);
  const starterPriceRef = useRef(null);
  const growthPriceRef = useRef(null);
  const priceTweensRef = useRef({ starter: null, growth: null });
  const hasUserInteracted = useRef(false);
  const [pricingMode, setPricingMode] = useState("single");

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
      const cardHeaders = gsap.utils.toArray(".pricing-card__header", section);
      const cardFeatures = gsap.utils.toArray(
        ".pricing-card__features li",
        section
      );
      const cardPrices = gsap.utils.toArray(".pricing-card__price", section);
      const cardCtas = gsap.utils.toArray(".pricing-card__cta", section);

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
        )
        .from(
          cardHeaders,
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
          },
          "-=0.45"
        )
        .from(
          cardFeatures,
          {
            autoAlpha: 0,
            x: -12,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.02,
          },
          "-=0.5"
        )
        .from(
          cardPrices,
          {
            autoAlpha: 0,
            y: 12,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.45"
        )
        .from(
          cardCtas,
          {
            autoAlpha: 0,
            y: 12,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.4"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const starterEl = starterPriceRef.current;
    const growthEl = growthPriceRef.current;
    if (!starterEl || !growthEl) return;

    const targetPricing = pricingOptions[pricingMode];
    if (!targetPricing) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clearTweens = () => {
      if (priceTweensRef.current.starter) {
        priceTweensRef.current.starter.kill();
        priceTweensRef.current.starter = null;
      }
      if (priceTweensRef.current.growth) {
        priceTweensRef.current.growth.kill();
        priceTweensRef.current.growth = null;
      }
    };

    if (!hasUserInteracted.current || prefersReduced) {
      clearTweens();
      starterEl.textContent = String(targetPricing.starter);
      growthEl.textContent = String(targetPricing.growth);
      return;
    }

    const animatePrice = (key, element, value) => {
      if (priceTweensRef.current[key]) {
        priceTweensRef.current[key].kill();
        priceTweensRef.current[key] = null;
      }

      const currentValue = Number(
        String(element.textContent || "").replace(/[^\d]/g, "")
      );
      const proxy = { value: Number.isNaN(currentValue) ? 0 : currentValue };

      const tl = gsap
        .timeline()
        .to(proxy, {
          value,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            element.textContent = Math.round(proxy.value).toString();
          },
        })
        .fromTo(
          element,
          { yPercent: -18, opacity: 0.7 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          0
        );

      priceTweensRef.current[key] = tl;
    };

    animatePrice("starter", starterEl, targetPricing.starter);
    animatePrice("growth", growthEl, targetPricing.growth);

    return () => clearTweens();
  }, [pricingMode]);

  const handlePricingChange = (nextMode) => {
    if (nextMode === pricingMode) return;
    hasUserInteracted.current = true;
    setPricingMode(nextMode);
  };

  return (
    <div ref={sectionRef} className="latest-work__pricing px-32 lg:px-48">
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
            className={`latest-work__pricing-toggle-btn ${
              pricingMode === "single" ? "is-active" : ""
            }`}
            aria-pressed={pricingMode === "single"}
            onClick={() => handlePricingChange("single")}
          >
            projects
          </button>
          <button
            type="button"
            className={`latest-work__pricing-toggle-btn ${
              pricingMode === "double" ? "is-active" : ""
            }`}
            aria-pressed={pricingMode === "double"}
            onClick={() => handlePricingChange("double")}
          >
            2 projects
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
            <li>Premium Template Design</li>
            <li>Up to 3 Pages</li>
            <li>2 Rounds of Revisions</li>
            <li>Basic SEO Setup (To get you found on Google)</li>
            <li>Fully Responsive (Mobile, Tablet & Desktop)</li>
            <li>Email Support</li>
          </ul>
          <div className="pricing-card__price">
            <span className="pricing-card__price-currency">$</span>
            <span
              ref={starterPriceRef}
              className="pricing-card__price-value"
            >
              999
            </span>
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
            <li>100% Custom Design</li>
            <li>5 Pages</li>
            <li>3 Rounds of Revisions</li>
            <li>Technical SEO & Speed Optimization</li>
            <li>Fully Responsive (Mobile, Tablet & Large Screens)</li>
            <li>Advanced Animations & Interactions</li>
            <li>Complex Functionality (CMS, Integrations)</li>
            <li>WhatsApp & Email Support</li>
          </ul>
          <div className="pricing-card__price">
            <span className="pricing-card__price-currency">$</span>
            <span ref={growthPriceRef} className="pricing-card__price-value">
              2000
            </span>
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
