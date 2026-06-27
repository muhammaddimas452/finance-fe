import { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  AlignEndHorizontal,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useAuthStore } from "../../store/useAuthStore";

const AuthModal = () => {
  const { isAuthModalOpen, authMode, setAuthMode, closeAuthModal } =
    useUIStore();
  const { login, register } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 1. State penampung error
  const [errors, setErrors] = useState({});

  if (!isAuthModalOpen) return null;

  // Fungsi untuk menangani perubahan input dan menghapus pesan error otomatis
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    // Hapus error dari server saat user mulai mengetik ulang
    if (errors.server) {
      setErrors({ ...errors, server: null });
    }
  };

  // Fungsi untuk pindah tab agar form dan error tereset bersih
  const handleTabSwitch = (mode) => {
    setAuthMode(mode);
    setErrors({});
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 2. Logika Validasi (Regex untuk format Email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validasi khusus Register
    if (authMode === "register" && !formData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi!";
    }

    // Validasi umum (Email & Password)
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi!";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid!";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter!";
    }

    // Jika ada error, tampilkan dan hentikan proses
    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    let result;
    if (authMode === "login") {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password);
    }

    // 3. Penanganan Hasil dari Server
    if (result.success) {
      closeAuthModal();
      setFormData({ name: "", email: "", password: "" });
      setErrors({});
    } else {
      // Tampilkan error dari server (misal: email sudah terdaftar / password salah)
      setErrors({ server: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => {
              closeAuthModal();
              setErrors({});
            }}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center font-bold text-2xl mb-4 shadow-lg shadow-brand-500/30 bg-brand-500">
            <AlignEndHorizontal />
          </div>
          <h3 className="font-bold text-2xl text-gray-800">
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {authMode === "login"
              ? "Masuk untuk mengelola keuanganmu."
              : "Mulai perjalanan finansialmu hari ini."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm cursor-pointer font-bold rounded-xl transition-all ${
              authMode === "login"
                ? "bg-white text-brand-500 shadow-sm"
                : "text-gray-400"
            }`}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm cursor-pointer font-bold rounded-xl transition-all ${
              authMode === "register"
                ? "bg-white text-brand-500 shadow-sm"
                : "text-gray-400"
            }`}
            onClick={() => handleTabSwitch("register")}
          >
            Register
          </button>
        </div>

        {/* Notifikasi Error dari Server */}
        {errors.server && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 font-medium text-center border border-red-100">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama (Hanya untuk Register) */}
          {authMode === "register" && (
            <div>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.name ? "text-red-400" : "text-gray-400"}`}
                >
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Lengkap"
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 text-red-500 bg-red-50/30"
                      : "border-transparent focus:border-brand-500 focus:bg-white text-gray-800"
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
          )}

          {/* Input Email */}
          <div>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.email ? "text-red-400" : "text-gray-400"}`}
              >
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 text-red-500 bg-red-50/30"
                    : "border-transparent focus:border-brand-500 focus:bg-white text-gray-800"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Input Password */}
          <div>
            <div className="relative">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${errors.password ? "text-red-400" : "text-gray-400"}`}
              >
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-sm font-medium ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 text-red-500 bg-red-50/30"
                    : "border-transparent focus:border-brand-500 focus:bg-white text-gray-800"
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
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 cursor-pointer transition-all mt-4"
          >
            {authMode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
