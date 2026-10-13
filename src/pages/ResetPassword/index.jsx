import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPasswordWithToken } = useAuthStore();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!token || !email) {
      newErrors.general =
        "Verification link is incomplete. Please ensure you open the complete link from your email.";
      return setErrors(newErrors);
    }

    if (!password) {
      newErrors.password = "New password is required!";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Password confirmation is required!";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match!";
    }

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors);
    }

    setIsLoading(true);
    const result = await resetPasswordWithToken({
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setServerMessage(result.message || "Password updated successfully!");
    } else {
      setErrors({ general: result.message || "Failed to update password." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Brand / Icon Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#5b58ff] to-[#7f7dff] text-white flex items-center justify-center shadow-lg shadow-brand-500/30 mb-4">
            <KeyRound size={30} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isSuccess ? "Password Updated!" : "Create New Password"}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
            {isSuccess
              ? "Your Mooney account password has been updated and is now active."
              : email
              ? `Resetting password for account ${email}`
              : "Enter your new password below"}
          </p>
        </div>

        {/* Missing Token Warning */}
        {(!token || !email) && !isSuccess && (
          <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl p-4 text-xs font-medium mb-6 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Invalid Link</p>
              <p className="text-amber-700 leading-relaxed">
                The verification link does not contain a valid token or email. Please reopen the link from your email or request a new one from your profile.
              </p>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-medium mb-6 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errors.general}</p>
          </div>
        )}

        {/* Success View */}
        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-emerald-800 text-xs font-medium flex items-center gap-3 text-left">
              <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
              <p className="leading-relaxed">{serverMessage}</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-500/25 cursor-pointer transition-all"
            >
              Back & Log In Now
            </button>
          </div>
        ) : (
          /* Form Reset Password */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                New Password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    errors.password ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-xs font-semibold text-gray-800 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-brand-500 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    errors.passwordConfirmation ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  <ShieldCheck size={16} />
                </div>
                <input
                  type={showConfirmation ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                    if (errors.passwordConfirmation)
                      setErrors({ ...errors, passwordConfirmation: null });
                  }}
                  placeholder="Re-enter your new password"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 rounded-xl outline-none border transition-all text-xs font-semibold text-gray-800 ${
                    errors.passwordConfirmation
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-brand-500 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmation(!showConfirmation)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.passwordConfirmation && (
                <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                  {errors.passwordConfirmation}
                </p>
              )}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isLoading || !token || !email}
              className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/25 cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving New Password...
                </>
              ) : (
                "Save & Update Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
