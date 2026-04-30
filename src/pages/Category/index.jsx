import { useState } from "react";
import { useFinanceStore } from "../../store/useFinanceStore";
import { useUIStore } from "../../store/useUIStore";
import { Plus, Trash2, Edit3, Tag } from "lucide-react";

const Categories = () => {
  const { categories, deleteCategory } = useFinanceStore();
  const { openCategoryModal } = useUIStore();
  const [activeTab, setActiveTab] = useState("expense");

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Kategori
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Kelola pos pemasukan dan pengeluaran Anda.
          </p>
        </div>
        <button
          onClick={() => openCategoryModal()}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </header>

      {/* Tab Switcher */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-soft w-fit mb-8 border border-gray-50">
        <button
          type="button"
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "expense" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
          onClick={() => setActiveTab("expense")}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "income" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"}`}
          onClick={() => setActiveTab("income")}
        >
          Pemasukan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white p-5 rounded-[2rem] shadow-soft border border-gray-50 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center">
                <Tag size={20} />
              </div>
              <span className="font-bold text-gray-700">{cat.name}</span>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openCategoryModal(cat)}
                className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Hapus kategori ini?"))
                    deleteCategory(cat.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
