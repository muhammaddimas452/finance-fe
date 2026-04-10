import { create } from "zustand";

export const useUIStore = create((set) => ({
  // --- State Menu Kiri & Kanan ---
  isMobileMenuOpen: false,
  isRightPanelOpen: false,

  // --- State Modal Transaksi ---
  isTransactionModalOpen: false,
  transactionType: "expense", // default: expense (pengeluaran)

  // --- Aksi Menu ---
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  toggleRightPanel: () =>
    set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  setRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),

  // --- Aksi Modal Transaksi (INI FUNGSI YANG ERROR TADI) ---
  openTransactionModal: (type = "expense") =>
    set({ isTransactionModalOpen: true, transactionType: type }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false }),
}));
