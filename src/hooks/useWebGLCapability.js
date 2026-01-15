import { useState, useEffect } from "react";

/**
 * Detects device capabilities to determine if WebGL scenes should be rendered.
 * Considers: motion preferences, data saver mode, device memory, connection speed, and WebGL support.
 * Returns true if the device can handle 3D rendering.
 */
export const useWebGLCapability = () => {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    // Check for motion preferences
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Check for data saver mode
    const saveData =
      typeof navigator !== "undefined" &&
      navigator.connection?.saveData;

    // Check device memory (4GB or less = low memory)
    const lowMemory =
      typeof navigator !== "undefined" &&
      typeof navigator.deviceMemory === "number" &&
      navigator.deviceMemory <= 4;

    // Check for mobile devices
    const isMobile =
      window.matchMedia && window.matchMedia("(max-width: 853px)").matches;

    // Check CPU core count (4 or less = low concurrency)
    const hardwareConcurrency =
      typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined;
    const isLowConcurrency =
      typeof hardwareConcurrency === "number" && hardwareConcurrency <= 4;

    // Check connection speed
    const connectionType =
      typeof navigator !== "undefined" && navigator.connection?.effectiveType
        ? navigator.connection.effectiveType.toLowerCase()
        : "";
    const isSlowConnection = ["slow-2g", "2g", "3g"].includes(connectionType);

    // Check WebGL support
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    const hasWebGL = Boolean(gl);

    // Render only if device has sufficient capabilities
    const shouldRender =
      !prefersReducedMotion &&
      !saveData &&
      !lowMemory &&
      !isMobile &&
      !isSlowConnection &&
      !isLowConcurrency &&
      hasWebGL;

    setCanRender(shouldRender);
  }, []);

  return canRender;
};
