import { create } from "zustand";
import api from "../lib/axios";

export const useBillStore = create((set) => ({
  bills: [],
  isLoading: false,

  // 1. Ambil semua data tagihan
  fetchBills: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/bills");
      set({ bills: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Gagal mengambil data tagihan:", error);
      set({ isLoading: false });
    }
  },

  // 2. Tambah tagihan baru
  addBill: async (billData) => {
    try {
      const response = await api.post("/bills", billData);
      set((state) => ({ bills: [...state.bills, response.data.data] }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal menambah tagihan.",
      };
    }
  },

  // 3. Edit tagihan (termasuk mengubah status is_paid)
  updateBill: async (id, billData) => {
    try {
      const response = await api.put(`/bills/${id}`, billData);
      set((state) => ({
        bills: state.bills.map((bill) =>
          bill.id === id ? response.data.data : bill,
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal mengubah tagihan.",
      };
    }
  },

  // 4. Hapus tagihan
  deleteBill: async (id) => {
    try {
      await api.delete(`/bills/${id}`);
      set((state) => ({
        bills: state.bills.filter((bill) => bill.id !== id),
      }));
      return { success: true };
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return { success: false, message: "Gagal menghapus tagihan." };
    }
  },
}));
