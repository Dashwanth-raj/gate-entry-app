// vite.config.js
import path from "path";
import tailwindcss from "@tailwindcss/vite"; // Import the Tailwind CSS Vite plugin
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Include tailwindcss() in the plugins array
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});