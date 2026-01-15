import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: [
            "three",
            "@react-three/fiber",
            "@react-three/drei",
            "three-stdlib",
            "maath",
          ],
          gsap: ["gsap"],
        },
      },
      onwarn(warning, warn) {
        if (warning.code === "EVAL" && warning.id?.includes("three-stdlib")) {
          return;
        }
        warn(warning);
      },
    },
  },
});
