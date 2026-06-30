import { create } from "zustand";

export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isRightPanelOpen: false,
  isTransferModalOpen: false,
  isCategoryModalOpen: false,
  isWalletModalOpen: false,
  categoryEditData: null,
  walletEditData: null, // Tambahkan penampung data ini

  // State untuk Modal Transaksi
  isTransactionModalOpen: false,
  transactionType: "expense",

  isAuthModalOpen: false,
  authMode: "login", // 'login' atau 'register'
  isLogoutModalOpen: false,
  isProfileModalOpen: false,

  isDarkMode: localStorage.getItem("theme") === "dark",

  // Fungsi untuk mengganti mode
  toggleDarkMode: () =>
    set((state) => {
      const newTheme = !state.isDarkMode;

      // Simpan preferensi ke local storage
      localStorage.setItem("theme", newTheme ? "dark" : "light");

      // Langsung tembak class 'dark' ke tag <html> tertinggi di browser
      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return { isDarkMode: newTheme };
    }),

  openProfileModal: () => set({ isProfileModalOpen: true }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),

  openAuthModal: (mode = "login") =>
    set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),

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

  // Ubah fungsi open agar bisa menerima data (opsional)
  openWalletModal: (data = null) =>
    set({
      isWalletModalOpen: true,
      walletEditData: data,
    }),

  // Pastikan data dikosongkan lagi saat modal ditutup
  closeWalletModal: () =>
    set({
      isWalletModalOpen: false,
      walletEditData: null,
    }),

  openLogoutModal: () => set({ isLogoutModalOpen: true }),
  closeLogoutModal: () => set({ isLogoutModalOpen: false }),
}));
