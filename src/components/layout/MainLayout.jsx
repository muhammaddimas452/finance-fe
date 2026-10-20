/* eslint-disable react-hooks/set-state-in-effect */
import { useUIStore } from "../../store/useUIStore";
import { Menu, AlignEndHorizontal, UserIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";
import TransactionModal from "../ui/TransactionModal";
import TransferModal from "../ui/TransferModal";
import CategoryModal from "../ui/CategoryModal";
import AuthModal from "../ui/AuthModal";
import LogoutModal from "../ui/LogoutModal";
import { useAuthStore } from "../../store/useAuthStore";
import OtpVerification from "../auth/OtpVerification";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WalletModal from "../ui/WalletModal";
import ProfileModal from "../ui/ProfileModal";
import BillModal from "../ui/BillModal";
import GmailSyncModal from "../ui/GmailSyncModal";
import { useFinanceStore } from "../../store/useFinanceStore";
import { CheckCircle2, AlertCircle, X as CloseIcon } from "lucide-react";

function MainLayout({ children }) {
  const {
    isMobileMenuOpen,
    isRightPanelOpen,
    setIsMobileMenuOpen,
    setIsRightPanelOpen,
  } = useUIStore();

  const { fetchInitialData, clearData } = useFinanceStore();
  const { isAuthenticated, user, refreshUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  // Efek otomatis untuk mengambil data saat login
  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    } else {
      clearData();
    }
  }, [isAuthenticated, fetchInitialData, clearData]);

  // Efek menangkap kembalian Google OAuth redirect dari backend
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gmailStatus = params.get("gmail");
    if (gmailStatus === "connected") {
      const email = params.get("email");
      refreshUser();
      fetchInitialData();
      setToast({
        type: "success",
        title: "Gmail Berhasil Terhubung!",
        message: email
          ? `Terhubung dengan ${email}. Notifikasi Bank Jago, Permata, & E-Wallet kini siap disinkronkan secara otomatis.`
          : "Akun Gmail berhasil terhubung untuk sinkronisasi otomatis transaksi bank.",
      });
      navigate(location.pathname, { replace: true });
    } else if (gmailStatus === "error") {
      const msg = params.get("message") || "Otorisasi Google dibatalkan atau gagal.";
      setToast({
        type: "error",
        title: "Gagal Menghubungkan Gmail",
        message: msg,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, refreshUser, fetchInitialData]);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /// UBAH BARIS INI: Gunakan tanda ! untuk mengecek apakah datanya kosong/null/undefined
  if (isAuthenticated && user && !user.email_verified_at) {
    return <OtpVerification />;
  }

  // 2. Jika sudah terverifikasi, lanjutkan merender aplikasi seperti biasa
  return (
    <div className="min-h-screen bg-background p-0 md:p-4 lg:p-8 flex items-center justify-center font-sans">
      <TransactionModal />
      <TransferModal />
      <CategoryModal />
      <AuthModal />
      <WalletModal />
      <LogoutModal />
      <ProfileModal />
      <BillModal />
      <GmailSyncModal />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-100 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === "success"
                ? "bg-white/95 border-emerald-200 text-gray-900 ring-1 ring-emerald-500/20"
                : "bg-white/95 border-red-200 text-gray-900 ring-1 ring-red-500/20"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === "success"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <h5 className="font-bold text-sm text-gray-900">{toast.title}</h5>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Container Aplikasi: border-radius dan height disesuaikan untuk mobile */}
      <div className="bg-white w-full h-screen md:h-[90vh] md:min-h-175 rounded-none md:rounded-[2.5rem] shadow-none md:shadow-soft flex overflow-hidden border-none md:border border-white/50 relative">
        {/* Mobile Header (Hanya muncul di layar kecil) */}
        <div className="md:hidden flex items-center justify-between p-6 bg-white w-full absolute top-0 z-20 shadow-sm">
          {/* Tombol Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-black font-bold text-xl">
              <AlignEndHorizontal />
            </div>
            <span className="text-xl font-bold text-gray-800">mooney</span>
          </div>

          {/* Tombol Profile/Right Panel */}
          <button
            onClick={() => setIsRightPanelOpen(true)}
            className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white hover:ring-2 hover:ring-[#5b58ff] transition-all cursor-pointer bg-gray-100 flex items-center justify-center"
          >
            {isAuthenticated && user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={20} className="text-gray-400" />
            )}
          </button>
        </div>
        {/* Kolom 1: Sidebar Kiri (Passing state untuk mobile) */}
        <Sidebar />
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
