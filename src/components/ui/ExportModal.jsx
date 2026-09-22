import { useState } from "react";
import axios from "axios"; // atau custom axios instance Anda

const ExportModal = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fungsi pembantu untuk mengatur "Bulan Ini"
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

  const handleExport = async () => {
    try {
      // Panggil API dengan parameter tanggal
      const response = await axios.get("/api/export/transactions", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        responseType: "blob", // SANGAT PENTING untuk mengunduh file
      });

      // Logika standar untuk mengunduh file dari blob di browser
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `transaksi-${startDate}-sampai-${endDate}.pdf`,
      ); // atau .csv
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Gagal mengekspor data", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="font-bold mb-4">Export Transactions</h3>

      {/* Tombol Pintasan */}
      <button
        onClick={setThisMonth}
        className="mb-4 text-sm text-blue-500 underline"
      >
        Pilih Bulan Ini
      </button>

      {/* Input Tanggal Kustom */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-500">Dari</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500">Sampai</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={!startDate || !endDate}
        className="w-full bg-[#5b58ff] text-white py-2 rounded-lg disabled:opacity-50"
      >
        Download File
      </button>
    </div>
  );
};
