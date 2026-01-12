import { gsap } from "gsap";

let isReady = false;

export const initCursor = () => {
  if (isReady) return;

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  const project = document.getElementById("cursor-project");
  if (!dot || !ring) return;

  isReady = true;

  const tracked = [dot, ring];
  if (project) tracked.push(project);
  gsap.set(tracked, { xPercent: -50, yPercent: -50 });

  const moveDotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
  const moveDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
  const moveRingX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
  const moveRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
  const moveProjectX = project
    ? gsap.quickTo(project, "x", { duration: 0.2, ease: "power3.out" })
    : null;
  const moveProjectY = project
    ? gsap.quickTo(project, "y", { duration: 0.2, ease: "power3.out" })
    : null;

  const handleMove = (event) => {
    const { clientX, clientY } = event;
    moveDotX(clientX);
    moveDotY(clientY);
    moveRingX(clientX);
    moveRingY(clientY);
    if (moveProjectX && moveProjectY) {
      moveProjectX(clientX);
      moveProjectY(clientY);
    }
  };

  const handleDown = () => {
    gsap.to(ring, { scale: 0.85, duration: 0.15, ease: "power2.out" });
    gsap.to(dot, { scale: 0.85, duration: 0.15, ease: "power2.out" });
  };

  const handleUp = () => {
    gsap.to(ring, { scale: 1, duration: 0.2, ease: "power2.out" });
    gsap.to(dot, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerdown", handleDown);
  window.addEventListener("pointerup", handleUp);

  if (project) {
    const showProjectCursor = () => {
      gsap.to(project, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to([dot, ring], {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const hideProjectCursor = () => {
      gsap.to(project, {
        autoAlpha: 0,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.inOut",
      });
      gsap.to([dot, ring], {
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const projectSelector =
      ".latest-work__device, .works-page__card, .work-detail__more-card";
    const getProjectTarget = (target) =>
      target && target.closest ? target.closest(projectSelector) : null;

    const handleProjectOver = (event) => {
      if (!getProjectTarget(event.target)) return;
      showProjectCursor();
    };

    const handleProjectOut = (event) => {
      const leftTarget = getProjectTarget(event.target);
      if (!leftTarget) return;
      if (getProjectTarget(event.relatedTarget) === leftTarget) return;
      hideProjectCursor();
    };

    window.addEventListener("pointerover", handleProjectOver);
    window.addEventListener("pointerout", handleProjectOut);
  }

  const interactives = document.querySelectorAll("a, button, .btn-neon, .nav-link");
  interactives.forEach((el) => {
    el.addEventListener("pointerenter", () => {
      gsap.to(ring, {
        scale: 1.45,
        borderColor: "rgba(96, 221, 255, 0.9)",
        boxShadow: "0 0 18px rgba(96, 221, 255, 0.6)",
        duration: 0.2,
        ease: "power2.out",
      });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(122, 87, 219, 0.55)",
        boxShadow: "0 0 14px rgba(122, 87, 219, 0.4)",
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });
};
