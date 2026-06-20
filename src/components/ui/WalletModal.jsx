import { useState } from "react";
import { X, Wallet, CreditCard, Smartphone } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const WalletModal = () => {
  const { isWalletModalOpen, closeWalletModal } = useUIStore();
  const { addWallet } = useFinanceStore();

  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    icon: "Wallet",
  });

  if (!isWalletModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.balance)
      return alert("Lengkapi nama dan saldo awal!");

    const result = await addWallet({
      name: formData.name,
      balance: parseFloat(formData.balance),
      icon: formData.icon,
      is_primary: false,
    });

    if (result.success) {
      closeWalletModal();
      setFormData({ name: "", balance: "", icon: "Wallet" });
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">Tambah Dompet</h3>
          <button
            onClick={closeWalletModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Nama Dompet
            </label>
            <input
              type="text"
              placeholder="Cth: Bank BCA, Dana, Cash"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Saldo Awal (RP)
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
            />
          </div>

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
                  className={`flex-1 py-3 flex justify-center rounded-xl border-2 transition-all ${formData.icon === item.id ? "border-brand-500 bg-brand-50 text-brand-500" : "border-gray-100 text-gray-400"}`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all mt-2">
            Simpan Dompet
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletModal;
