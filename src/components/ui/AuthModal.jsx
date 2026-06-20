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

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (authMode === "login") {
      if (!formData.email || !formData.password)
        return alert("Isi email dan password!");
      result = await login(formData.email, formData.password);
    } else {
      if (!formData.name || !formData.email || !formData.password)
        return alert("Lengkapi semua data!");
      result = await register(formData.name, formData.email, formData.password);
    }

    // Jika dari server mengembalikan success: true, baru tutup modalnya
    if (result.success) {
      closeAuthModal();
      setFormData({ name: "", email: "", password: "" });
    } else {
      // Jika gagal (contoh: email sudah terdaftar / password salah)
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-end mb-2">
          <button
            onClick={closeAuthModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center font-bold text-2xl mb-4 shadow-lg shadow-brand-500/30">
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
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === "login" ? "bg-white text-brand-500 shadow-sm" : "text-gray-400"}`}
            onClick={() => setAuthMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === "register" ? "bg-white text-brand-500 shadow-sm" : "text-gray-400"}`}
            onClick={() => setAuthMode("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "register" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-brand-500 focus:bg-white transition-all text-sm font-medium"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all mt-4">
            {authMode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
