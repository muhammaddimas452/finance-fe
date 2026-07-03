/* eslint-disable no-unused-vars */
import { create } from "zustand";
import api from "../lib/axios";

export const useBillStore = create((set) => ({
  bills: [],
  isLoading: false,
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
  deleteBill: async (id) => {
    try {
      await api.delete(`/bills/${id}`);
      set((state) => ({
        bills: state.bills.filter((bill) => bill.id !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: "Gagal menghapus tagihan." };
    }
  },
}));
