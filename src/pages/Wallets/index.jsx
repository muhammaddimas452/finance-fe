import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";
// Tambahkan Edit2 dan Trash2 dari lucide-react
import {
  Plus,
  Wallet,
  CreditCard,
  Smartphone,
  Edit2,
  Trash2,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore";

const Wallets = () => {
  const { wallets, deleteWallet } = useFinanceStore();
  const { openWalletModal } = useUIStore();

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Wallet":
        return <Wallet size={24} />;
      case "CreditCard":
        return <CreditCard size={24} />;
      case "Smartphone":
        return <Smartphone size={24} />;
      default:
        return <Wallet size={24} />;
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dompet Saya
        </h1>
        <button
          onClick={() => openWalletModal()}
          className="flex items-center cursor-pointer gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] transition-colors text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#5b58ff]/30"
        >
          <Plus size={18} /> Tambah Dompet
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((w) => (
          <div
            key={w.id}
            // 1. Mengubah background menjadi gradien dan menambahkan efek hover melayang
            className="relative overflow-hidden bg-gradient-to-br from-[#5b58ff] to-[#8a88ff] p-7 rounded-[2rem] shadow-xl text-white group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            {/* 2. Ornamen dekoratif blur (Cahaya buatan) di latar belakang kartu */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-start mb-8">
              {/* 3. Wadah ikon dengan efek Glassmorphism (Kaca tembus pandang) */}
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                {getIcon(w.icon)}
              </div>

              {/* 4. Tombol Aksi (Muncul halus saat di-hover) */}
              <div className="flex gap-2 opacity-100 translate-x-4">
                <button
                  onClick={() => openWalletModal(w)} // <--- Mengirim data dompet (w) ke modal
                  className="p-2.5 bg-white/20 hover:bg-white/40 border border-white/10 rounded-xl backdrop-blur-md transition-colors"
                  title="Edit Dompet"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(`Yakin ingin menghapus dompet ${w.name}?`)
                    ) {
                      deleteWallet(w.id);
                    }
                  }}
                  className="p-2.5 bg-red-500/80 hover:bg-red-500 border border-red-400/50 rounded-xl backdrop-blur-md transition-colors"
                  title="Hapus Dompet"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="font-medium text-white/80 text-sm tracking-wide">
                {w.name}
              </h3>
              <p
                className="text-2xl xl:text-3xl font-bold mt-1 tracking-tight drop-shadow-md truncate w-full"
                title={formatRupiah(w.balance)}
              >
                {formatRupiah(w.balance)}
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/70">
              {/* Menggunakan data is_primary jika ada, jika tidak default ke teks ini */}
              <span>
                {w.is_primary ? "Primary Account" : "Standard Wallet"}
              </span>
              <span>Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallets;
