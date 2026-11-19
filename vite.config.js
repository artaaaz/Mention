import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    // three.js dimuat terpisah (lazy) hanya di beranda
    chunkSizeWarningLimit: 700,
  },
});
