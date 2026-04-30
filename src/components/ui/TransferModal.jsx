import { useState } from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const TransferModal = () => {
  const { isTransferModalOpen, closeTransferModal } = useUIStore();
  const { wallets, transfer } = useFinanceStore();
  const [data, setData] = useState({ from: "", to: "", amount: "" });

  if (!isTransferModalOpen) return null;

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!data.from || !data.to || !data.amount || data.from === data.to) {
      alert("Pilih dompet yang berbeda dan isi nominal!");
      return;
    }
    transfer({
      fromWalletId: parseInt(data.from),
      toWalletId: parseInt(data.to),
      amount: data.amount,
    });
    closeTransferModal();
    setData({ from: "", to: "", amount: "" });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Transfer Antar Dompet</h3>
          <button
            onClick={closeTransferModal}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              DARI
            </label>
            <select
              className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100 text-sm"
              onChange={(e) => setData({ ...data, from: e.target.value })}
            >
              <option value="">Pilih Sumber...</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center py-1 text-brand-500">
            <ArrowRightLeft className="rotate-90" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              KE
            </label>
            <select
              className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100 text-sm"
              onChange={(e) => setData({ ...data, to: e.target.value })}
            >
              <option value="">Pilih Tujuan...</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              NOMINAL (RP)
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-100 text-sm"
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 mt-2">
            Konfirmasi Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
