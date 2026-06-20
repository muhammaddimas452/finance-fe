import { create } from "zustand";
import api from "../lib/axios";

export const useAuthStore = create((set) => ({
  // Cek apakah ada data user di localStorage saat aplikasi pertama kali dimuat
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("auth_token"),

  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const { user, token } = response.data;

      // Simpan token dan data user ke localStorage agar tidak hilang saat di-refresh
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat login";
      return { success: false, message };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await api.post("/register", { name, email, password });
      const { user, token } = response.data;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat mendaftar";
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      // Beritahu backend untuk menghapus token
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Selalu bersihkan state dan localStorage, terlepas backend merespons atau tidak
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    }
  },
}));
