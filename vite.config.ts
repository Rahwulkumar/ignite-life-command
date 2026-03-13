import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunk splitting for vendor libraries
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // UI framework
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
            "framer-motion",
          ],
          // Data fetching
          "vendor-data": ["@tanstack/react-query"],
          // Charts (often large)
          "vendor-charts": ["recharts"],
        },
      },
    },
    // Increase warning limit slightly (still want to be alerted for huge chunks)
    chunkSizeWarningLimit: 600,
  },
});
