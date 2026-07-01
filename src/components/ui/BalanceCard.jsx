import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";
import { Eye, EyeOff } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";

const BalanceCard = () => {
  const wallets = useFinanceStore((state) => state.wallets);

  const { isBalanceHidden, toggleHideBalance } = useUIStore();

  // Hitung total saldo dari semua dompet
  const totalBalance = wallets.reduce((total, wallet) => {
    return total + parseFloat(wallet.balance || 0);
  }, 0);

  const primaryWallet = wallets.find((w) => w.is_primary) || wallets[0] || null;

  return (
    <div className="bg-brand-500 rounded-[2rem] p-6 bg-gradient-to-br from-[#5b58ff] to-[#8a88ff] text-white shadow-xl shadow-brand-500/40 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <p className="text-brand-100 text-sm font-medium mb-1">
            Total Balance
          </p>
          <button
            onClick={toggleHideBalance}
            className="text-brand-100 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
            title={isBalanceHidden ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
          >
            {isBalanceHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <h2 className="text-2xl md:text-2xl font-bold">
            {isBalanceHidden ? "Rp ••••••••" : formatRupiah(totalBalance)}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-brand-100 text-[10px] font-medium mb-1">WALLETS</p>
          <p className="font-bold">
            {wallets.length.toString().padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-xs text-brand-100 mb-2">Primary Wallet</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="font-semibold text-sm">
              {primaryWallet ? primaryWallet.name : "Belum Ada Dompet"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">
              {primaryWallet
                ? formatRupiah(primaryWallet.balance)
                : formatRupiah(0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
