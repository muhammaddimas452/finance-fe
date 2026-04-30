import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";
import { Plus, Wallet, CreditCard, Smartphone } from "lucide-react";

const Wallets = () => {
  const { wallets } = useFinanceStore();

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Wallet":
        return <Wallet size={24} />;
      case "CreditCard":
        return <CreditCard size={24} />;
      case "Smartphone":
        return <Smartphone size={24} />;
      default:
        return <Wallet size={24} />;
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Wallets
        </h1>
        <button className="flex items-center cursor-pointer gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/20">
          <Plus size={18} /> Add Wallet
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
        {wallets.map((w) => (
          <div
            key={w.id}
            className="bg-purple-600 p-6 rounded-[2rem] shadow-soft border border-gray-50 group hover:border-brand-500 transition-all"
          >
            <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
              {getIcon(w.icon)}
            </div>
            <h3 className="font-medium text-sm">{w.name}</h3>
            <p className="text-2xl font-bold mt-1">{formatRupiah(w.balance)}</p>
            <div className="mt-6 pt-4 border-t border-white flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span>Primary Account</span>
              <span className="cursor-pointer">Edit</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallets;
