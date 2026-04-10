import { Search, MoreHorizontal } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BalanceCard from "../../components/ui/BalanceCard";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";

const Dashboard = () => {
  // 1. Ambil data transaksi dari global state
  const { transactions } = useFinanceStore();

  // 2. Hitung Efisiensi (Total Pemasukan vs Total Pengeluaran)
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  // Data untuk Donut Chart
  const efficiencyData = [
    {
      name: "Income",
      value: totalIncome > 0 ? totalIncome : 1,
      color: "#5b58ff",
    },
    { name: "Expense", value: totalExpense, color: "#ffb3c6" },
  ];

  // Hitung persentase sisa uang (Net) dari Income
  const netIncome = totalIncome - totalExpense;
  const efficiencyPercentage =
    totalIncome > 0 ? Math.round((netIncome / totalIncome) * 100) : 0;

  // 3. Proses Data untuk Bar Chart (History 6 Bulan Terakhir)
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

  // Buat array 6 bulan ke belakang
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    let d = new Date();
    d.setMonth(currentMonthIndex - 5 + i);
    return monthNames[d.getMonth()];
  });

  // Siapkan template wadah data per bulan
  let historyData = last6Months.map((month) => ({
    name: month,
    income: 0,
    expense: 0,
  }));

  // Masukkan data transaksi asli ke dalam bulan yang sesuai
  transactions.forEach((t) => {
    const tMonth = monthNames[new Date(t.date).getMonth()];
    const monthEntry = historyData.find((m) => m.name === tMonth);
    if (monthEntry) {
      if (t.type === "income") monthEntry.income += t.amount;
      if (t.type === "expense") monthEntry.expense += t.amount;
    }
  });

  // 4. Data untuk Line Chart (Cash Flow Trend = Income - Expense per bulan)
  const cashFlowData = historyData.map((m) => ({
    name: m.name,
    balance: m.income - m.expense, // Saldo bersih bulan tersebut
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Header Area */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <div className="hidden md:flex bg-white px-4 py-3 rounded-2xl shadow-soft text-gray-400 items-center gap-3 w-72">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
          />
        </div>

        <button
          className="hidden md:flex lg:hidden w-10 h-10 rounded-full overflow-hidden border-2 border-brand-500 shadow-sm"
          onClick={() => {
            /* Trigger buka RightPanel sudah dihandle oleh global state sebelumnya jika Anda pindahkan ke MainLayout */
          }}
        >
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </header>
      {/* Grid Layout untuk Konten */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ROW 1: Balance Card (Kiri 5/12) & Exchange Rates (Kanan 7/12) */}
        <div className="xl:col-span-5 h-[220px]">
          <BalanceCard />
        </div>

        <div className="xl:col-span-7 bg-white rounded-[2rem] p-6 shadow-soft h-[250px] xl:h-[220px] flex flex-col">
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
        <div className="xl:col-span-7 bg-white rounded-[2rem] p-6 shadow-soft h-[300px] flex flex-col">
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

        <div className="xl:col-span-5 bg-white rounded-[2rem] p-6 shadow-soft h-[300px] flex flex-col items-center">
          <div className="flex justify-between items-center w-full mb-2">
            <h3 className="font-bold text-gray-800">Budget Usage</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="flex-1 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Teks di tengah Donut Chart Otomatis */}
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-gray-800">
                {/* Jika net income minus, tampilkan 0 atau Rp 0 */}
                {netIncome > 0 ? formatRupiah(netIncome) : "Rp 0"}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md mt-1 ${efficiencyPercentage > 0 ? "text-brand-500 bg-brand-50" : "text-red-500 bg-red-50"}`}
              >
                {efficiencyPercentage > 0
                  ? `+${efficiencyPercentage}%`
                  : `${efficiencyPercentage}%`}
              </span>
              <span className="text-[9px] text-gray-400 mt-1">Remaining</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
