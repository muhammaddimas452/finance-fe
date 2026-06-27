import { LogOut } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useAuthStore } from "../../store/useAuthStore";

const LogoutModal = () => {
  const { isLogoutModalOpen, closeLogoutModal } = useUIStore();
  const { logout } = useAuthStore();

  if (!isLogoutModalOpen) return null;

  const handleConfirm = () => {
    logout(); // Eksekusi fungsi logout dari auth store
    closeLogoutModal(); // Tutup modal
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        {/* Ikon Peringatan Elegan */}
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-md">
          <LogOut size={36} className="ml-1" />
        </div>

        {/* Teks Konfirmasi */}
        <h3 className="font-bold text-2xl text-gray-800 mb-2">Sign Out</h3>
        <p className="text-gray-400 text-sm mb-8 px-2 leading-relaxed">
          Apakah Anda yakin ingin keluar dari Mooney? Anda harus login kembali
          untuk mengakses data keuangan Anda.
        </p>

        {/* Tombol Aksi */}
        <div className="flex gap-3">
          <button
            onClick={closeLogoutModal}
            className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-colors cursor-pointer"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
