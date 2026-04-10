import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";

const BalanceCard = () => {
  const wallets = useFinanceStore((state) => state.wallets);

  // Hitung total saldo dari semua dompet
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

  return (
    <div className="bg-brand-500 rounded-[2rem] p-6 bg-purple-600 text-white shadow-xl shadow-brand-500/40 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <p className="text-brand-100 text-sm font-medium mb-1">
            Total Balance
          </p>
          <h2 className="text-2xl md:text-2xl font-bold">
            {formatRupiah(totalBalance)}
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
              {wallets[1]?.name || "Bank Account"}
            </p>
            <p className="text-[10px] text-brand-100 uppercase mt-1">
              **** **** 6252
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">
              {formatRupiah(wallets[1]?.balance || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
