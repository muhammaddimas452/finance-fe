import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/axios";
import { MailCheck, Loader2, LogOut } from "lucide-react";

const OtpVerification = () => {
  const { user, setUser, logout } = useAuthStore();
  const [otpCode, setOtpCode] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg("");

    try {
      const response = await api.post("/email/verify-otp", {
        otp_code: otpCode,
      });
      setUser(response.data.user);
    } catch (error) {
      setIsError(true);
      setStatusMsg(
        error.response?.data?.message || "An error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    setStatusMsg("");
    setIsError(false);

    try {
      const response = await api.post("/email/resend-otp");
      setIsError(false);
      setStatusMsg(response.data.message || "New OTP code sent.");
      setCountdown(60);
    } catch (error) {
      setIsError(true);
      setStatusMsg(
        error.response?.data?.message || "Failed to resend code.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-4xl shadow-xl p-8 text-center relative">
        <button
          onClick={logout}
          className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Cancel and Log Out"
        >
          <LogOut size={16} /> Log Out
        </button>

        {/* Icon & Header */}
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-500">
          <MailCheck size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Check Your Email
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          We have sent a 6-digit OTP code to <br />
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
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/[^0-9]/g, ""))
              }
              className="w-full text-center text-3xl font-bold tracking-[0.5em] border-b-2 border-gray-200 py-3 focus:outline-none focus:border-brand-500 transition-colors bg-transparent"
              autoFocus
            />
          </div>

          {/* Error / Success Message */}
          {statusMsg && (
            <p
              className={`text-sm font-medium ${isError ? "text-red-500" : "text-green-500"}`}
            >
              {statusMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={otpCode.length !== 6 || isLoading}
            className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify Now"
            )}
          </button>
        </form>

        {/* Resend Link */}
        <div className="mt-8 text-sm text-gray-500">
          Didn&apos;t receive the email?{" "}
          <button
            onClick={handleResend}
            disabled={countdown > 0 || isLoading}
            className={`font-semibold transition-colors ${
              countdown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-brand-500 hover:underline cursor-pointer"
            }`}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
