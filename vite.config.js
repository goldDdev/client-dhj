import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  define: {
    "process.env": import.meta,
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@urls": path.resolve(__dirname, "./src/url"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@travel": path.resolve(__dirname, "./src/travel"),
    },
  },
});
