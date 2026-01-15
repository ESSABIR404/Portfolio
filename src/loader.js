import { gsap } from "gsap";

// Forked from Blake Bowen's shape overlays:
// https://codepen.io/osublake/pen/BYwgBg (adapted for GSAP loader + auto control)

const OVERLAY_SELECTOR = ".shape-overlays";
const PATH_SELECTOR = ".shape-overlays__path";
const TITLE_SELECTOR = ".loader-title";

const NUM_POINTS = 10;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;
const DURATION = 0.9;

let overlay;
let paths;
let title;
let numPaths;
let isOpened = true;
let isClosed = false;
let introPrepared = false;
let pointsDelay = [];
let allPoints = [];
let prefersReducedMotion = false;

const tl = gsap.timeline({
  onUpdate: render,
  defaults: { ease: "power2.inOut", duration: DURATION },
});

function getIntroTargets() {
  const nav = document.querySelector(".js-navbar");
  const navItems = gsap.utils.toArray(".js-nav-item");
  const heroItems = gsap.utils.toArray(".js-hero-item");
  return { nav, navItems, heroItems };
}

function prepIntroAnimations() {
  if (prefersReducedMotion) return;
  if (introPrepared) return;
  const { nav, navItems, heroItems } = getIntroTargets();
  const hasTargets = nav || navItems.length || heroItems.length;
  if (!hasTargets) return;

  if (nav) {
    gsap.set(nav, { autoAlpha: 0, y: -24, filter: "blur(6px)" });
  }
  if (navItems.length) {
    gsap.set(navItems, { autoAlpha: 0, y: -10, filter: "blur(4px)" });
  }
  if (heroItems.length) {
    gsap.set(heroItems, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
  }
  introPrepared = true;
}

function revealIntroImmediate() {
  const { nav, navItems, heroItems } = getIntroTargets();
  if (nav) {
    gsap.set(nav, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
  }
  if (navItems.length) {
    gsap.set(navItems, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
  }
  if (heroItems.length) {
    gsap.set(heroItems, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
  }
  introPrepared = true;
}

function playIntroAnimations() {
  if (prefersReducedMotion) {
    revealIntroImmediate();
    return;
  }
  const { nav, navItems, heroItems } = getIntroTargets();
  const tlIntro = gsap.timeline({
    defaults: { ease: "power2.out", duration: 0.85 },
  });

  if (nav) {
    tlIntro.to(nav, { autoAlpha: 1, y: 0, filter: "blur(0px)" }, 0.05);
  }
  if (navItems.length) {
    tlIntro.to(
      navItems,
      { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.08 },
      0.15
    );
  }
  if (heroItems.length) {
    tlIntro.to(
      heroItems,
      { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.12 },
      0.25
    );
  }
}

function initPoints() {
  allPoints = [];
  for (let i = 0; i < numPaths; i += 1) {
    const points = [];
    for (let j = 0; j < NUM_POINTS; j += 1) {
      points.push(100);
    }
    allPoints.push(points);
  }
}

function render() {
  for (let i = 0; i < numPaths; i += 1) {
    const path = paths[i];
    const points = allPoints[i];
    let d = "";

    d += isOpened ? `M 0 0 V ${points[0]} C` : `M 0 ${points[0]} C`;
    for (let j = 0; j < NUM_POINTS - 1; j += 1) {
      const p = ((j + 1) / (NUM_POINTS - 1)) * 100;
      const cp = p - (100 / (NUM_POINTS - 1)) / 2;
      d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
    }
    d += isOpened ? " V 100 H 0" : " V 0 H 0";
    path.setAttribute("d", d);
  }
}

function animateOverlay(open) {
  isOpened = open;
  tl.progress(0).clear();

  for (let i = 0; i < NUM_POINTS; i += 1) {
    pointsDelay[i] = Math.random() * DELAY_POINTS_MAX;
  }

  for (let i = 0; i < numPaths; i += 1) {
    const points = allPoints[i];
    const pathDelay = DELAY_PER_PATH * (open ? i : numPaths - i - 1);

    for (let j = 0; j < NUM_POINTS; j += 1) {
      const delay = pointsDelay[j] + pathDelay;
      tl.to(points, { [j]: 0 }, delay);
    }
  }

  if (open) {
    tl.eventCallback("onComplete", null);
  } else {
    tl.eventCallback("onComplete", () => {
      overlay.setAttribute("aria-hidden", "true");
      overlay.style.display = "none";
      playIntroAnimations();
    });
  }
}

export const initOverlayLoader = () => {
  overlay = document.querySelector(OVERLAY_SELECTOR);
  if (!overlay) return;

  paths = Array.from(overlay.querySelectorAll(PATH_SELECTOR));
  if (!paths.length) return;

  title = document.querySelector(TITLE_SELECTOR);

  prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  numPaths = paths.length;
  isClosed = false;
  overlay.style.display = "block";
  overlay.setAttribute("aria-hidden", "false");
  if (title) {
    title.classList.remove("is-hidden");
    title.style.display = "flex";
    title.setAttribute("aria-hidden", "false");
  }

  if (prefersReducedMotion) {
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.display = "none";
    if (title) {
      title.classList.add("is-hidden");
      title.style.display = "none";
      title.setAttribute("aria-hidden", "true");
    }
    revealIntroImmediate();
    isClosed = true;
    return;
  }

  prepIntroAnimations();

  initPoints();
  render();
  animateOverlay(true);
};

export const closeOverlayLoader = () => {
  if (!overlay || isClosed) return;
  isClosed = true;

  if (title) {
    gsap.to(title, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        title.classList.add("is-hidden");
        title.style.display = "none";
        title.setAttribute("aria-hidden", "true");
      },
    });
  }

  prepIntroAnimations();

  initPoints();
  render();
  animateOverlay(false);
};
