import { useState } from "react";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Tags,
  Wallet,
  Download,
  AlignEndHorizontal,
  ReceiptText,
  X,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { Link, useLocation } from "react-router-dom";
import { useFinanceStore } from "../../store/useFinanceStore";
import { downloadPDF } from "../../utils/exportData";

const Sidebar = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUIStore();
  const location = useLocation();
  const { transactions } = useFinanceStore();

  // 1. STATE UNTUK MODAL & FILTER TANGGAL
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, active: true, path: "/" },
    {
      name: "Transactions",
      icon: ArrowRightLeft,
      active: false,
      path: "/transaction",
    },
    { name: "Wallets", icon: Wallet, active: false, path: "/wallets" },
    { name: "Categories", icon: Tags, active: false, path: "/categories" },
    { name: "Bills", icon: ReceiptText, active: false, path: "/bills" },
  ];

  // 2. FUNGSI BANTUAN "BULAN INI"
  const setThisMonth = () => {
    const date = new Date();
    // Mendapatkan tanggal 1 bulan ini
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    // Mendapatkan tanggal terakhir bulan ini
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    setStartDate(firstDay);
    setEndDate(lastDay);
  };

  // 3. FUNGSI EKSEKUSI FILTER SEBELUM DOWNLOAD
  const handleExportFiltered = () => {
    let dataToExport = transactions;

    // Jika user mengisi tanggal, filter datanya
    if (startDate && endDate) {
      dataToExport = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= new Date(startDate) && tDate <= new Date(endDate);
      });
    }

    // Panggil fungsi downloadPDF bawaan Anda dengan data yang sudah disaring
    downloadPDF(dataToExport);

    // Tutup modal setelah berhasil
    setIsExportModalOpen(false);
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <aside
        className={`
        absolute md:relative z-40 bg-white h-full w-64 flex flex-col justify-between py-8 px-6
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:shadow-none shadow-2xl
      `}
      >
        {/* Header Sidebar */}
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-black font-bold text-xl">
              <AlignEndHorizontal />
            </div>
            <span className="text-xl font-bold text-gray-800">mooney</span>
          </div>
          <button
            className="md:hidden p-1 text-gray-400 hover:text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 pb-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-50 text-brand-500 relative before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-brand-500 before:rounded-r-md'
                    : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  size={20}
                  className={isActive ? "text-brand-500" : ""}
                />
                <span
                  className={`font-medium ${isActive ? "text-brand-500" : ""}`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Export Data Section */}
        <div className="sm:block bg-brand-50 rounded-3xl p-5 text-center mt-auto">
          <div className="bg-[#fbfbfe] w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm">
            <Download size={24} className="text-brand-500" />
          </div>
          <h4 className="font-semibold text-gray-800 text-sm mb-1">
            Export Data
          </h4>
          <p className="text-xs text-gray-500 mb-4">Download PDF</p>
          <button
            // UBAH: Buka Modal, bukan langsung download
            onClick={() => setIsExportModalOpen(true)}
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white text-sm font-medium py-3 rounded-2xl cursor-pointer transition-colors shadow-lg shadow-brand-500/30"
          >
            Export Filter
          </button>
        </div>
      </aside>

      {/* 4. MODAL POP-UP EXPORT OVERLAY */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-11/12 max-w-md relative animate-in fade-in zoom-in duration-200">
            {/* Tombol Tutup (X) */}
            <button
              onClick={() => setIsExportModalOpen(false)}
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
                onClick={() => setIsExportModalOpen(false)}
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
      )}
    </>
  );
};

export default Sidebar;
