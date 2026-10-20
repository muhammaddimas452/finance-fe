import { useMemo, useEffect } from "react";
import { Clock, AlertCircle, CalendarCheck } from "lucide-react";
import { useBillStore } from "../../store/useBillStore";
import { formatRupiah } from "../../utils/currency";

const UpcomingBillsWidget = () => {
  const { bills, fetchBills } = useBillStore();

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Logika untuk menghitung sisa hari dan mengurutkan tagihan terdekat
  const upcomingBills = useMemo(() => {
    if (!bills || bills.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset jam agar perhitungan hari akurat

    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const unpaidBills = bills.filter((bill) => !bill.is_paid);

    const processedBills = unpaidBills.map((bill) => {
      let dueDay = parseInt(bill.due_date, 10);
      let nextDueDate = new Date(currentYear, currentMonth, dueDay);

      // Jika tanggal tagihan bulan ini sudah lewat, maka tagihan berikutnya adalah bulan depan
      if (dueDay < currentDay) {
        nextDueDate = new Date(currentYear, currentMonth + 1, dueDay);
      }

      // Hitung selisih waktu ke hari (1 hari = 1000ms * 60s * 60m * 24h)
      const diffTime = nextDueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return { ...bill, diffDays };
    });

    // Urutkan dari hari terdekat (paling kecil) ke terjauh, lalu ambil maksimal 3 saja
    return processedBills.sort((a, b) => a.diffDays - b.diffDays).slice(0, 3);
  }, [bills]);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Upcoming Bills
        </h3>
        <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <Clock size={12} /> Soonest
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 justify-center">
        {upcomingBills.length > 0 ? (
          upcomingBills.map((bill) => (
            <div
              key={bill.id}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
                bill.diffDays <= 3
                  ? "bg-red-50/50 border-red-100"
                  : "bg-gray-50 border-gray-100 hover:border-brand-200"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm">
                  {bill.title}
                </span>
                <span
                  className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${
                    bill.diffDays === 0
                      ? "text-red-600"
                      : bill.diffDays <= 3
                        ? "text-orange-500"
                        : "text-gray-400"
                  }`}
                >
                  {bill.diffDays === 0 ? (
                    <>
                      <AlertCircle size={12} /> Today!
                    </>
                  ) : bill.diffDays === 1 ? (
                    "Tomorrow"
                  ) : (
                    `In ${bill.diffDays} days (Date ${bill.due_date})`
                  )}
                </span>
              </div>
              <span className="font-bold text-gray-900 text-sm">
                {formatRupiah(bill.amount)}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-4 opacity-60">
            <CalendarCheck size={32} className="text-gray-300 mb-2" />
            <p className="text-xs text-gray-400 font-medium">
              No bills saved yet.
              <br />
              All safe!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBillsWidget;
