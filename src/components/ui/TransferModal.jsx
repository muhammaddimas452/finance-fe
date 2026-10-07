import { useState } from "react";
import { X, ArrowRightLeft, Loader2 } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const TransferModal = () => {
  const { isTransferModalOpen, closeTransferModal } = useUIStore();
  const { wallets, transfer } = useFinanceStore();
  const [data, setData] = useState({ from: "", to: "", amount: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  if (!isTransferModalOpen) return null;
  const handleTransfer = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!data.from) newErrors.from = "Select the source wallet!";
    if (!data.to) newErrors.to = "Select the destination wallet!";
    if (data.from && data.to && data.from === data.to) {
      newErrors.to = "The destination wallet cannot be the same!";
    }
    if (!data.amount || data.amount <= 0) {
      newErrors.amount = "The transfer nominal is not valid!";
    }
    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }
    setIsLoading(true);
    const result = await transfer({
      fromWalletId: parseInt(data.from),
      toWalletId: parseInt(data.to),
      amount: parseFloat(data.amount),
    });
    if (result.success) {
      closeTransferModal();
      setData({ from: "", to: "", amount: "" });
      setErrors({});
    } else {
      setErrors({ server: result.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-4xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Inter-Wallet Transfer</h3>
          <button
            onClick={() => {
              closeTransferModal();
              setErrors({});
            }}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {errors.server && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 font-medium text-center border border-red-100">
            {errors.server}
          </div>
        )}
        <form onSubmit={handleTransfer} className="space-y-4">
          {/* Kolom DARI */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              FROM
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
              <option value="">Select Source...</option>
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
              TO
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
              <option value="">Select Destination...</option>
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
              AMOUNT (RP)
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
            disabled={isLoading}
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] cursor-pointer text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 mt-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Transfer"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
