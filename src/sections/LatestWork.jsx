import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "../components/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const LatestWork = () => {
  const sectionRef = useRef(null);

  const projects = [
    {
      id: "arjuna",
      title: "Arjuna",
      subtitle: "Personal Portfolio Website for talented design engineer",
      image: "/assets/projects/imag3.png",
    },
    {
      id: "bima",
      title: "Bima",
      subtitle: "Website and branding for AI Automation Company",
      image: "/assets/projects/image.png",
    },
    {
      id: "mandala",
      title: "Mandala",
      subtitle: "Boutique commerce experience for a premium lifestyle brand",
      image: "/assets/projects/image2.png",
    },
  ];

  const list = projects.map((project) => project.title);
  const renderMetaList = (keyPrefix) => (
    <ul className="latest-work__list latest-work__meta-list" aria-label="Project list">
      {list.map((name, idx) => (
        <li
          key={`${keyPrefix}-${name}-${idx}`}
          className={`latest-work__list-item${idx === 0 ? " is-active" : ""}`}
          data-index={idx}
        >
          {name}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      const ctx = gsap.context(() => {
        const frame = section.querySelector(".latest-work__frame");
        const items = gsap.utils.toArray(".latest-work__item", frame);
        if (!frame || items.length === 0) return;

        const metaLayer = frame.querySelector(".latest-work__meta-layer");
        const metaNumber = metaLayer
          ? metaLayer.querySelector(".latest-work__meta-number")
          : null;
        const metaTitle = metaLayer
          ? metaLayer.querySelector(".latest-work__meta-title")
          : null;
        const metaSub = metaLayer
          ? metaLayer.querySelector(".latest-work__meta-sub")
          : null;
        const metaListItems = gsap.utils.toArray(
          ".latest-work__meta-panel .latest-work__list-item",
          frame
        );
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        const motion = { scaleMin: 0.9, scaleMax: 1 };

        const ensureRollNode = (el) => {
          if (!el) return null;
          const currentNodes = el.querySelectorAll(".latest-work__roll-current");
          let current = currentNodes[0] || null;
          if (currentNodes.length > 1) {
            currentNodes.forEach((node, idx) => {
              if (idx > 0) node.remove();
            });
          }
          if (!current) {
            current = document.createElement("span");
            current.className = "latest-work__roll-current";
            current.textContent = el.textContent || "";
            el.textContent = "";
            el.appendChild(current);
          }
          return current;
        };
        const setRollTextInstant = (el, text) => {
          if (!el) return;
          const current = ensureRollNode(el);
          if (!current) return;
          current.textContent = text || "";
          el.querySelectorAll(".latest-work__roll-next").forEach((node) => {
            gsap.killTweensOf(node);
            node.remove();
          });
          gsap.set(current, { clearProps: "opacity,transform" });
          el.style.height = "";
        };
        const setMetaListActive = (activeIndex) => {
          metaListItems.forEach((item) => {
            const itemIndex = Number(item.dataset.index);
            item.classList.toggle("is-active", itemIndex === activeIndex);
          });
        };
        const formatNumber = (n) => (n < 10 ? `0${n}.` : `${n}.`);

        const rollText = (el, text) => {
          if (!el) return;
          if (prefersReduced) {
            setRollTextInstant(el, text);
            return;
          }
          const current = ensureRollNode(el);
          if (!current) return;
          if (current.textContent === text) return;
          el.querySelectorAll(".latest-work__roll-next").forEach((node) => {
            gsap.killTweensOf(node);
            node.remove();
          });
          gsap.set(current, { opacity: 1, yPercent: 0 });

          const next = document.createElement("span");
          next.className = "latest-work__roll-next";
          next.textContent = text || "";
          el.appendChild(next);

          const currentHeight = current.offsetHeight;
          const nextHeight = next.offsetHeight;
          el.style.height = `${Math.max(currentHeight, nextHeight)}px`;

          gsap.killTweensOf([current, next]);
          gsap.set(next, {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            yPercent: 120,
            opacity: 0,
          });
          gsap.to(current, {
            yPercent: -120,
            opacity: 0,
            duration: 0.45,
            ease: "power2.inOut",
          });
          gsap.to(next, {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            onComplete: () => {
              current.remove();
              next.classList.remove("latest-work__roll-next");
              next.classList.add("latest-work__roll-current");
              next.style.position = "";
              next.style.left = "";
              next.style.right = "";
              next.style.top = "";
              next.style.opacity = "";
              next.style.transform = "";
              el.style.height = "";
            },
          });
        };

        let lastIndex = -1;
        const updateMeta = (index, animate = true) => {
          if (index === lastIndex) return;
          const project = projects[index];
          if (!project) return;
          if (animate) {
            rollText(metaNumber, formatNumber(index + 1));
            rollText(metaTitle, project.title);
            rollText(metaSub, project.subtitle);
          } else {
            setRollTextInstant(metaNumber, formatNumber(index + 1));
            setRollTextInstant(metaTitle, project.title);
            setRollTextInstant(metaSub, project.subtitle);
          }
          setMetaListActive(index);
          lastIndex = index;
        };

        updateMeta(0, false);

        items.forEach((item) => {
          const device = item.querySelector(".latest-work__device");
          if (!device) return;
          if (prefersReduced) {
            gsap.set(device, { scale: 1 });
            return;
          }
          gsap.set(device, { scale: motion.scaleMin });
          ScrollTrigger.create({
            trigger: item,
            start: "top 65%",
            end: "bottom 35%",
            onEnter: () =>
              gsap.to(device, {
                scale: motion.scaleMax,
                duration: 0.9,
                ease: "power3.out",
                overwrite: true,
              }),
            onEnterBack: () =>
              gsap.to(device, {
                scale: motion.scaleMax,
                duration: 0.9,
                ease: "power3.out",
                overwrite: true,
              }),
            onLeave: () =>
              gsap.to(device, {
                scale: motion.scaleMin,
                duration: 0.9,
                ease: "power3.inOut",
                overwrite: true,
              }),
            onLeaveBack: () =>
              gsap.to(device, {
                scale: motion.scaleMin,
                duration: 0.9,
                ease: "power3.inOut",
                overwrite: true,
              }),
          });
        });

        items.forEach((item, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => updateMeta(index),
            onEnterBack: () => updateMeta(index),
          });
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="latest-work section-spacing c-space"
      id="latest-work"
    >
      <h2 className="latest-work__heading">Latest work</h2>

      <div className="latest-work__frame">
        {/* Shared meta panel */}
        <div className="latest-work__meta-panel" aria-hidden>
          <div className="latest-work__meta-layer">
            <div className="latest-work__meta-top">
              <div className="latest-work__meta-number latest-work__roll">
                <span className="latest-work__roll-current">01.</span>
              </div>
              {renderMetaList("meta")}
            </div>
            <div className="latest-work__meta-bottom">
              <h3 className="latest-work__meta-title latest-work__roll">
                <span className="latest-work__roll-current">Arjuna</span>
              </h3>
              <p className="latest-work__meta-sub latest-work__roll">
                <span className="latest-work__roll-current">
                  Personal Portfolio Website for talented design engineer
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Preview layers for crossfade/stacking */}
        <div className="latest-work__preview" aria-hidden>
          <div className="latest-work__preview-layer latest-work__preview-layer--active" />
          <div className="latest-work__preview-layer latest-work__preview-layer--incoming" />
        </div>

        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            {...project}
            index={index}
            list={list}
          />
        ))}
      </div>

      <div className="latest-work__cta-row mb-12">
        <div className="item button-parrot" style={{ "--bg-color": "#2c3e50" }}>
          <button type="button" className="btn-pill latest-work__cta-button">
            More projects
            <div className="parrot" aria-hidden="true"></div>
            <div className="parrot" aria-hidden="true"></div>
            <div className="parrot" aria-hidden="true"></div>
            <div className="parrot" aria-hidden="true"></div>
            <div className="parrot" aria-hidden="true"></div>
            <div className="parrot" aria-hidden="true"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestWork;
