import { create } from "zustand";
import api from "../lib/axios";

export const useFinanceStore = create((set) => ({
  // 1. Kosongkan semua data dummy menjadi array kosong
  wallets: [],
  categories: [],
  transactions: [],
  savings: [], // Opsional jika fitur ini akan diaktifkan nanti
  isLoading: false,

  // 2. Fungsi untuk mengambil semua data awal dari API
  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      // Mengambil data secara paralel agar lebih cepat
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
      console.error("Gagal mengambil data dari server:", error);
      set({ isLoading: false });
    }
  },

  // 3. Reset data saat logout
  clearData: () =>
    set({
      wallets: [],
      categories: [],
      transactions: [],
    }),

  // --- ACTIONS ---

  // 1. Tambah Dompet
  addWallet: async (walletData) => {
    try {
      const response = await api.post("/wallets", walletData);
      set((state) => ({
        wallets: [...state.wallets, response.data.wallet],
      }));
      return { success: true };
    } catch (error) {
      console.error("Error addWallet:", error);
      return { success: false, message: "Gagal membuat dompet baru" };
    }
  },

  // --- UPDATE DOMPET ---
  updateWallet: async (id, updatedData) => {
    try {
      await api.put(`/wallets/${id}`, updatedData);

      const store = useFinanceStore.getState();
      await store.fetchInitialData();

      return { success: true };
    } catch (error) {
      console.error("Error updateWallet:", error);
      return { success: false, message: "Gagal memperbarui dompet" };
    }
  },

  // --- HAPUS DOMPET ---
  deleteWallet: async (id) => {
    try {
      await api.delete(`/wallets/${id}`);

      const store = useFinanceStore.getState();
      await store.fetchInitialData();

      return { success: true };
    } catch (error) {
      console.error("Error deleteWallet:", error);
      return { success: false, message: "Gagal menghapus dompet" };
    }
  },

  // 2. Tambah Kategori
  addCategory: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      set((state) => ({
        categories: [...state.categories, response.data.category],
      }));
      return { success: true };
    } catch (error) {
      console.error("Error addCategory:", error);
      return { success: false, message: "Gagal membuat kategori" };
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
      return { success: false, message: "Gagal menghapus kategori" };
    }
  },

  // --- UPDATE KATEGORI ---
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
      return { success: false, message: "Gagal memperbarui kategori" };
    }
  },

  // 3. Tambah Transaksi
  addTransaction: async (transactionData) => {
    try {
      const response = await api.post("/transactions", transactionData);
      const newTransaction = response.data.transaction;

      // Update state: Tambahkan transaksi ke list & sesuaikan saldo dompet di Frontend
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
      return { success: false, message: "Gagal mencatat transaksi" };
    }
  },

  // --- HAPUS TRANSAKSI ---
  deleteTransaction: async (id) => {
    try {
      // 1. Kirim perintah hapus ke Laravel
      await api.delete(`/transactions/${id}`);

      // 2. Karena penghapusan transaksi juga mengubah saldo dompet di database,
      // cara paling aman dan akurat adalah menarik ulang data terbaru dari server.
      const store = useFinanceStore.getState();
      await store.fetchInitialData();

      return { success: true };
    } catch (error) {
      console.error("Error deleteTransaction:", error);
      return { success: false, message: "Gagal menghapus transaksi" };
    }
  },

  // --- UPDATE TRANSAKSI ---
  updateTransaction: async (id, updatedData) => {
    try {
      await api.put(`/transactions/${id}`, updatedData);

      // Tarik ulang data agar saldo dompet dan grafik otomatis menyesuaikan
      const store = useFinanceStore.getState();
      await store.fetchInitialData();

      return { success: true };
    } catch (error) {
      console.error("Error updateTransaction:", error);
      return { success: false, message: "Gagal memperbarui transaksi" };
    }
  },

  // --- TRANSFER ---
  transfer: async (transferData) => {
    try {
      // 1. Kirim request ke Laravel
      await api.post("/wallets/transfer", {
        from_wallet_id: transferData.fromWalletId,
        to_wallet_id: transferData.toWalletId,
        amount: transferData.amount,
      });

      // 2. Ambil ulang data dari server untuk memastikan sinkronisasi 100% akurat
      // Karena transfer mengubah 2 dompet dan 1 histori transaksi sekaligus
      const store = useFinanceStore.getState();
      await store.fetchInitialData();

      return { success: true };
    } catch (error) {
      console.error("Error transfer:", error);
      return { success: false, message: "Gagal melakukan transfer" };
    }
  },
}));
