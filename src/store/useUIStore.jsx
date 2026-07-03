import { create } from "zustand";

export const useUIStore = create((set) => ({
  // ==========================================
  // 1. GLOBAL LAYOUT & SETTINGS
  // ==========================================
  isMobileMenuOpen: false,
  isRightPanelOpen: false,
  isBalanceHidden: JSON.parse(localStorage.getItem("hide_balance")) || false,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

  toggleRightPanel: () =>
    set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  setIsRightPanelOpen: (isOpen) => set({ isRightPanelOpen: isOpen }),

  toggleHideBalance: () =>
    set((state) => {
      const newValue = !state.isBalanceHidden;
      localStorage.setItem("hide_balance", JSON.stringify(newValue));
      return { isBalanceHidden: newValue };
    }),

  // ==========================================
  // 2. AUTHENTICATION & PROFILE
  // ==========================================
  isAuthModalOpen: false,
  authMode: "login", // 'login' | 'register'
  isLogoutModalOpen: false,
  isProfileModalOpen: false,

  openAuthModal: (mode = "login") =>
    set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),

  openLogoutModal: () => set({ isLogoutModalOpen: true }),
  closeLogoutModal: () => set({ isLogoutModalOpen: false }),

  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),

  // ==========================================
  // 3. TRANSACTION & TRANSFER
  // ==========================================
  isTransactionModalOpen: false,
  transactionType: "expense", // 'income' | 'expense'
  isTransferModalOpen: false,

  openTransactionModal: (type = "expense") =>
    set({ isTransactionModalOpen: true, transactionType: type }),
  closeTransactionModal: () => set({ isTransactionModalOpen: false }),

  openTransferModal: () => set({ isTransferModalOpen: true }),
  closeTransferModal: () => set({ isTransferModalOpen: false }),

  // ==========================================
  // 4. WALLET MODAL
  // ==========================================
  isWalletModalOpen: false,
  walletEditData: null,

  openWalletModal: (data = null) =>
    set({ isWalletModalOpen: true, walletEditData: data }),
  closeWalletModal: () =>
    set({ isWalletModalOpen: false, walletEditData: null }),

  // ==========================================
  // 5. CATEGORY MODAL
  // ==========================================
  isCategoryModalOpen: false,
  categoryEditData: null,

  openCategoryModal: (data = null) =>
    set({ isCategoryModalOpen: true, categoryEditData: data }),
  closeCategoryModal: () =>
    set({ isCategoryModalOpen: false, categoryEditData: null }),

  // ==========================================
  // 6. BILL MODAL
  // ==========================================
  isBillModalOpen: false,
  selectedBill: null,

  openBillModal: (bill = null) =>
    set({ isBillModalOpen: true, selectedBill: bill }),
  closeBillModal: () => set({ isBillModalOpen: false, selectedBill: null }),
}));
