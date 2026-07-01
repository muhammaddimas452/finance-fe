import { useUIStore } from "../../store/useUIStore";
import { Menu, AlignEndHorizontal, UserIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";
import TransactionModal from "../ui/TransactionModal";
import Profile from "../../assets/profile.JPEG";
import TransferModal from "../ui/TransferModal";
import CategoryModal from "../ui/CategoryModal";
import AuthModal from "../ui/AuthModal";
import LogoutModal from "../ui/LogoutModal";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import WalletModal from "../ui/WalletModal";
import ProfileModal from "../ui/ProfileModal";
import BillModal from "./components/modals/BillModal";

// Import Store
import { useFinanceStore } from "../../store/useFinanceStore";

function MainLayout({ children }) {
  const {
    isMobileMenuOpen,
    isRightPanelOpen,
    setIsMobileMenuOpen,
    setIsRightPanelOpen,
  } = useUIStore();

  const { fetchInitialData, clearData } = useFinanceStore();
  const { isAuthenticated, user } = useAuthStore();

  // Efek otomatis untuk mengambil data saat login
  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    } else {
      clearData(); // Bersihkan data jika tidak login
    }
  }, [isAuthenticated, fetchInitialData, clearData]);

  return (
    // Background luar: padding hilang di mobile agar full screen
    <div className="min-h-screen bg-background p-0 md:p-4 lg:p-8 flex items-center justify-center font-sans">
      <TransactionModal />
      <TransferModal />
      <CategoryModal />
      <AuthModal />
      <WalletModal />
      <LogoutModal />
      <ProfileModal />
      <BillModal />
      {/* Container Aplikasi: border-radius dan height disesuaikan untuk mobile */}
      <div className="bg-white w-full max-w-[1400px] h-screen md:h-[90vh] md:min-h-[700px] rounded-none md:rounded-[2.5rem] shadow-none md:shadow-soft flex overflow-hidden border-none md:border border-white/50 relative">
        {/* Mobile Header (Hanya muncul di layar kecil) */}
        <div className="md:hidden flex items-center justify-between p-6 bg-white w-full absolute top-0 z-20 shadow-sm">
          {/* Tombol Menu Kiri */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          {/* Logo di Tengah */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-black font-bold text-xl">
              <AlignEndHorizontal />
            </div>
            <span className="text-xl font-bold text-gray-800">mooney</span>
          </div>

          {/* Tombol Profile Kanan / Untuk Right Panel */}
          <button
            onClick={() => setIsRightPanelOpen(true)}
            className="w-10 h-10 rounded-full overflow-hidden shadow-sm"
          >
            {isAuthenticated ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={32} className="w-full h-full object-cover" />
            )}
          </button>
        </div>
        {/* Kolom 1: Sidebar Kiri (Passing state untuk mobile) */}
        <Sidebar />

        {/* Overlay gelap saat menu mobile terbuka */}
        {(isMobileMenuOpen || isRightPanelOpen) && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsRightPanelOpen(false);
            }}
          />
        )}

        {/* Kolom 2: Area Konten Utama */}

        {/* Tambahkan padding-top di mobile agar tidak tertutup header */}
        <main className="flex-1 bg-[#fbfbfe] md:rounded-3xl m-0 md:m-3 p-6 md:p-8 pt-24 md:pt-8 overflow-y-auto shadow-none md:shadow-inner">
          {children}
        </main>

        {/* Kolom 3: Sidebar Kanan (Disembunyikan di layar < 1024px) */}
        <RightPanel />
      </div>
    </div>
  );
}

export default MainLayout;
