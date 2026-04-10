import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "https://github.com/muhammaddimas452/finance-fe",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f0ff",
          100: "#e0e0ff",
          500: "#5b58ff", // Warna ungu kebiruan utama
          600: "#4a47e6",
        },
        background: "#f4f5f9", // Warna background luar yang sangat soft
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0,0,0,0.05)", // Shadow lembut untuk card
      },
    },
  },
});
