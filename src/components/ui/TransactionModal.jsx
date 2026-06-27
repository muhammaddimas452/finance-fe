import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const TransactionModal = () => {
  // Tambahkan transactionEditData di sini agar mode Edit tidak error
  const {
    isTransactionModalOpen,
    transactionType,
    closeTransactionModal,
    transactionEditData,
  } = useUIStore();
  // Tambahkan updateTransaction di sini
  const { wallets, categories, addTransaction, updateTransaction } =
    useFinanceStore();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    walletId: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({ ...prev, type: transactionType }));
  }, [transactionType, isTransactionModalOpen]);

  if (!isTransactionModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // --- LOGIKA VALIDASI ---
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Nominal harus lebih dari 0!";
    if (!formData.title.trim())
      newErrors.title = "Judul transaksi wajib diisi!";
    if (!formData.walletId)
      newErrors.walletId = "Pilih dompet terlebih dahulu!";

    // Jika ada error, hentikan fungsi dan tampilkan pesan merah
    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    const payload = {
      title: formData.title,
      amount: formData.amount,
      type: formData.type, // Perbaikan: Gunakan formData.type, bukan variabel 'type' yang tidak terdefinisi
      category_id: formData.categoryId || null,
      wallet_id: formData.walletId,
      date: formData.date || new Date().toISOString().split("T")[0],
    };

    if (transactionEditData) {
      const result = await updateTransaction(transactionEditData.id, payload);
      if (result.success) closeTransactionModal();
    } else {
      const result = await addTransaction(payload);
      if (result.success) {
        closeTransactionModal();
        setFormData({ amount: "", title: "", categoryId: "", walletId: "" });
      }
    }
  };

  // --- MENGHAPUS ERROR SAAT MENGETIK ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">
            Add New {formData.type === "income" ? "Income" : "Expense"}
          </h3>
          <button
            onClick={closeTransactionModal}
            className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 text-sm cursor-pointer font-medium rounded-lg transition-colors ${formData.type === "expense" ? "bg-white text-red-500 shadow-sm" : "text-gray-500"}`}
              onClick={() => setFormData({ ...formData, type: "expense" })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm cursor-pointer font-medium rounded-lg transition-colors ${formData.type === "income" ? "bg-white text-green-500 shadow-sm" : "text-gray-500"}`}
              onClick={() => setFormData({ ...formData, type: "income" })}
            >
              Income
            </button>
          </div>

          {/* --- INPUT TITLE DENGAN VALIDASI --- */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Makan Siang, Gaji Bulanan"
              className={`w-full bg-gray-50 border text-gray-800 text-sm rounded-xl focus:ring-brand-500 block p-3 outline-none transition-colors ${
                errors.title
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* --- INPUT AMOUNT DENGAN VALIDASI --- */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Amount (Rp)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={`w-full bg-gray-50 border text-gray-800 text-sm rounded-xl focus:ring-brand-500 block p-3 outline-none transition-colors ${
                errors.amount
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-brand-500"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 cursor-pointer text-gray-800 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 outline-none"
              >
                <option value="">Select...</option>
                {categories
                  .filter((c) => c.type === formData.type)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* --- SELECT WALLET DENGAN VALIDASI --- */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Wallet
              </label>
              <select
                name="walletId"
                value={formData.walletId}
                onChange={handleChange}
                className={`w-full bg-gray-50 border cursor-pointer text-gray-800 text-sm rounded-xl focus:ring-brand-500 block p-3 outline-none transition-colors ${
                  errors.walletId
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-brand-500"
                }`}
              >
                <option value="">Select...</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
              {errors.walletId && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                  {errors.walletId}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white cursor-pointer font-medium rounded-xl text-sm px-5 py-3.5 text-center transition-colors shadow-lg shadow-brand-500/30 mt-4"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
