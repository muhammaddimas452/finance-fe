import { create } from "zustand";
import api from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("auth_token"),
  isLoading: true,
  login: async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const { user, token } = response.data;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred during login";
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
        error.response?.data?.message || "An error occurred during registration";
      return { success: false, message };
    }
  },

  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
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
        message: error.response?.data?.message || "Failed to update profile.",
      };
    }
  },
  requestPasswordResetLink: async (email) => {
    try {
      const endpoint = email ? "/password/email" : "/password/request-change";
      const payload = email ? { email } : {};
      const response = await api.post(endpoint, payload);
      return {
        success: true,
        message:
          response.data.message ||
          "Password reset verification link successfully sent to email.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to send password reset link.",
      };
    }
  },
  resetPasswordWithToken: async ({
    token,
    email,
    password,
    password_confirmation,
  }) => {
    try {
      const response = await api.post("/password/reset", {
        token,
        email,
        password,
        password_confirmation,
      });
      return {
        success: true,
        message:
          response.data.message || "Password updated successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update password.",
      };
    }
  },
  refreshUser: async () => {
    try {
      const response = await api.get("/user");
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return user;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      return null;
    }
  },
  connectGmail: async () => {
    try {
      const response = await api.get("/auth/google/redirect");
      if (response.data?.url) {
        window.location.href = response.data.url;
        return { success: true };
      }
      return { success: false, message: "URL otorisasi Google tidak ditemukan." };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Gagal menghubungkan ke server Google.",
      };
    }
  },
  syncGmail: async () => {
    try {
      const response = await api.post("/gmail/sync");
      // Refresh user profile for updated last_synced_at
      try {
        const userRes = await api.get("/user");
        if (userRes.data) {
          localStorage.setItem("user", JSON.stringify(userRes.data));
          set({ user: userRes.data });
        }
      } catch (err) {
        console.warn("Failed to refresh user after sync", err);
      }
      return { success: true, ...response.data };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Gagal melakukan sinkronisasi Gmail.",
      };
    }
  },
  disconnectGmail: async () => {
    try {
      const response = await api.post("/gmail/disconnect");
      try {
        const userRes = await api.get("/user");
        if (userRes.data) {
          localStorage.setItem("user", JSON.stringify(userRes.data));
          set({ user: userRes.data });
        }
      } catch (err) {
        console.warn("Failed to refresh user after disconnect", err);
      }
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Gagal memutuskan koneksi Gmail.",
      };
    }
  },
  testParseEmail: async ({ subject, body, from }) => {
    try {
      const response = await api.post("/gmail/test-parse", { subject, body, from });
      return { success: true, data: response.data.parsed };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Format email tidak berhasil dikenali.",
      };
    }
  },
}));
