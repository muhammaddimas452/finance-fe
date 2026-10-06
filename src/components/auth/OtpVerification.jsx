import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/axios"; // Sesuaikan dengan instance axios Anda
import { MailCheck, Loader2, LogOut } from "lucide-react";

const OtpVerification = () => {
  const { user, setUser, logout } = useAuthStore(); 
  const [otpCode, setOtpCode] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg("");
    
    try {
      const response = await api.post("/email/verify-otp", { otp_code: otpCode });
      
      // Update state user di Zustand agar memiliki email_verified_at
      // Ini akan otomatis memicu aplikasi untuk mengalihkan user ke Dashboard
      setUser(response.data.user); 
      
    } catch (error) {
      setIsError(true);
      setStatusMsg(error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setStatusMsg("");
    setIsError(false);
    
    try {
      const response = await api.post("/email/resend-otp");
      setIsError(false);
      setStatusMsg(response.data.message);
    } catch (error) {
      setIsError(true);
      setStatusMsg(error.response?.data?.message || "Gagal mengirim ulang kode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-4xl shadow-xl p-8 text-center">
        
        <button 
          onClick={logout}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Batal dan Keluar"
        >
          <LogOut size={16} /> Keluar
        </button>

        {/* Icon & Header */}
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-500">
          <MailCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cek Email Anda</h2>
        <p className="text-sm text-gray-500 mb-8">
          Kami telah mengirimkan 6 digit kode OTP ke email <br/>
          <strong className="text-gray-800">{user?.email}</strong>
        </p>

        {/* Form OTP */}
        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <div>
            <input
              type="text"
              maxLength="6"
              placeholder="••••••"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))} // Hanya terima angka
              className="w-full text-center text-3xl font-bold tracking-[0.5em] border-b-2 border-gray-200 py-3 focus:outline-none focus:border-brand-500 transition-colors bg-transparent"
              autoFocus
            />
          </div>

          {/* Pesan Error / Sukses */}
          {statusMsg && (
            <p className={`text-sm font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {statusMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={otpCode.length !== 6 || isLoading}
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verifikasi Sekarang"}
          </button>
        </form>

        {/* Resend Link */}
        <div className="mt-8 text-sm text-gray-500">
          Belum menerima email?{" "}
          <button 
            onClick={handleResend}
            disabled={isLoading}
            className="text-brand-500 font-semibold hover:underline disabled:opacity-50"
          >
            Kirim Ulang
          </button>
        </div>

      </div>
    </div>
  );
};

export default OtpVerification;