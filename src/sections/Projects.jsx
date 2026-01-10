import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Project from "../components/Project";
import { myProjects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    // Desktop-only pinning for cinematic storytelling without breaking mobile flow.
    mm.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          const frame = section.querySelector(".projects-frame");
          const rows = gsap.utils.toArray(".project-row", section);
          if (!frame || rows.length === 0) return;

          // Calm 3D values: enough depth to feel premium without aggressive rotation.
          const motion = {
            scaleMin: 0.94,
            scaleMax: 1,
            rotateXExit: 16,
            rotateXEnter: -12,
            rotateYBase: -4,
            rotateYExit: -8,
            zEnter: 120,
            zExit: -160,
            yExit: 80,
            yEnter: -70,
            infoShift: 18,
          };

          const ease = gsap.parseEase("power2.inOut");
          const clamp01 = gsap.utils.clamp(0, 1);
          const lerp = gsap.utils.interpolate;

          const syncFrameHeight = () => {
            frame.classList.remove("projects-frame--stacked");
            frame.style.minHeight = "";
            const maxHeight = Math.max(
              ...rows.map((row) => row.getBoundingClientRect().height)
            );
            if (Number.isFinite(maxHeight) && maxHeight > 0) {
              frame.style.minHeight = `${maxHeight}px`;
            }
            frame.classList.add("projects-frame--stacked");
          };

          syncFrameHeight();
          window.addEventListener("resize", syncFrameHeight);

          frame.classList.add("projects-frame--stacked");
          gsap.set(rows, { autoAlpha: 0, pointerEvents: "none" });

          const setters = rows.map((row) => {
            const card = row.querySelector(".project-card");
            const info = row.querySelector(".project-info");
            return {
              row,
              opacity: gsap.quickSetter(row, "opacity"),
              z: gsap.quickSetter(row, "zIndex"),
              visibility: (value) => {
                row.style.visibility = value ? "visible" : "hidden";
              },
              pointer: (value) => {
                row.style.pointerEvents = value ? "auto" : "none";
              },
              cardScale: card ? gsap.quickSetter(card, "scale") : null,
              cardRotateX: card ? gsap.quickSetter(card, "rotateX") : null,
              cardRotateY: card ? gsap.quickSetter(card, "rotateY") : null,
              cardZ: card ? gsap.quickSetter(card, "z", "px") : null,
              cardY: card ? gsap.quickSetter(card, "y", "px") : null,
              infoY: info ? gsap.quickSetter(info, "y", "px") : null,
            };
          });

          const setInitial = () => {
            setters.forEach((set, idx) => {
              const isActive = idx === 0;
              set.opacity(isActive ? 1 : 0);
              set.visibility(isActive);
              set.pointer(isActive);
              set.z(isActive ? 3 : 1);
              if (set.cardScale)
                set.cardScale(isActive ? motion.scaleMax : motion.scaleMin);
              if (set.cardRotateX) set.cardRotateX(0);
              if (set.cardRotateY) set.cardRotateY(motion.rotateYBase);
              if (set.cardZ) set.cardZ(motion.zEnter);
              if (set.cardY) set.cardY(0);
              if (set.infoY) set.infoY(0);
            });
          };

          const update = (progress) => {
            const total = rows.length;
            const totalProgress = progress * (total - 1);
            const index = Math.min(total - 1, Math.floor(totalProgress));
            const local = totalProgress - index;
            const switchPoint = 0.52;
            const outT = ease(clamp01(local / switchPoint));
            const inT = ease(clamp01((local - switchPoint) / (1 - switchPoint)));

            setters.forEach((set) => {
              set.opacity(0);
              set.visibility(false);
              set.pointer(false);
              set.z(1);
              if (set.cardScale) set.cardScale(motion.scaleMin);
              if (set.cardRotateX) set.cardRotateX(motion.rotateXExit);
              if (set.cardRotateY) set.cardRotateY(motion.rotateYExit);
              if (set.cardZ) set.cardZ(motion.zExit);
              if (set.cardY) set.cardY(motion.yExit);
              if (set.infoY) set.infoY(motion.infoShift);
            });

            // Active project eases out while the next one eases in.
            const active = setters[index];
            if (active) {
              const activeOpacity = 1 - outT;
              active.opacity(activeOpacity);
              active.visibility(activeOpacity > 0.02);
              active.pointer(activeOpacity > 0.6);
              active.z(3);
              if (active.cardScale)
                active.cardScale(lerp(motion.scaleMax, motion.scaleMin, outT));
              if (active.cardRotateX)
                active.cardRotateX(lerp(0, motion.rotateXExit, outT));
              if (active.cardRotateY)
                active.cardRotateY(
                  lerp(motion.rotateYBase, motion.rotateYExit, outT)
                );
              if (active.cardZ)
                active.cardZ(lerp(motion.zEnter, motion.zExit, outT));
              if (active.cardY) active.cardY(lerp(0, motion.yExit, outT));
              if (active.infoY) active.infoY(lerp(0, motion.infoShift, outT));
            }

            const incoming = setters[index + 1];
            if (incoming) {
              incoming.opacity(inT);
              incoming.visibility(inT > 0.02);
              incoming.pointer(inT > 0.6);
              incoming.z(2);
              if (incoming.cardScale)
                incoming.cardScale(
                  lerp(motion.scaleMin, motion.scaleMax, inT)
                );
              if (incoming.cardRotateX)
                incoming.cardRotateX(lerp(motion.rotateXEnter, 0, inT));
              if (incoming.cardRotateY)
                incoming.cardRotateY(
                  lerp(motion.rotateYExit, motion.rotateYBase, inT)
                );
              if (incoming.cardZ)
                incoming.cardZ(lerp(motion.zExit, motion.zEnter, inT));
              if (incoming.cardY) incoming.cardY(lerp(motion.yEnter, 0, inT));
              if (incoming.infoY)
                incoming.infoY(lerp(-motion.infoShift, 0, inT));
            }
          };

          setInitial();
          update(0);

          ScrollTrigger.create({
            trigger: frame,
            start: "top 20%",
            end: () => `+=${rows.length * window.innerHeight * 0.85}`,
            scrub: 0.85,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => update(self.progress),
          });

          return () => {
            window.removeEventListener("resize", syncFrameHeight);
            frame.classList.remove("projects-frame--stacked");
          };
        }, section);

        return () => ctx.revert();
      }
    );

    mm.add("(max-width: 900px), (prefers-reduced-motion: reduce)", () => {
      const frame = section.querySelector(".projects-frame");
      if (frame) frame.classList.remove("projects-frame--stacked");
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="projects-section c-space section-spacing"
      id="projects"
    >
      <div className="projects-header">
        <h2 className="projects-title">My Selected Projects</h2>
        <p className="projects-subtitle">
          A curated set of builds that showcase system design, product thinking,
          and premium execution across web and mobile.
        </p>
      </div>

      <div className="projects-frame">
        {myProjects.slice(0, 3).map((project, index, visible) => (
          <Project
            key={project.id}
            {...project}
            index={index}
            titles={visible.map((item) => item.title)}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
