/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import {
  X,
  User,
  Mail,
  Camera,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useAuthStore } from "../../store/useAuthStore";

const ProfileModal = () => {
  const { isProfileModalOpen, closeProfileModal } = useUIStore();
  const { user, updateProfile, requestPasswordResetLink } = useAuthStore();

  // Profile Form States
  const [profileErrors, setProfileErrors] = useState({});
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [name, setName] = useState("");

  // Password Reset Link States
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetStatus, setResetStatus] = useState({ success: null, message: "" });
  const [countdown, setCountdown] = useState(0);

  // Initialize data when modal opens
  useEffect(() => {
    if (user && isProfileModalOpen) {
      setName(user.name || "");
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
      setProfileErrors({});
      setProfileSuccessMsg("");
      setResetStatus({ success: null, message: "" });
    }
  }, [user, isProfileModalOpen]);

  // Countdown timer for email resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isProfileModalOpen) return null;

  // Handle Avatar Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileErrors((prev) => ({
          ...prev,
          avatar: "Maximum photo size is 2MB!",
        }));
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setProfileErrors((prev) => ({ ...prev, avatar: null }));
    }
  };

  // Handle Save Profile (Name & Avatar)
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    const errors = {};

    if (!name.trim()) {
      errors.name = "Full name cannot be empty!";
    }

    if (Object.keys(errors).length > 0) {
      return setProfileErrors(errors);
    }

    setIsProfileSaving(true);
    const payload = new FormData();
    payload.append("name", name);
    if (avatarFile) {
      payload.append("avatar", avatarFile);
    }

    const result = await updateProfile(payload);
    setIsProfileSaving(false);

    if (result.success) {
      setProfileSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        setProfileSuccessMsg("");
      }, 3000);
    } else {
      setProfileErrors({ server: result.message });
    }
  };

  // Handle Send Password Verification Link via Email
  const handleSendPasswordResetLink = async () => {
    if (countdown > 0 || isSendingReset) return;

    setIsSendingReset(true);
    setResetStatus({ success: null, message: "" });

    const result = await requestPasswordResetLink(user?.email);
    setIsSendingReset(false);

    if (result.success) {
      setResetStatus({
        success: true,
        message:
          result.message ||
          "Password reset verification link has been sent to your email! Check your inbox or spam folder.",
      });
      setCountdown(60); // 60 seconds cooldown
    } else {
      setResetStatus({
        success: false,
        message: result.message || "Failed to send verification link.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header Modal */}
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 via-white to-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 flex items-center gap-1">
                <Sparkles size={12} /> My Account
              </span>
            </div>
            <h3 className="font-bold text-xl md:text-2xl text-gray-900 tracking-tight">
              Profile & Security Settings
            </h3>
            <p className="text-xs md:text-sm text-gray-500">
              Manage your personal information and password change verification.
            </p>
          </div>
          <button
            onClick={closeProfileModal}
            className="p-2.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body: 2 Cards (Profile & Change Password) */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/40">
          {/* =========================================
              CARD 1: USER PROFILE DATA
              ========================================= */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base">
                      Profile Information
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Photo & Display Name
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className={`w-24 h-24 rounded-full shadow-md border-4 object-cover transition-all group-hover:brightness-75 ${
                        profileErrors.avatar ? "border-red-500" : "border-white"
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-24 h-24 rounded-full shadow-md border-4 flex items-center justify-center bg-gray-100 text-gray-400 transition-all group-hover:brightness-95 ${
                        profileErrors.avatar ? "border-red-500" : "border-white"
                      }`}
                    >
                      <User size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                    <Camera size={22} className="text-white drop-shadow-md" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {profileErrors.avatar ? (
                  <span className="text-xs text-red-500 mt-2 font-medium">
                    {profileErrors.avatar}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-xs text-brand-600 hover:text-brand-700 mt-2 font-semibold cursor-pointer transition-colors"
                  >
                    Change Profile Photo
                  </button>
                )}
              </div>

              {/* Form Input */}
              <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
                {profileErrors.server && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl font-medium border border-red-100 flex items-center gap-2">
                    <AlertCircle size={15} />
                    {profileErrors.server}
                  </div>
                )}

                {profileSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-600 text-xs p-3 rounded-xl font-medium border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    {profileSuccessMsg}
                  </div>
                )}

                {/* Email (Read-only) */}
                <div>
                  <div className="flex items-center justify-between mb-1 ml-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Email
                    </label>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Permanent & Verified
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 text-gray-500 rounded-xl outline-none border border-gray-200/60 text-xs font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div
                      className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                        profileErrors.name ? "text-red-400" : "text-gray-400"
                      }`}
                    >
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (profileErrors.name) {
                          setProfileErrors({ ...profileErrors, name: null });
                        }
                      }}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl outline-none border transition-all text-xs font-semibold text-gray-800 ${
                        profileErrors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-200 focus:border-brand-500 focus:bg-white"
                      }`}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                      {profileErrors.name}
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Save Profile Button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                type="submit"
                form="profile-form"
                disabled={isProfileSaving}
                className="w-full bg-[#5b58ff] hover:bg-[#4a47e6] disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isProfileSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>

          {/* =========================================
              CARD 2: CHANGE PASSWORD CARD (SECURITY)
              ========================================= */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/20 to-white rounded-2xl md:rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col justify-between">
            <div>
              {/* Security Card Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center font-bold">
                    <KeyRound size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base">
                      Change Password
                    </h4>
                    <span className="text-[11px] text-indigo-500 font-semibold">
                      Email Link Verification
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100/70 text-indigo-700 flex items-center gap-1">
                  <ShieldCheck size={12} /> Secure
                </span>
              </div>

              {/* Security Explanation */}
              <div className="bg-white/90 rounded-2xl p-4 border border-indigo-100/80 mb-4 shadow-xs">
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  For account security, password changes require verification via a secure link sent directly to your registered email:
                </p>
                <div className="mt-3 flex items-center gap-2 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/60 text-xs font-bold text-indigo-900">
                  <Mail size={15} className="text-indigo-500 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>

              {/* Expiration and Usage Notes */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-[11px] text-gray-500">
                  <span className="text-indigo-500 mt-0.5 font-bold">•</span>
                  <span>Secure verification link is valid for <strong>60 minutes</strong>.</span>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-gray-500">
                  <span className="text-indigo-500 mt-0.5 font-bold">•</span>
                  <span>Click the link in the email to set your new password.</span>
                </div>
              </div>

              {/* Status Alert Notification */}
              {resetStatus.message && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium border flex items-start gap-2.5 mb-2 ${
                    resetStatus.success
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  {resetStatus.success ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">{resetStatus.message}</p>
                </div>
              )}
            </div>

            {/* Action Button: Send Verification Link */}
            <div className="mt-6 pt-4 border-t border-indigo-100/60">
              <button
                type="button"
                onClick={handleSendPasswordResetLink}
                disabled={isSendingReset || countdown > 0}
                className="w-full bg-gradient-to-r from-[#5b58ff] to-[#4338ca] hover:from-[#4e4bf5] hover:to-[#3730a3] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isSendingReset ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending Verification Link...
                  </>
                ) : countdown > 0 ? (
                  <>Resend Link ({countdown}s)</>
                ) : (
                  <>
                    <Send size={15} />
                    Send Password Verification Link
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
                Check your Spam folder if the email does not appear in your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
