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
  // 1. Tambahkan state errors di bawah state name dan type
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Reset error sebelumnya dan buat penampung baru
    setErrors({});
    const newErrors = {};

    // 3. Cek validasi
    if (!name.trim()) {
      newErrors.name = "Nama kategori tidak boleh kosong!";
    }

    // 4. Jika ada error, hentikan proses dan tampilkan pesan
    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    // 5. Lanjut ke proses simpan (kode asli Anda)
    if (categoryEditData) {
      const result = await updateCategory(categoryEditData.id, { name, type });
      if (result.success) closeCategoryModal();
    } else {
      const result = await addCategory({ name, type });
      if (result.success) closeCategoryModal();
    }
  };

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
                className={`flex-1 py-2.5 text-sm font-bold cursor-pointer rounded-xl transition-all ${type === "expense" ? "bg-white text-brand-500 shadow-sm" : "text-gray-400"}`}
                onClick={() => setType("expense")}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-bold cursor-pointer rounded-xl transition-all ${type === "income" ? "bg-white text-brand-500 shadow-sm" : "text-gray-400"}`}
                onClick={() => setType("income")}
              >
                Pemasukan
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Nama Kategori
            </label>
            <input
              type="text"
              placeholder="Cth: Makanan, Gaji, dll"
              // Ubah border menjadi merah jika ada error.name
              className={`w-full p-4 bg-gray-50 rounded-2xl outline-none border transition-all text-sm font-medium ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-brand-500 focus:bg-white"
              }`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Hapus error saat user mulai mengetik
                if (errors.name) setErrors({ ...errors, name: null });
              }}
            />
            {/* Tampilkan teks merah di bawah input */}
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          <button className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/30 cursor-pointer transition-all mt-2">
            {categoryEditData ? "Simpan Perubahan" : "Buat Kategori"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
