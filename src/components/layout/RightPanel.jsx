import {
  Settings,
  X,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  FilePlus,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore"; // Import store
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";
import Profile from "../../assets/profile.JPEG";

const RightPanel = () => {
  const {
    isRightPanelOpen,
    setIsRightPanelOpen,
    openTransactionModal,
    openTransferModal,
  } = useUIStore();
  const { transactions } = useFinanceStore();

  // Ambil 5 transaksi terbaru saja
  const latestTransactions = transactions.slice(0, 5);

  const quickActions = [
    {
      name: "Income",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50",
      hover: "hover:bg-green-500",
      onClick: () => openTransactionModal("income"),
    },
    {
      name: "Expense",
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-50",
      hover: "hover:bg-red-500",
      onClick: () => openTransactionModal("expense"),
    },
    {
      name: "Transfer",
      icon: ArrowRightLeft,
      color: "text-blue-500",
      bg: "bg-blue-50",
      hover: "hover:bg-blue-500",
      onClick: () => openTransferModal(),
    },
    {
      name: "Bill",
      icon: FilePlus,
      color: " texst-orange-500",
      bg: "bg-orange-50",
      hover: "hover:bg-orange-500",
      onClick: () => alert("Fitur Tagihan akan segera hadir!"),
    },
  ];

  return (
    <aside
      className={`
      absolute lg:relative z-40 bg-white h-full w-80 py-8 px-6 flex flex-col gap-8 border-l border-gray-100
      transition-transform duration-300 ease-in-out right-0
      ${isRightPanelOpen ? "translate-x-0" : "translate-x-full"} 
      lg:translate-x-0 lg:shadow-none shadow-2xl
    `}
    >
      <div className="flex justify-between items-center text-gray-400">
        <button
          className="lg:hidden p-2 bg-gray-50 rounded-full hover:text-gray-800"
          onClick={() => setIsRightPanelOpen(false)} // Gunakan fungsi Zustand
        >
          <X size={20} />
        </button>

        <div className="flex gap-3 ml-auto">
          <button className="hover:text-gray-700">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center">
        <img
          src={Profile}
          alt="Profile"
          className="w-20 h-20 rounded-full mb-3 shadow-md border-4 border-white"
        />
        <h3 className="font-bold text-lg text-gray-800">
          M Dimas Wakhid Wijaya
        </h3>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between px-2">
        {quickActions.map((action) => (
          <div
            key={action.name}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center ${action.color} group-${action.hover} group-hover:text-white transition-colors`}
            >
              <action.icon size={18} />
            </div>
            <span className="text-xs font-medium text-gray-500 group-hover:text-gray-800">
              {action.name}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Transaction Placeholder */}
      <div className="flex-1 mt-4 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800">Recent Transactions</h4>
          <span className="text-xs text-brand-500 font-medium cursor-pointer">
            View All
          </span>
        </div>

        <div className="space-y-4">
          {latestTransactions.map((trx) => (
            <div
              key={trx.id}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${trx.type === "income" ? "bg-green-500" : "bg-red-500"}`}
                >
                  {trx.type === "income" ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-brand-500 transition-colors">
                    {trx.title}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {trx.category}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-bold ${trx.type === "income" ? "text-green-500" : "text-gray-800"}`}
              >
                {trx.type === "income" ? "+" : "-"} {formatRupiah(trx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
