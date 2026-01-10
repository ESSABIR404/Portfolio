import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: "Work", href: "#latest-work" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "404", href: "#" },
];

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/ali-sanati/" },
  { label: "Instagram", href: "https://www.instagram.com/ali.sanatidev/reels/" },
  { label: "Dribbble", href: "#" },
];

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const top = footer.querySelector(".site-footer__top");
      const lists = gsap.utils.toArray(".site-footer__list a", footer);
      const email = footer.querySelector(".site-footer__email");
      const wordmark = footer.querySelector(".site-footer__wordmark");
      const services = gsap.utils.toArray(".site-footer__services p", footer);
      const meta = footer.querySelector(".site-footer__meta");

      gsap.set([top, email], { autoAlpha: 0, y: 24, filter: "blur(6px)" });
      gsap.set(lists, { autoAlpha: 0, y: 12 });
      gsap.set(wordmark, { autoAlpha: 0, y: 36, scale: 0.98 });
      gsap.set(services, { autoAlpha: 0, x: 24 });
      gsap.set(meta, { autoAlpha: 0, y: 12 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            end: "bottom 40%",
          },
        })
        .to(top, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
        })
        .to(
          lists,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.04,
          },
          "-=0.4"
        )
        .to(
          email,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.35"
        )
        .to(
          wordmark,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .to(
          services,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
          },
          "-=0.4"
        )
        .to(
          meta,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.25"
        );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="site-footer__inner c-space">
        <div className="site-footer__top">
          <div className="site-footer__col site-footer__col--links">
            <img
              src="assets/logos/EssabirLogo.svg"
              alt="Essabir logo"
              className="site-footer__logo"
            />
            <nav className="site-footer__list">
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="site-footer__col">
            <p className="site-footer__kicker">Social</p>
            <div className="site-footer__list">
              {socialLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(isExternal
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="site-footer__col site-footer__col--contact">
            <p className="site-footer__kicker">Reach out anytime</p>
            <a className="site-footer__email" href="mailto:hello@essabir.com">
              hello@essabir.com
            </a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div>
            <p className="site-footer__wordmark">
              Essabir<span>.</span>
            </p>
            <p className="site-footer__copy">
              © 2025 Yassine Essabir. All rights reserved.
            </p>
          </div>

          <div className="site-footer__services">
            <p className="is-active">Branding</p>
            <p>Application</p>
            <p>Website</p>
          </div>
        </div>

        <div className="site-footer__meta">
          <span>Made with love by Essabir</span>
          <span>Based in Morocco</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
