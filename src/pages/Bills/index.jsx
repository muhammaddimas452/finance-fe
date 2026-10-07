import { useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle, Clock, Receipt } from "lucide-react";
import { useBillStore } from "../../store/useBillStore";
import { useUIStore } from "../../store/useUIStore";
import { formatRupiah } from "../../utils/currency";

const Bills = () => {
  const { bills, fetchBills, deleteBill, updateBill } = useBillStore();
  const { openBillModal } = useUIStore();
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);
  const handleTogglePaid = async (bill) => {
    await updateBill(bill.id, { is_paid: !bill.is_paid });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Billing & Subscriptions
        </h1>
        <button
          onClick={() => openBillModal()}
          className="flex items-center cursor-pointer gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] transition-colors text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30"
        >
          <Plus size={18} /> Add Bill / Subscription
        </button>
      </header>

      {bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Receipt size={48} className="mb-4 opacity-50" />
          <p className="font-medium">No bills have been recorded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`relative overflow-hidden p-7 rounded-4xl shadow-xl text-white group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ${
                bill.is_paid
                  ? "bg-linear-to-br from-blue-400 to-blue-600"
                  : "bg-linear-to-br from-red-400 to-red-600"
              }`}
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex justify-between items-start mb-8">
                {/* Ikon Kiri */}
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                  <Receipt size={24} />
                </div>
                {/* Tombol Aksi Kanan */}
                <div className="flex gap-2 opacity-100 translate-x-4">
                  <button
                    onClick={() => handleTogglePaid(bill)}
                    className={`p-2.5 rounded-xl backdrop-blur-md border transition-colors cursor-pointer ${
                      bill.is_paid
                        ? "bg-white/40 border-white/50 text-white hover:bg-white/50" // Aktif (Lunas)
                        : "bg-white/20 border-white/10 text-white hover:bg-white/40" // Non-aktif
                    }`}
                    title={
                      bill.is_paid
                        ? "Cancel Full Payment"
                        : "Mark as Paid for This Month"
                    }
                  >
                    <CheckCircle
                      size={16}
                      fill={bill.is_paid ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    onClick={() => openBillModal(bill)}
                    className="p-2.5 bg-white/20 hover:bg-white/40 border border-white/10 rounded-xl backdrop-blur-md transition-colors cursor-pointer"
                    title="Edit Bill"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete the bill? ${bill.title}?`,
                        )
                      ) {
                        deleteBill(bill.id);
                      }
                    }}
                    className="p-2.5 bg-red-500/80 hover:bg-red-500 border border-red-400/50 rounded-xl backdrop-blur-md transition-colors cursor-pointer"
                    title="Delete Bill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {/* Info Utama Tagihan */}
              <div className="relative z-10">
                <h3 className="font-medium text-white/90 text-sm tracking-wide">
                  {bill.title}
                </h3>
                <p className="text-2xl xl:text-3xl font-bold mt-1 tracking-tight drop-shadow-md truncate w-full">
                  {formatRupiah(bill.amount)}
                </p>
              </div>
              {/* Info Bawah: Jatuh Tempo & Status */}
              <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/90">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{bill.due_date} Every Month</span>
                </div>
                <span>{bill.is_paid ? "PAID" : "UNPAID"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bills;
