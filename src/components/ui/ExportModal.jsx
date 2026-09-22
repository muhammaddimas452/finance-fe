// src/components/ui/ExportModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { downloadPDF } from "../../utils/exportData";

const ExportModal = ({ isOpen, onClose }) => {
  const { transactions } = useFinanceStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Jika isOpen bernilai false, jangan tampilkan apa-apa (null)
  if (!isOpen) return null;

  const setThisMonth = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    setStartDate(firstDay);
    setEndDate(lastDay);
  };

  const handleExportFiltered = () => {
    let dataToExport = transactions;

    if (startDate && endDate) {
      dataToExport = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= new Date(startDate) && tDate <= new Date(endDate);
      });
    }

    downloadPDF(dataToExport);

    // Reset state dan tutup modal
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-11/12 max-w-md relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Pilih Periode Export
        </h3>

        <button
          onClick={setThisMonth}
          className="text-sm text-brand-500 font-medium mb-4 hover:underline"
        >
          Pilih Bulan Ini
        </button>

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleExportFiltered}
            disabled={!startDate || !endDate}
            className="flex-1 bg-[#5b58ff] hover:bg-[#4a47e6] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
