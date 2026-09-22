import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Otomatis update jika ada versi web baru
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Mooney - Personal Finance",
        short_name: "Mooney",
        description:
          "Aplikasi manajemen keuangan pribadi yang mudah dan praktis.",
        theme_color: "#5b58ff", // Warna brand (ungu) untuk tema browser
        background_color: "#ffffff", // Warna latar saat splash screen
        display: "standalone", // Menghilangkan URL bar (tampil layaknya aplikasi native)
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Agar bentuk ikon bisa menyesuaikan OS (lingkaran/kotak)
          },
        ],
      },
    }),
    tailwindcss(),
  ],
  darkMode: "class",
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
