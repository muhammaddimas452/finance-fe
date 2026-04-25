import {
  LayoutDashboard,
  ArrowRightLeft,
  Tags,
  Wallet,
  PieChart,
  Target,
  HandCoins,
  PiggyBank,
  Download,
  AlignEndHorizontal,
  X,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore"; // Import store
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUIStore();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, active: true, path: "/" }, // MVP
    {
      name: "Transactions",
      icon: ArrowRightLeft,
      active: false,
      path: "/transaction",
    }, // MVP
    { name: "Wallets", icon: Wallet, active: false, path: "/wallets" }, // MVP
    { name: "Categories", icon: Tags, active: false, path: "/categories" }, // MVP
    { name: "Budgets", icon: Target, active: false, path: "/budgets" }, // Menengah
    { name: "Debts", icon: HandCoins, active: false, path: "/debts" }, // Menengah
    { name: "Reports", icon: PieChart, active: false, path: "/reports" }, // Menengah
    { name: "Savings Goals", icon: PiggyBank, active: false, path: "/savings" }, // Lanjutan
  ];

  return (
    <aside
      className={`
      absolute md:relative z-40 bg-white h-full w-64 flex flex-col justify-between py-8 px-6
      transition-transform duration-300 ease-in-out
      ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 md:shadow-none shadow-2xl
    `}
    >
      {/* Header Sidebar: Tambahkan tombol Close untuk Mobile */}
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-black font-bold text-xl">
            <AlignEndHorizontal />
          </div>
          <span className="text-xl font-bold text-gray-800">mooney</span>
        </div>

        <button
          className="md:hidden p-1 text-gray-400 hover:text-gray-800"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 pb-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)} // Tutup menu saat klik
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand-50 text-brand-500 relative before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-brand-500 before:rounded-r-md'
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon
                size={20}
                className={item.active ? "text-brand-500" : ""}
              />
              <span
                className={`font-medium ${item.active ? "text-brand-500" : ""}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Promo Card (Disembunyikan di layar HP kecil agar tidak menumpuk) */}
      <div className=" sm:block bg-brand-50 rounded-3xl p-5 text-center mt-auto">
        <div className="bg-[#fbfbfe] w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-sm">
          <Download size={24} className="text-brand-500" />
        </div>
        <h4 className="font-semibold text-gray-800 text-sm mb-1">
          Export Data
        </h4>
        <p className="text-xs text-gray-500 mb-4">Download Excel/PDF</p>
        <button className="w-full bg-brand-500 text-black text-sm font-medium py-3 rounded-2xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30">
          Export Now
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
