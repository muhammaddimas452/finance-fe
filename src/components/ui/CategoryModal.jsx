/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const CategoryModal = () => {
  const { isCategoryModalOpen, categoryEditData, closeCategoryModal } =
    useUIStore();
  const { addCategory, updateCategory } = useFinanceStore();

  const [name, setName] = useState("");
  const [type, setType] = useState("expense");

  useEffect(() => {
    if (categoryEditData) {
      setName(categoryEditData.name);
      setType(categoryEditData.type);
    } else {
      setName("");
      setType("expense");
    }
  }, [categoryEditData, isCategoryModalOpen]);

  if (!isCategoryModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return alert("Nama kategori tidak boleh kosong!");

    if (categoryEditData) {
      updateCategory(categoryEditData.id, { name, type });
    } else {
      addCategory({ name, type });
    }
    closeCategoryModal();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">
            {categoryEditData ? "Edit Kategori" : "Kategori Baru"}
          </h3>
          <button
            onClick={closeCategoryModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              Tipe Kategori
            </label>
            <div className="flex bg-gray-50 p-1.5 rounded-2xl">
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${type === "expense" ? "bg-white text-brand-500 shadow-sm" : "text-gray-400"}`}
                onClick={() => setType("expense")}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${type === "income" ? "bg-white text-brand-500 shadow-sm" : "text-gray-400"}`}
                onClick={() => setType("income")}
              >
                Pemasukan
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
              Nama Kategori
            </label>
            <input
              type="text"
              placeholder="Contoh: Hiburan, Bonus, Investasi"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <button className="w-full bg-brand-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all mt-2">
            {categoryEditData ? "Simpan Perubahan" : "Buat Kategori"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
