import { useState, useEffect } from "react";
import { X, Wallet, CreditCard, Smartphone } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const WalletModal = () => {
  const { isWalletModalOpen, closeWalletModal, walletEditData } = useUIStore();
  const { addWallet, updateWallet } = useFinanceStore();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    icon: "Wallet",
  });

  useEffect(() => {
    if (walletEditData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: walletEditData.name,
        balance: walletEditData.balance,
        icon: walletEditData.icon || "Wallet",
      });
    } else {
      setFormData({ name: "", balance: "", icon: "Wallet" });
    }
    // Hapus pesan error lama jika modal dibuka/ditutup
    setErrors({});
  }, [walletEditData, isWalletModalOpen]);

  if (!isWalletModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama dompet wajib diisi!";
    if (formData.balance === "")
      newErrors.balance = "Saldo awal tidak boleh kosong!";

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    let result;
    if (walletEditData) {
      result = await updateWallet(walletEditData.id, {
        name: formData.name,
        balance: parseFloat(formData.balance),
        icon: formData.icon,
      });
    } else {
      result = await addWallet({
        name: formData.name,
        balance: parseFloat(formData.balance),
        icon: formData.icon,
        is_primary: false,
      });
    }

    if (result.success) {
      closeWalletModal();
      setFormData({ name: "", balance: "", icon: "Wallet" });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">
            {walletEditData ? "Edit Dompet" : "Tambah Dompet"}
          </h3>
          <button
            onClick={closeWalletModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Nama Dompet */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Nama Dompet
            </label>
            <input
              type="text"
              placeholder="Cth: Bank BCA, Dana, Cash"
              className={`w-full p-4 bg-gray-50 rounded-2xl outline-none border transition-all text-sm font-medium ${
                errors.name
                  ? "border-red-500 focus:border-red-500 text-red-500"
                  : "border-transparent focus:border-brand-500 focus:bg-white text-gray-800"
              }`}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Input Saldo (Sudah bisa diisi) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Saldo Awal (RP)
            </label>
            <input
              type="number"
              placeholder="0"
              // Dihapus disabled={!!walletEditData} agar selalu bisa diketik
              className={`w-full p-4 bg-gray-50 rounded-2xl outline-none border transition-all text-sm font-medium ${
                errors.balance
                  ? "border-red-500 focus:border-red-500 text-red-500"
                  : "border-transparent focus:border-brand-500 focus:bg-white text-gray-800"
              }`}
              value={formData.balance}
              onChange={(e) => {
                setFormData({ ...formData, balance: e.target.value });
                if (errors.balance) setErrors({ ...errors, balance: null });
              }}
            />
            {errors.balance && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.balance}
              </p>
            )}
            {walletEditData && (
              <span className="text-[10px] text-gray-400 mt-1 block">
                *Mengubah saldo di sini akan mengabaikan riwayat transaksi.
              </span>
            )}
          </div>

          {/* Input Ikon */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Pilih Ikon
            </label>
            <div className="flex gap-3">
              {[
                { id: "Wallet", icon: <Wallet size={20} /> },
                { id: "CreditCard", icon: <CreditCard size={20} /> },
                { id: "Smartphone", icon: <Smartphone size={20} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: item.id })}
                  className={`flex-1 py-3 flex justify-center rounded-xl border-2 cursor-pointer transition-all ${
                    formData.icon === item.id
                      ? "border-brand-500 bg-brand-50 text-brand-500"
                      : "border-gray-100 text-gray-400"
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/30 cursor-pointer transition-all mt-2">
            {walletEditData ? "Simpan Perubahan" : "Simpan Dompet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletModal;
