import { useState, useEffect, useRef } from "react";
import { X, User, Lock, Mail, Camera } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useAuthStore } from "../../store/useAuthStore";

const ProfileModal = () => {
  const { isProfileModalOpen, closeProfileModal } = useUIStore();
  const { user, updateProfile } = useAuthStore();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 1. Tambahkan referensi dan state untuk urusan foto
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Isi otomatis form saat modal dibuka
  useEffect(() => {
    if (user && isProfileModalOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
      // Set preview foto awal dari database
      setAvatarPreview(user.avatar || "https://ui-avatars.com/api/?name=User");
      setAvatarFile(null); // Kosongkan file yang siap diupload
      setErrors({});
    }
  }, [user, isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    if (errors.server) setErrors({ ...errors, server: null });
  };

  // 2. Fungsi saat user memilih foto dari komputernya
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran maksimal 2MB
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "Ukuran gambar maksimal 2MB!" });
        return;
      }

      setAvatarFile(file); // Simpan file asli untuk dikirim ke backend
      setAvatarPreview(URL.createObjectURL(file)); // Buat URL lokal untuk preview di modal
      if (errors.avatar) setErrors({ ...errors, avatar: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validasi
    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap tidak boleh kosong!";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password baru minimal 6 karakter!";
    }

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    setIsLoading(true);

    // 3. UBAH KE FORMDATA (Wajib jika ada upload file)
    const payload = new FormData();
    payload.append("name", formData.name);

    if (formData.password) {
      payload.append("password", formData.password);
    }
    if (avatarFile) {
      payload.append("avatar", avatarFile); // Masukkan file fotonya
    }

    // Kirim payload FormData ke store
    const result = await updateProfile(payload);

    setIsLoading(false);

    if (result.success) {
      closeProfileModal();
    } else {
      setErrors({ server: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-gray-800">Pengaturan Profil</h3>
          <button
            onClick={closeProfileModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 4. Avatar Section yang Bisa Diklik */}
        <div className="flex flex-col items-center mb-6 relative">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current.click()} // Memanggil input file yang disembunyikan
          >
            <img
              src={avatarPreview} // Gunakan state avatarPreview
              alt="Profile"
              className={`w-24 h-24 rounded-full shadow-md border-4 object-cover transition-all group-hover:brightness-75 ${errors.avatar ? "border-red-500" : "border-white"}`}
            />
            {/* Overlay Icon Kamera saat di-hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white drop-shadow-md" />
            </div>
          </div>

          {/* Input tipe File yang disembunyikan */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {errors.avatar ? (
            <span className="text-xs text-red-500 mt-2 font-medium">
              {errors.avatar}
            </span>
          ) : (
            <span
              className="text-xs text-gray-400 mt-2 font-medium hover:text-brand-500 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              Klik foto untuk mengubah
            </span>
          )}
        </div>

        {errors.server && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 font-medium text-center border border-red-100">
            {errors.server}
          </div>
        )}

        {/* Form Profil */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (Disabled/Readonly) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              EMAIL (TETAP)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                className="w-full pl-11 pr-4 py-3 bg-gray-100 text-gray-500 rounded-xl outline-none border border-transparent text-sm font-medium cursor-not-allowed"
                value={formData.email}
                disabled
              />
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              NAMA LENGKAP
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.name ? "text-red-400" : "text-gray-400"}`}
              >
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-brand-500"
                }`}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Ubah Password (Opsional) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 ml-1">
              UBAH PASSWORD (OPSIONAL)
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.password ? "text-red-400" : "text-gray-400"}`}
              >
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Kosongkan jika tidak ingin diubah"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-brand-500"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 cursor-pointer transition-all mt-2"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
