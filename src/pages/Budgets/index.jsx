import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";
import { Target, AlertCircle } from "lucide-react";

const Budgets = () => {
  const { categories, budgets, transactions } = useFinanceStore();

  const calculateUsage = (categoryId) => {
    const budget = budgets.find((b) => b.categoryId === categoryId);
    if (!budget) return null;

    const currentMonth = new Date().getMonth();
    const totalSpent = transactions
      .filter((t) => {
        const cat = categories.find((c) => c.name === t.category);
        return (
          t.type === "expense" &&
          new Date(t.date).getMonth() === currentMonth &&
          cat?.id === categoryId
        );
      })
      .reduce((acc, t) => acc + t.amount, 0);

    const percentage = (totalSpent / budget.limit) * 100;
    return { limit: budget.limit, spent: totalSpent, percentage };
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Budgeting
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Pantau batas pengeluaran bulanan Anda.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories
          .filter((c) => c.type === "expense")
          .map((cat) => {
            const usage = calculateUsage(cat.id);

            return (
              <div
                key={cat.id}
                className="bg-white rounded-[2rem] p-6 shadow-soft border border-gray-50 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-brand-50 text-brand-500 rounded-2xl">
                    <Target size={24} />
                  </div>
                  {usage?.percentage >= 100 && (
                    <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-lg text-[10px] font-bold animate-pulse">
                      <AlertCircle size={12} /> OVER BUDGET
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {cat.name}
                  </h3>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs text-gray-400 font-medium">
                      {usage
                        ? `${formatRupiah(usage.spent)} terpakai`
                        : "Belum diatur"}
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      {usage ? formatRupiah(usage.limit) : "Rp 0"}
                    </p>
                  </div>

                  {/* Progress Bar Dinamis */}
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        !usage
                          ? "w-0"
                          : usage.percentage >= 100
                            ? "bg-red-500"
                            : usage.percentage >= 80
                              ? "bg-orange-400"
                              : "bg-brand-500"
                      }`}
                      style={{
                        width: `${usage ? Math.min(usage.percentage, 100) : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <button className="mt-6 w-full py-3 rounded-xl border border-dashed border-gray-200 text-gray-400 text-xs font-bold hover:bg-gray-50 hover:text-brand-500 hover:border-brand-500 transition-all">
                  {usage ? "Edit Budget" : "Set Budget"}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Budgets;
