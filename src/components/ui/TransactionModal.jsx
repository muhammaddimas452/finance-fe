/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";
import { useBillStore } from "../../store/useBillStore";

const TransactionModal = () => {
  const {
    isTransactionModalOpen,
    transactionType,
    closeTransactionModal,
    transactionEditData,
  } = useUIStore();

  const { wallets, categories, addTransaction, updateTransaction } =
    useFinanceStore();
  const { bills, updateBill } = useBillStore();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    walletId: "",
    billId: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, type: transactionType }));
  }, [transactionType, isTransactionModalOpen]);

  if (!isTransactionModalOpen) return null;

  // Handler khusus untuk Dropdown Tagihan
  const handleBillChange = (e) => {
    const selectedBillId = e.target.value;

    if (selectedBillId) {
      // Cari data tagihan berdasarkan ID yang dipilih
      const selectedBill = bills.find((b) => String(b.id) === selectedBillId);

      if (selectedBill) {
        setFormData((prev) => ({
          ...prev,
          billId: selectedBillId,
          // Rekomendasi UX: Otomatis isi Amount
          amount: selectedBill.amount.toString(),
          // Rekomendasi UX: Otomatis isi Title jika title saat ini masih kosong
          title: prev.title.trim() === "" ? selectedBill.title : prev.title,
        }));
      }
    } else {
      // Jika user membatalkan pilihan (memilih "-- No linked bill --")
      setFormData((prev) => ({ ...prev, billId: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "The amount must be greater than 0!";
    if (!formData.title.trim())
      newErrors.title = "Transaction title is required!";
    if (!formData.walletId) newErrors.walletId = "Please select a wallet!";

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        amount: formData.amount,
        type: formData.type,
        category_id: formData.categoryId || null,
        wallet_id: formData.walletId,
        date: formData.date || new Date().toISOString().split("T")[0],
      };

      let isSuccess = false;

      if (transactionEditData) {
        const result = await updateTransaction(transactionEditData.id, payload);
        if (result.success) isSuccess = true;
      } else {
        const result = await addTransaction(payload);
        if (result.success) isSuccess = true;
      }

      if (isSuccess) {
        // Otomatis mengubah status tagihan menjadi Lunas (is_paid: true)
        if (formData.type === "expense" && formData.billId) {
          await updateBill(formData.billId, { is_paid: true });
        }

        closeTransactionModal();
        setFormData({
          amount: "",
          title: "",
          categoryId: "",
          walletId: "",
          billId: "",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-800">
            Add New {formData.type === "income" ? "Income" : "Expense"}
          </h3>
          <button
            onClick={closeTransactionModal}
            className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 text-sm cursor-pointer font-medium rounded-lg transition-colors ${formData.type === "expense" ? "bg-white text-red-500 shadow-sm" : "text-gray-500"}`}
              onClick={() =>
                setFormData({ ...formData, type: "expense", billId: "" })
              }
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm cursor-pointer font-medium rounded-lg transition-colors ${formData.type === "income" ? "bg-white text-green-500 shadow-sm" : "text-gray-500"}`}
              onClick={() =>
                setFormData({ ...formData, type: "income", billId: "" })
              }
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lunch, Monthly Salary"
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

          {/* Posisi Link to Bill Dipindahkan ke Bawah Title */}
          {formData.type === "expense" && bills && bills.length > 0 && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-brand-600 mb-1">
                Link to Bill (Optional)
              </label>
              <select
                name="billId"
                value={formData.billId}
                onChange={handleBillChange} // Menggunakan handler kustom
                className="w-full bg-brand-50 border border-brand-100 cursor-pointer text-gray-800 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 outline-none"
              >
                <option value="">-- No linked bill --</option>
                {bills
                  .filter((b) => !b.is_paid)
                  .map((bill) => (
                    <option key={bill.id} value={bill.id}>
                      {bill.title} (Target: Rp{bill.amount})
                    </option>
                  ))}
              </select>
            </div>
          )}

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
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] text-white font-medium rounded-xl text-sm px-5 py-3.5 text-center transition-colors shadow-lg shadow-brand-500/30 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Transaction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
