import { create } from "zustand";
import api from "../lib/axios";

export const useAuthStore = create((set) => ({
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
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    }
  },
  updateProfile: async (formData) => {
    try {
      const response = await api.post("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedUser = {
        ...useAuthStore.getState().user,
        ...response.data.user,
      };
      set({ user: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal memperbarui profil.",
      };
    }
  },
}));
