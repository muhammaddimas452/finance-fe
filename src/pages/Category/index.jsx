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
          className="flex items-center justify-center w-full md:w-auto gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </header>

      <div className="flex w-full sm:w-fit bg-white p-1.5 rounded-2xl shadow-soft mb-8 border border-gray-50">
        <button
          type="button"
          className={`flex-1 sm:flex-none px-6 py-2.5 cursor-pointer rounded-xl text-sm font-bold transition-all ${
            activeTab === "expense"
              ? "bg-[#5b58ff] text-white shadow-md"
              : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setActiveTab("expense")}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          className={`flex-1 sm:flex-none px-6 py-2.5 cursor-pointer rounded-xl text-sm font-bold transition-all ${
            activeTab === "income"
              ? "bg-[#5b58ff] text-white shadow-md"
              : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setActiveTab("income")}
        >
          Pemasukan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            // 1. Tambahkan 'relative' di sini agar tombol absolute tidak keluar jalur
            className="relative bg-white p-5 shadow-soft border border-gray-50 flex items-center group overflow-hidden"
          >
            {/* 2. Ikon Tag */}
            <div className="w-12 h-12 shrink-0 bg-brand-50 text-brand-500 rounded-2xl flex items-center justify-center mr-4">
              <Tag size={20} />
            </div>

            {/* 3. Teks Kategori */}
            {/* Tambahkan pr-16 (padding right) agar teks terpotong sebelum tertimpa tombol hover */}
            {/* 3. Teks Kategori (Hapus pr-16, ganti jadi overflow-hidden biasa) */}
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-gray-700 truncate" title={cat.name}>
                {cat.name}
              </p>
            </div>

            {/* 4. Tombol Aksi (JADIKAN ABSOLUTE) */}
            {/* Dengan absolute right-4, tombol melayang di pojok kanan tanpa mengganggu ukuran teks */}
            {/* 4. Tombol Aksi */}
            <div className="right-3 flex gap-1 opacity-100 transition-opacity bg-white pl-4 py-2">
              <button
                onClick={() => openCategoryModal(cat)}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                title="Edit Kategori"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Hapus kategori ini?"))
                    deleteCategory(cat.id);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Hapus Kategori"
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
