import { Search, MoreHorizontal, UserIcon } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BalanceCard from "../../components/ui/BalanceCard";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";
import { useAuthStore } from "../../store/useAuthStore";
import { useUIStore } from "../../store/useUIStore";

const Dashboard = () => {
  const { transactions } = useFinanceStore();
  const { user, isAuthenticated } = useAuthStore();
  const { setIsRightPanelOpen } = useUIStore();
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((total, t) => total + parseFloat(t.amount || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + parseFloat(t.amount || 0), 0);
  const netIncome = totalIncome - totalExpense;
  totalIncome > 0 ? Math.round((netIncome / totalIncome) * 100) : 0;
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const currentMonthIndex = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    let d = new Date();
    d.setMonth(currentMonthIndex - 5 + i);
    return monthNames[d.getMonth()];
  });
  let historyData = last6Months.map((month) => ({
    name: month,
    income: 0,
    expense: 0,
  }));
  transactions.forEach((t) => {
    if (!t.date) return;
    const tMonth = monthNames[new Date(t.date).getMonth()];
    const monthEntry = historyData.find((m) => m.name === tMonth);
    if (monthEntry) {
      if (t.type === "income") monthEntry.income += parseFloat(t.amount || 0);
      if (t.type === "expense") monthEntry.expense += parseFloat(t.amount || 0);
    }
  });
  const cashFlowData = historyData.map((m) => ({
    name: m.name,
    balance: m.income - m.expense,
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header Area */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        {/* Search Bar */}
        <div className="hidden md:flex bg-white px-4 py-3 rounded-2xl shadow-soft text-gray-400 items-center gap-3 w-72">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
          />
        </div>
        {/* TOMBOL PROFILE */}
        <button
          onClick={() => setIsRightPanelOpen(true)}
          className="hidden md:flex lg:hidden w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white hover:ring-2 hover:ring-[#5b58ff] transition-all cursor-pointer bg-gray-100 items-center justify-center"
        >
          {isAuthenticated && user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon size={20} className="text-gray-400" />
          )}
        </button>
      </header>
      {/* Grid Layout untuk Konten */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ROW 1: Balance Card (Kiri 5/12) & Exchange Rates (Kanan 7/12) */}
        <div className="xl:col-span-5 h-55">
          <BalanceCard />
        </div>
        <div className="xl:col-span-7 bg-white rounded-4xl p-6 shadow-soft h-62.5 xl:h-55 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Cash Flow Trend</h3>
            <span className="text-xs font-semibold text-gray-400">
              Last 6 Months
            </span>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#A0AEC0" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#A0AEC0" }}
                  dx={-10}
                  width={60}
                />
                <Tooltip
                  cursor={{ stroke: "#e0e0ff", strokeWidth: 2 }}
                  formatter={(value) => formatRupiah(value)}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#5b58ff"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#5b58ff",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* ROW 2: History (Kiri 7/12) & Efficiency (Kanan 5/12) */}
        <div className="xl:col-span-7 bg-white rounded-4xl p-6 shadow-soft h-75 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Income vs Expense</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData} barSize={8}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#A0AEC0" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#A0AEC0" }}
                  dx={-10}
                  width={60}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  formatter={(value) => formatRupiah(value)}
                />
                <Bar
                  dataKey="income"
                  fill="#5b58ff"
                  radius={[10, 10, 10, 10]}
                />
                <Bar
                  dataKey="expense"
                  fill="#ffb3c6"
                  radius={[10, 10, 10, 10]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div> Income
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ffb3c6]"></div> Expense
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
