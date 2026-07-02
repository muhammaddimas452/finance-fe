import { useState } from "react";
import {
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar, // 1. Tambahkan ikon Calendar
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // 2. Tambahkan State untuk Filter Bulan (Default ke bulan saat ini)
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // 3. Update Logika Filter & Search
  const filteredTransactions = transactions.filter((t) => {
    // Cek Search (Judul)
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Cek Tipe (Income/Expense/All)
    const matchesType = filterType === "all" || t.type === filterType;

    // Cek Bulan
    // Jika filterMonth kosong (user menghapus isinya), tampilkan semua
    const matchesMonth = !filterMonth || t.date.startsWith(filterMonth);

    // Harus memenuhi ketiga syarat tersebut
    return matchesSearch && matchesType && matchesMonth;
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Semua Transaksi
        </h1>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {/* Search Bar */}
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 w-full sm:w-56 text-sm">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="bg-transparent border-none outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Bulan */}
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm">
            <Calendar size={18} className="text-gray-400 shrink-0" />
            <input
              type="month"
              className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer w-full"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
          </div>

          {/* Filter Type */}
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm">
            <Filter size={18} className="text-gray-400 shrink-0" />
            <select
              className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer w-full"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Semua Tipe</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
        </div>
      </header>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-soft overflow-hidden flex-1 flex flex-col border border-gray-50">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Transaksi
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Nominal
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${t.type === "income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                        >
                          {t.type === "income" ? (
                            <ArrowDownLeft size={18} />
                          ) : (
                            <ArrowUpRight size={18} />
                          )}
                        </div>
                        <span className="font-bold text-gray-800">
                          {t.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {t.category?.name || "Lainnya"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                      {new Date(t.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.type === "income" ? "text-green-500" : "text-gray-800"}`}
                    >
                      {t.type === "income" ? "+" : "-"} {formatRupiah(t.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="opacity-20 mb-2" />
                      <p className="font-medium text-sm">
                        Tidak ada transaksi yang ditemukan.
                      </p>
                      <p className="text-xs opacity-70">
                        Coba ubah kata kunci atau filter bulan.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
