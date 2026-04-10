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
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
