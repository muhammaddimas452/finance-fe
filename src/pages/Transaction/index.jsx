import { useState } from "react";
import {
  Search,
  Filter,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  RefreshCw,
  Layers,
} from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useUIStore } from "../../store/useUIStore";
import { formatRupiah } from "../../utils/currency";

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinanceStore();
  const { user } = useAuthStore();
  const { openGmailSyncModal } = useUIStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSource, setFilterSource] = useState("all"); // 'all' | 'auto' | 'manual'
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const isConnected = !!user?.google_refresh_token || !!user?.google_email;

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.wallet?.name &&
        t.wallet.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "all" || t.type === filterType;
    const matchesMonth = !filterMonth || t.date.startsWith(filterMonth);

    const isAuto = t.source && t.source !== "manual";
    const matchesSource =
      filterSource === "all" ||
      (filterSource === "auto" && isAuto) ||
      (filterSource === "manual" && !isAuto);

    return matchesSearch && matchesType && matchesMonth && matchesSource;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const getSourceBadge = (source) => {
    if (!source || source === "manual") return null;

    const lower = source.toLowerCase();
    if (lower.includes("jago")) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
          Bank Jago
        </span>
      );
    }
    if (lower.includes("permata")) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          Permata
        </span>
      );
    }
    if (lower.includes("gopay")) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
          GoPay
        </span>
      );
    }
    if (lower.includes("dana")) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
          DANA
        </span>
      );
    }
    if (lower.includes("ovo")) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 shrink-0">
          OVO
        </span>
      );
    }
    if (lower.includes("shopee") || lower.includes("seabank")) {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 shrink-0">
          ShopeePay
        </span>
      );
    }

    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
        Bank Auto
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 whitespace-nowrap">
            All Transactions
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage automated and manual income & expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start xl:justify-end gap-2.5 w-full xl:w-auto">
          {/* Modal Trigger Action */}
          <button
            onClick={openGmailSyncModal}
            className="flex items-center gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 cursor-pointer transition-all shrink-0"
            title={
              isConnected
                ? `Sync Center (${user?.google_email || user?.email})`
                : "Connect Gmail to enable automatic sync"
            }
          >
            <RefreshCw size={15} />
            <span>{isConnected ? "Sync Bank (Gmail)" : "Connect Bank"}</span>
          </button>

          {/* Search Bar */}
          <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-gray-100 flex items-center gap-2 w-full sm:w-52 text-xs">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="bg-transparent border-none outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Month Filter */}
          <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-gray-100 flex items-center gap-2 text-xs">
            <Calendar size={16} className="text-gray-400 shrink-0" />
            <input
              type="month"
              className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer w-full text-xs"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-gray-100 flex items-center gap-2 text-xs">
            <Filter size={16} className="text-gray-400 shrink-0" />
            <select
              className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer w-full text-xs"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-gray-100 flex items-center gap-2 text-xs">
            <Layers size={16} className="text-gray-400 shrink-0" />
            <select
              className="bg-transparent border-none outline-none font-medium text-gray-700 cursor-pointer w-full text-xs"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              <option value="all">All Sources</option>
              <option value="auto">Bank / Gmail (Auto)</option>
              <option value="manual">Manual Input</option>
            </select>
          </div>
        </div>
      </header>

      {/* Table Container */}
      <div className="bg-white rounded-3xl md:rounded-4xl shadow-soft overflow-hidden flex-1 flex flex-col border border-gray-50">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Transaction & Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Wallet / Bank
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                  Action
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
                    {/* Transaction Title & Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            t.type === "income"
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {t.type === "income" ? (
                            <ArrowDownLeft size={18} />
                          ) : (
                            <ArrowUpRight size={18} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-sm">
                              {t.title}
                            </span>
                            {getSourceBadge(t.source)}
                          </div>
                          {t.notes && (
                            <p
                              className="text-[11px] text-gray-400 font-normal truncate max-w-xs mt-0.5"
                              title={t.notes}
                            >
                              {t.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                      {t.category?.name || "Other"}
                    </td>

                    {/* Wallet */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-medium">
                      <span className="bg-gray-100/80 px-2.5 py-1 rounded-lg font-semibold text-gray-700">
                        {t.wallet?.name || "Wallet"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-medium">
                      {new Date(t.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Amount */}
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                        t.type === "income" ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"} {formatRupiah(t.amount)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Delete Transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="opacity-20 mb-2" />
                      <p className="font-medium text-sm">
                        No transactions found.
                      </p>
                      <p className="text-xs opacity-70">
                        Try adjusting your search keywords, month filter, type,
                        or source.
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
