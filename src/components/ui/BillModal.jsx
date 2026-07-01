import { useState, useEffect } from "react";
import { X, Calendar, DollarSign, Type } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useBillStore } from "../../store/useBillStore";

const BillModal = () => {
  const { isBillModalOpen, closeBillModal, selectedBill } = useUIStore();
  const { addBill, updateBill } = useBillStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    due_date: "", // Tanggal 1-31
  });

  // Isi form jika sedang dalam mode Edit
  useEffect(() => {
    if (selectedBill && isBillModalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: selectedBill.title,
        amount: selectedBill.amount,
        due_date: selectedBill.due_date,
      });
    } else if (isBillModalOpen) {
      setFormData({ title: "", amount: "", due_date: "" });
    }
  }, [selectedBill, isBillModalOpen]);

  if (!isBillModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (formData.due_date < 1 || formData.due_date > 31) {
      alert("Tanggal jatuh tempo harus antara 1 sampai 31.");
      return;
    }

    setIsLoading(true);

    let result;
    if (selectedBill) {
      result = await updateBill(selectedBill.id, formData);
    } else {
      result = await addBill(formData);
    }

    setIsLoading(false);

    if (result.success) {
      closeBillModal();
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">
            {selectedBill ? "Edit Tagihan" : "Tambah Tagihan"}
          </h3>
          <button
            onClick={closeBillModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Tagihan */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              NAMA TAGIHAN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Type size={18} />
              </div>
              <input
                type="text"
                name="title"
                required
                placeholder="Contoh: Netflix, WiFi, Listrik"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-brand-500 transition-all text-sm font-medium"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Jumlah Tagihan */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              JUMLAH (RP)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <DollarSign size={18} />
              </div>
              <input
                type="number"
                name="amount"
                required
                min="0"
                placeholder="50000"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-brand-500 transition-all text-sm font-medium"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tanggal Jatuh Tempo */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              TANGGAL JATUH TEMPO (1-31)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Calendar size={18} />
              </div>
              <input
                type="number"
                name="due_date"
                required
                min="1"
                max="31"
                placeholder="Tiap tanggal berapa? (Misal: 15)"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-brand-500 transition-all text-sm font-medium"
                value={formData.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] disabled:opacity-70 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 cursor-pointer transition-all mt-4"
          >
            {isLoading ? "Menyimpan..." : "Simpan Tagihan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillModal;
