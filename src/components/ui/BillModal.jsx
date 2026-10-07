/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
// 1. TAMBAHKAN Loader2 DI SINI
import { X, Calendar, DollarSign, Type, Loader2 } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useBillStore } from "../../store/useBillStore";

const BillModal = () => {
  const { isBillModalOpen, closeBillModal, selectedBill } = useUIStore();
  const { addBill, updateBill } = useBillStore();

  const [isLoading, setIsLoading] = useState(false);
  // 2. Tambahkan state penampung error agar tidak memakai alert() yang mengganggu UX
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    due_date: "",
  });

  useEffect(() => {
    if (selectedBill && isBillModalOpen) {
      setFormData({
        title: selectedBill.title,
        amount: selectedBill.amount,
        due_date: selectedBill.due_date,
      });
    } else if (isBillModalOpen) {
      setFormData({ title: "", amount: "", due_date: "" });
    }
    setErrors({}); // Bersihkan error saat modal dibuka
  }, [selectedBill, isBillModalOpen]);

  if (!isBillModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const dueDateNum = parseInt(formData.due_date, 10);

    // 3. Validasi gaya baru (seragam dengan TransactionModal)
    if (!formData.title.trim()) newErrors.title = "Billing name is required!";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be greater than 0!";
    if (!formData.due_date || dueDateNum < 1 || dueDateNum > 31) {
      newErrors.due_date = "Due date must be between 1 and 31!";
    }

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    setIsLoading(true);

    try {
      let result;
      if (selectedBill) {
        result = await updateBill(selectedBill.id, formData);
      } else {
        result = await addBill(formData);
      }

      if (result.success) {
        closeBillModal();
      } else {
        setErrors({ general: result.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-4xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">
            {selectedBill ? "Edit Bill" : "Add Bill"}
          </h3>
          <button
            onClick={closeBillModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {errors.general && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 font-medium text-center border border-red-100">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Tagihan */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              BILLING NAME
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.title ? "text-red-400" : "text-gray-400"}`}
              >
                <Type size={18} />
              </div>
              <input
                type="text"
                name="title"
                placeholder="Example: Netflix, WiFi, Electricity"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                  errors.title
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-brand-500"
                }`}
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* Jumlah Tagihan */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              AMOUNT (RP)
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.amount ? "text-red-400" : "text-gray-400"}`}
              >
                <DollarSign size={18} />
              </div>
              <input
                type="number"
                name="amount"
                min="0"
                placeholder="50000"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                  errors.amount
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-brand-500"
                }`}
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.amount}
              </p>
            )}
          </div>

          {/* Tanggal Jatuh Tempo */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              DUE DATE (1-31)
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.due_date ? "text-red-400" : "text-gray-400"}`}
              >
                <Calendar size={18} />
              </div>
              <input
                type="number"
                name="due_date"
                min="1"
                max="31"
                placeholder="Every what date? (e.g.: 15)"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                  errors.due_date
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-brand-500"
                }`}
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
            {errors.due_date && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.due_date}
              </p>
            )}
          </div>

          {/* 4. Tombol dengan perbaikan flex dan gap */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 cursor-pointer transition-all mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Bill"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillModal;
