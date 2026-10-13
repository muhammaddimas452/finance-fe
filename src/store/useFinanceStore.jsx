import { create } from "zustand";
import api from "../lib/axios";

export const useFinanceStore = create((set) => ({
  wallets: [],
  categories: [],
  transactions: [],
  isLoading: false,
  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const [walletsRes, categoriesRes, transactionsRes] = await Promise.all([
        api.get("/wallets"),
        api.get("/categories"),
        api.get("/transactions"),
      ]);

      set({
        wallets: walletsRes.data,
        categories: categoriesRes.data,
        transactions: transactionsRes.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch data from server:", error);
      set({ isLoading: false });
    }
  },
  setPrimaryWallet: async (walletId) => {
    try {
      const response = await api.patch(`/wallets/${walletId}/set-primary`);
      set({ wallets: response.data.wallets });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to set primary wallet.",
      };
    }
  },
  clearData: () =>
    set({
      wallets: [],
      categories: [],
      transactions: [],
    }),
  // --- ACTIONS ---
  addWallet: async (walletData) => {
    try {
      const response = await api.post("/wallets", walletData);
      set((state) => ({
        wallets: [...state.wallets, response.data.wallet],
      }));
      return { success: true };
    } catch (error) {
      console.error("Error addWallet:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create wallet",
      };
    }
  },
  updateWallet: async (id, updatedData) => {
    try {
      await api.put(`/wallets/${id}`, updatedData);

      const store = useFinanceStore.getState();
      await store.fetchInitialData();

      return { success: true };
    } catch (error) {
      console.error("Error updateWallet:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update wallet",
      };
    }
  },
  deleteWallet: async (id) => {
    try {
      await api.delete(`/wallets/${id}`);

      const store = useFinanceStore.getState();
      await store.fetchInitialData();

      return { success: true };
    } catch (error) {
      console.error("Error deleteWallet:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete wallet",
      };
    }
  },
  addCategory: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      set((state) => ({
        categories: [...state.categories, response.data.category],
      }));
      return { success: true };
    } catch (error) {
      console.error("Error addCategory:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create category",
      };
    }
  },
  deleteCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
      return { success: true };
    } catch (error) {
      console.error("Error deleteCategory:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete category",
      };
    }
  },
  updateCategory: async (id, updatedData) => {
    try {
      const response = await api.put(`/categories/${id}`, updatedData);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? response.data.category : c,
        ),
      }));
      return { success: true };
    } catch (error) {
      console.error("Error updateCategory:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update category",
      };
    }
  },
  addTransaction: async (transactionData) => {
    try {
      const response = await api.post("/transactions", transactionData);
      const newTransaction = response.data.transaction;
      set((state) => {
        const updatedWallets = state.wallets.map((w) => {
          if (w.id === parseInt(newTransaction.wallet_id)) {
            const amount = parseFloat(newTransaction.amount);
            return {
              ...w,
              balance:
                newTransaction.type === "income"
                  ? parseFloat(w.balance) + amount
                  : parseFloat(w.balance) - amount,
            };
          }
          return w;
        });

        return {
          transactions: [newTransaction, ...state.transactions],
          wallets: updatedWallets,
        };
      });
      return { success: true };
    } catch (error) {
      console.error("Error addTransaction:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to record transaction",
      };
    }
  },
  deleteTransaction: async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      const store = useFinanceStore.getState();
      await store.fetchInitialData();
      return { success: true };
    } catch (error) {
      console.error("Error deleteTransaction:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete transaction",
      };
    }
  },
  updateTransaction: async (id, updatedData) => {
    try {
      await api.put(`/transactions/${id}`, updatedData);
      const store = useFinanceStore.getState();
      await store.fetchInitialData();
      return { success: true };
    } catch (error) {
      console.error("Error updateTransaction:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update transaction",
      };
    }
  },
  transfer: async (transferData) => {
    try {
      await api.post("/wallets/transfer", {
        from_wallet_id: transferData.fromWalletId,
        to_wallet_id: transferData.toWalletId,
        amount: transferData.amount,
      });
      const store = useFinanceStore.getState();
      await store.fetchInitialData();
      return { success: true };
    } catch (error) {
      console.error("Error transfer:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to execute transfer",
      };
    }
  },
}));
