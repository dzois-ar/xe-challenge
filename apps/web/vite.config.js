import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Ό,τι ξεκινάει με /api θα πηγαίνει στο Express backend
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});

