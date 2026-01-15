const isDev = import.meta.env.DEV;
const RESOURCE_WARNING_SIZE = 1_500_000;
const LONG_TASK_THRESHOLD = 50;

const safeWindow = () => (typeof window !== "undefined" ? window : null);
const safePerformance = () =>
  typeof performance !== "undefined" ? performance : null;

const warnAssetSize = (entry) => {
  if (!entry || !entry.name) return;
  const url = entry.name.toLowerCase();
  const monitorExtensions = [".glb", ".gltf", ".ktx", ".ktx2", ".basis"];
  const matches = monitorExtensions.some((extension) => url.endsWith(extension));
  if (!matches) return;

  const size =
    entry.transferSize || entry.encodedBodySize || entry.decodedBodySize || 0;
  if (!size || size < RESOURCE_WARNING_SIZE) return;

  const sizeMb = (size / (1024 * 1024)).toFixed(2);
  console.warn(
    `[Perf Monitor] Large asset detected: ${entry.name} (${sizeMb} MB). ` +
      "Consider optimizing or serving a lower-quality variant."
  );
};

export const initPerformanceMonitoring = () => {
  const win = safeWindow();
  const perf = safePerformance();
  if (!isDev || !win || !perf || typeof PerformanceObserver === "undefined") {
    return () => {};
  }

  const metrics = {
    lcp: 0,
    cls: 0,
    tbt: 0,
  };
  const observers = [];

  const observe = (type, callback) => {
    try {
      const observer = new PerformanceObserver(callback);
      observer.observe({ type, buffered: true });
      observers.push(observer);
    } catch (error) {
      console.warn("[Perf Monitor] Unable to observe", type, error);
    }
  };

  observe("largest-contentful-paint", (list) => {
    for (const entry of list.getEntries()) {
      metrics.lcp = Math.max(metrics.lcp, entry.startTime || entry.renderTime || 0);
    }
  });

  observe("layout-shift", (list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        metrics.cls += entry.value;
      }
    }
  });

  observe("longtask", (list) => {
    for (const entry of list.getEntries()) {
      const blockingTime = Math.max(0, entry.duration - LONG_TASK_THRESHOLD);
      metrics.tbt += blockingTime;
    }
  });

  const handleLoad = () => {
    const formatted = [
      `LCP=${metrics.lcp.toFixed(1)}ms`,
      `CLS=${metrics.cls.toFixed(3)}`,
      `TBT=${metrics.tbt.toFixed(1)}ms`,
    ].join(" · ");
    console.info(`[Perf Monitor] ${formatted}`);

    perf
      .getEntriesByType("resource")
      .forEach((entry) => warnAssetSize(entry));
  };

  win.addEventListener("load", handleLoad, { once: true });

  return () => {
    observers.forEach((observer) => observer.disconnect());
    win.removeEventListener("load", handleLoad);
  };
};
