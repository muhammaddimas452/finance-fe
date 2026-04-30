import { create } from "zustand";

export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isRightPanelOpen: false,
  isTransferModalOpen: false,
  isCategoryModalOpen: false,
  categoryEditData: null,

  // State untuk Modal Transaksi
  isTransactionModalOpen: false,
  transactionType: "expense",

  // Action untuk Modal Transaksi
  openTransactionModal: (type = "expense") =>
    set({ isTransactionModalOpen: true, transactionType: type }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false }),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  toggleRightPanel: () =>
    set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  setIsRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),

  openTransferModal: () => set({ isTransferModalOpen: true }),
  closeTransferModal: () => set({ isTransferModalOpen: false }),

  openCategoryModal: (data = null) =>
    set({ isCategoryModalOpen: true, categoryEditData: data }),
  closeCategoryModal: () =>
    set({ isCategoryModalOpen: false, categoryEditData: null }),
}));
