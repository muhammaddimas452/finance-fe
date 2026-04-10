import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const TransactionModal = () => {
  const { isTransactionModalOpen, transactionType, closeTransactionModal } =
    useUIStore();
  const { wallets, categories, addTransaction } = useFinanceStore();

  // State lokal untuk form
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    walletId: "",
  });

  // Sinkronisasi tipe transaksi saat modal dibuka dari tombol yang berbeda
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({ ...prev, type: transactionType }));
  }, [transactionType, isTransactionModalOpen]);

  if (!isTransactionModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (
      !formData.title ||
      !formData.amount ||
      !formData.categoryId ||
      !formData.walletId
    ) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    // Cari nama kategori berdasarkan ID untuk disimpan
    const selectedCategory = categories.find(
      (c) => c.id === parseInt(formData.categoryId),
    );

    const newTransaction = {
      title: formData.title,
      amount: parseInt(formData.amount),
      type: formData.type,
      category: selectedCategory.name,
      walletId: parseInt(formData.walletId),
    };

    addTransaction(newTransaction);

    // Reset form dan tutup modal
    setFormData({
      title: "",
      amount: "",
      type: "expense",
      categoryId: "",
      walletId: "",
    });
    closeTransactionModal();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipe Transaksi (Tabs) */}
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.type === "expense" ? "bg-white text-red-500 shadow-sm" : "text-gray-500"}`}
              onClick={() => setFormData({ ...formData, type: "expense" })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${formData.type === "income" ? "bg-white text-green-500 shadow-sm" : "text-gray-500"}`}
              onClick={() => setFormData({ ...formData, type: "income" })}
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
              placeholder="e.g., Makan Siang, Gaji Bulanan"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 outline-none"
            />
          </div>

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
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 outline-none"
            />
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
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 outline-none"
              >
                <option value="">Select...</option>
                {/* Filter kategori berdasarkan tipe yang dipilih */}
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
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-brand-500 focus:border-brand-500 block p-3 outline-none"
              >
                <option value="">Select...</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white bg-brand-500 hover:bg-brand-600 font-medium rounded-xl text-sm px-5 py-3.5 text-center transition-colors shadow-lg shadow-brand-500/30 mt-4"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
