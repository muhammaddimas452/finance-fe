import { useState } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const TransferModal = () => {
  const { isTransferModalOpen, closeTransferModal } = useUIStore();
  const { wallets, transfer } = useFinanceStore();
  const [data, setData] = useState({ from: "", to: "", amount: "" });

  // 1. Tambahkan state penampung error
  const [errors, setErrors] = useState({});

  if (!isTransferModalOpen) return null;

  const handleTransfer = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 2. Logika Validasi Detail
    if (!data.from) newErrors.from = "Pilih dompet asal!";
    if (!data.to) newErrors.to = "Pilih dompet tujuan!";
    if (data.from && data.to && data.from === data.to) {
      newErrors.to = "Dompet tujuan tidak boleh sama!";
    }
    if (!data.amount || data.amount <= 0) {
      newErrors.amount = "Nominal transfer tidak valid!";
    }

    // 3. Jika ada error, tampilkan dan hentikan proses
    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    const result = await transfer({
      fromWalletId: parseInt(data.from),
      toWalletId: parseInt(data.to),
      amount: parseFloat(data.amount), // Gunakan parseFloat untuk keamanan angka
    });

    if (result.success) {
      closeTransferModal();
      setData({ from: "", to: "", amount: "" });
      setErrors({}); // Reset error setelah sukses
    } else {
      // Menangkap error spesifik dari backend (misal: saldo tidak cukup)
      setErrors({ server: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Transfer Antar Dompet</h3>
          <button
            onClick={() => {
              closeTransferModal();
              setErrors({}); // Bersihkan error saat modal ditutup paksa
            }}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifikasi Error dari Server (misal: saldo tidak cukup) */}
        {errors.server && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 font-medium text-center border border-red-100">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleTransfer} className="space-y-4">
          {/* Kolom DARI */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              DARI
            </label>
            <select
              className={`w-full p-3 bg-gray-50 rounded-xl cursor-pointer outline-none transition-colors text-sm font-medium ${
                errors.from
                  ? "border-red-500 text-red-500 border-2"
                  : "border-gray-100 border text-gray-800 focus:border-brand-500"
              }`}
              value={data.from}
              onChange={(e) => {
                setData({ ...data, from: e.target.value });
                if (errors.from) setErrors({ ...errors, from: null });
              }}
            >
              <option value="">Pilih Sumber...</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} - Rp {w.balance.toLocaleString("id-ID")}
                </option>
              ))}
            </select>
            {errors.from && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.from}
              </p>
            )}
          </div>

          <div className="flex justify-center py-1 text-brand-500">
            <ArrowRightLeft className="rotate-90" />
          </div>

          {/* Kolom KE */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              KE
            </label>
            <select
              className={`w-full p-3 bg-gray-50 rounded-xl cursor-pointer outline-none transition-colors text-sm font-medium ${
                errors.to
                  ? "border-red-500 text-red-500 border-2"
                  : "border-gray-100 border text-gray-800 focus:border-brand-500"
              }`}
              value={data.to}
              onChange={(e) => {
                setData({ ...data, to: e.target.value });
                if (errors.to) setErrors({ ...errors, to: null });
              }}
            >
              <option value="">Pilih Tujuan...</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            {errors.to && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.to}
              </p>
            )}
          </div>

          {/* Kolom NOMINAL */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              NOMINAL (RP)
            </label>
            <input
              type="number"
              placeholder="0"
              value={data.amount}
              className={`w-full p-3 bg-gray-50 rounded-xl outline-none transition-colors text-sm font-medium ${
                errors.amount
                  ? "border-red-500 text-red-500 border-2"
                  : "border-gray-100 border text-gray-800 focus:border-brand-500"
              }`}
              onChange={(e) => {
                setData({ ...data, amount: e.target.value });
                if (errors.amount) setErrors({ ...errors, amount: null });
              }}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                {errors.amount}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] cursor-pointer text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 mt-2 transition-all"
          >
            Konfirmasi Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
