import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    // Match Next/Turbopack: plain `*.svg` imports are React components (not asset URLs).
    svgr({ include: "**/*.svg" }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
    // App-level React Strict Mode: next.config.ts → reactStrictMode (not wrapped in test trees).
  },
});
