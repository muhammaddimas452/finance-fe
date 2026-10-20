import { useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";

const CashflowOverview = () => {
  const { transactions } = useFinanceStore();

  // 1. LOGIKA KALKULASI: Menghitung total bulan ini secara otomatis
  const { totalIncome, totalExpense, expensePercentage } = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Filter transaksi hanya untuk bulan ini
    const thisMonthTransactions = transactions.filter((t) =>
      t.date.startsWith(currentMonth),
    );

    // Jumlahkan pemasukan dan pengeluaran
    let income = 0;
    let expense = 0;

    thisMonthTransactions.forEach((t) => {
      if (t.type === "income") income += Number(t.amount);
      if (t.type === "expense") expense += Number(t.amount);
    });

    // Hitung persentase pengeluaran (cegah pembagian dengan 0)
    let percentage = 0;
    if (income > 0) {
      percentage = (expense / income) * 100;
      if (percentage > 100) percentage = 100; // Maksimal bar 100%
    } else if (expense > 0) {
      percentage = 100; // Jika tidak ada pemasukan tapi ada pengeluaran, bar langsung penuh
    }

    return {
      totalIncome: income,
      totalExpense: expense,
      expensePercentage: percentage,
    };
  }, [transactions]);

  // 2. STRUKTUR VISUAL: Render antarmuka ke layar
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm w-full">
      <h3 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wider">
        Cashflow This Month
      </h3>

      <div className="flex justify-between items-end mb-4">
        {/* Sisi Kiri: Pemasukan */}
        <div>
          <div className="flex items-center gap-1.5 text-gray-500 mb-1">
            <ArrowDownLeft size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold">Income</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatRupiah(totalIncome)}
          </p>
        </div>

        {/* Sisi Kanan: Pengeluaran */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-gray-500 mb-1">
            <ArrowUpRight size={16} className="text-red-500" />
            <span className="text-xs font-semibold">Expense</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {formatRupiah(totalExpense)}
          </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-3.5 bg-gray-100 rounded-full overflow-hidden">
        {/* Bar Pemasukan (Background Hijau) */}
        <div className="absolute inset-0 bg-emerald-400 w-full h-full"></div>

        {/* Bar Pengeluaran (Tumpukan Merah yang bergerak sesuai persentase) */}
        <div
          className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-500 ease-out rounded-r-full"
          style={{ width: `${expensePercentage}%` }}
        ></div>
      </div>

      {/* Indikator Status Singkat */}
      <p className="text-[11px] text-gray-400 font-medium mt-3 text-center">
        {expensePercentage >= 100
          ? "Expense exceeds income this month!"
          : `You have spent ${expensePercentage.toFixed(1)}% of income.`}
      </p>
    </div>
  );
};

export default CashflowOverview;
