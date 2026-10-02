import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: appRoot,
  base: process.env.VITE_BASE_PATH ?? "/",
  publicDir: fileURLToPath(new URL("../../public", import.meta.url)),
  plugins: [react()],
  server: {
    port: 4175,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] },
  },
  preview: { port: 4175, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
  test: {
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("./tests/setup.ts", import.meta.url))],
    include: ["tests/**/*.test.{ts,tsx}"],
    globals: true,
    css: true,
  },
});
