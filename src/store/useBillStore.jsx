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
      console.error("Failed to fetch bills:", error);
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
        message: error.response?.data?.message || "Failed to add bill.",
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
        message: error.response?.data?.message || "Failed to update bill.",
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
      return { success: false, message: "Failed to delete bill." };
    }
  },
}));
