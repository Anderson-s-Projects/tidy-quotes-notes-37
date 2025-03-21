import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path"; // Ensure Node.js compatibility
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: mode === "production" ? "/tidy-quotes-notes-37/" : "/",
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean), // Remove duplicates
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
}));
