import { create } from "zustand";

export const useFinanceStore = create((set) => ({
  // Data Awal (Dummy untuk pengembangan)
  wallets: [
    { id: 1, name: "Tunai", balance: 500000, icon: "Wallet" },
    { id: 2, name: "Bank BCA", balance: 15250000, icon: "CreditCard" },
    { id: 3, name: "GoPay", balance: 750000, icon: "Smartphone" },
  ],

  categories: [
    { id: 1, name: "Makanan", type: "expense", icon: "Utensils" },
    { id: 2, name: "Gaji", type: "income", icon: "Banknote" },
    { id: 3, name: "Transportasi", type: "expense", icon: "Car" },
    { id: 4, name: "Hiburan", type: "expense", icon: "Gamepad" },
    { id: 5, name: "Penginapan", type: "expense", icon: "House" },
    { id: 6, name: "Pendidikan", type: "expense", icon: "Book" },
  ],

  transactions: [
    {
      id: 1,
      title: "Makan Siang Bakso",
      amount: 25000,
      type: "expense",
      category: "Makanan",
      walletId: 1,
      date: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Gaji Pokok",
      amount: 8000000,
      type: "income",
      category: "Gaji",
      walletId: 2,
      date: new Date().toISOString(),
    },
  ],

  // Tambahkan di dalam useFinanceStore.js
  budgets: [
    { id: 1, categoryId: 1, limit: 1500000 }, // Contoh: Makanan limit 1.5jt
    { id: 2, categoryId: 3, limit: 500000 }, // Contoh: Transport limit 500rb
  ],

  // --- ACTIONS ---

  // Menambah Transaksi Baru
  addTransaction: (newTransaction) =>
    set((state) => {
      const updatedTransactions = [
        { ...newTransaction, id: Date.now(), date: new Date().toISOString() },
        ...state.transactions,
      ];

      // Update Saldo Dompet Otomatis
      const updatedWallets = state.wallets.map((wallet) => {
        if (wallet.id === newTransaction.walletId) {
          return {
            ...wallet,
            balance:
              newTransaction.type === "income"
                ? wallet.balance + newTransaction.amount
                : wallet.balance - newTransaction.amount,
          };
        }
        return wallet;
      });

      return {
        transactions: updatedTransactions,
        wallets: updatedWallets,
      };
    }),

  // Menghapus Transaksi
  deleteTransaction: (id) =>
    set((state) => {
      const transactionToDelete = state.transactions.find((t) => t.id === id);
      if (!transactionToDelete) return state;

      // Update Saldo Dompet Otomatis
      const updatedWallets = state.wallets.map((wallet) => {
        if (wallet.id === transactionToDelete.walletId) {
          return {
            ...wallet,
            balance:
              transactionToDelete.type === "income"
                ? wallet.balance - transactionToDelete.amount
                : wallet.balance + transactionToDelete.amount,
          };
        }
        return wallet;
      });

      return {
        transactions: state.transactions.filter((t) => t.id !== id),
        wallets: updatedWallets,
      };
    }),

  // Action untuk mengatur budget
  setBudget: (categoryId, limit) =>
    set((state) => {
      const existingBudget = state.budgets.find(
        (b) => b.categoryId === categoryId,
      );
      if (existingBudget) {
        return {
          budgets: state.budgets.map((b) =>
            b.categoryId === categoryId ? { ...b, limit } : b,
          ),
        };
      }
      return {
        budgets: [...state.budgets, { id: Date.now(), categoryId, limit }],
      };
    }),

  // Helper untuk mendapatkan persentase penggunaan (bisa dipanggil di komponen)
  getBudgetUsage: (categoryId) => {
    const state = useFinanceStore.getState();
    const budget = state.budgets.find((b) => b.categoryId === categoryId);
    if (!budget) return null;

    const currentMonth = new Date().getMonth();
    const totalSpent = state.transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.date).getMonth() === currentMonth &&
          state.categories.find((c) => c.name === t.category)?.id ===
            categoryId,
      )
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      limit: budget.limit,
      spent: totalSpent,
      percentage: Math.min((totalSpent / budget.limit) * 100, 100),
      isOver: totalSpent > budget.limit,
    };
  },

  // Action untuk melakukan transfer antar dompet
  transfer: (transferData) =>
    set((state) => {
      const { fromWalletId, toWalletId, amount } = transferData;
      const numAmount = parseInt(amount);

      // 1. Update Saldo Dompet
      const updatedWallets = state.wallets.map((wallet) => {
        if (wallet.id === fromWalletId)
          return { ...wallet, balance: wallet.balance - numAmount };
        if (wallet.id === toWalletId)
          return { ...wallet, balance: wallet.balance + numAmount };
        return wallet;
      });

      // 2. Catat sebagai transaksi khusus tipe 'transfer'
      const fromWallet = state.wallets.find((w) => w.id === fromWalletId);
      const toWallet = state.wallets.find((w) => w.id === toWalletId);

      const newTransaction = {
        id: Date.now(),
        title: `Transfer: ${fromWallet.name} ➔ ${toWallet.name}`,
        amount: numAmount,
        type: "transfer",
        category: "Transfer",
        walletId: fromWalletId, // Kita catat di dompet asal
        date: new Date().toISOString(),
      };

      return {
        wallets: updatedWallets,
        transactions: [newTransaction, ...state.transactions],
      };
    }),

  // Actions untuk manajemen kategori
  addCategory: (newCategory) =>
    set((state) => ({
      categories: [...state.categories, { ...newCategory, id: Date.now() }],
    })),

  updateCategory: (id, updatedData) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updatedData } : c,
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
