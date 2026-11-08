import { useState, useEffect, useRef } from "react";
import {
  User,
  FileText,
  Shield,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import AppSidebar from "../components/AppSidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SettingsPage() {
  const { user, updateUser } = useUser();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultUsername = user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : "salma_ux";
  const initialName = user?.name || "Salma Akther";
  const initialUsername = user?.username || defaultUsername;
  const initialEmail = user?.email || "salma.akther@enterprise.com";

  const [fullName, setFullName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "/assets/avatar-placeholder.jpg");
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [resumeFileName, setResumeFileName] = useState(user?.resume?.name || "No CV uploaded");

  const hasInfoChanged = fullName !== initialName || username !== initialUsername || email !== initialEmail || avatarChanged;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [toast, setToast] = useState(null);

  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type, message) => setToast({ type, message });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      showToast("error", "Image must be PNG or JPG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Image size exceeds 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
      setAvatarChanged(true);
      showToast("success", "Profile photo updated.");
    };
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      showToast("error", "File must be PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File size exceeds 5MB.");
      return;
    }

    setResumeFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      updateUser({ resume: { name: file.name, data: reader.result } });
      showToast("success", "Resume uploaded successfully.");
    };
    reader.readAsDataURL(file);
  };

  const handleSavePersonalInfo = () => {
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      showToast("error", "Please fill in all fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("error", "Email is not valid.");
      return;
    }

    setSavingInfo(true);
    setTimeout(() => {
      updateUser({ name: fullName, username, email, avatar: avatarUrl });
      setAvatarChanged(false);
      setSavingInfo(false);
      showToast("success", "Personal information saved successfully.");
    }, 800);
  };

  const handleSavePassword = () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      updateUser({ password: newPassword });
      setSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("success", "Password changed successfully.");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-primary-light/30 flex flex-col">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      <AppSidebar />

      <div className="flex-1" style={{ marginLeft: 240 }}>
        <Navbar />

        <div className="flex">
          <main className="flex-1 px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Profile &amp; Security
            </h1>
            <p className="text-gray-500 mt-1 mb-6">
              Manage your identity, resume and password — all in one place.
            </p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <User size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Personal Information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Update your photo and personal details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-10">
                  <div className="flex flex-col items-center shrink-0">
                    <label className="cursor-pointer group relative">
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-light"
                      />
                      <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Upload
                          size={18}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                    <p className="text-xs text-gray-400 text-center mt-3 max-w-[140px]">
                      Click the photo to upload a new one. PNG or JPG, max 2MB.
                    </p>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Username
                      </label>
                      <div className="flex items-center px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
                        <span className="text-gray-400 mr-1">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-transparent text-gray-800 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={handleSavePersonalInfo}
                        disabled={savingInfo || !hasInfoChanged}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
                      >
                        {savingInfo ? "Saving..." : "Save Changes"}
                        {!savingInfo && <CheckCircle2 size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileText size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Resume Management
                    </h2>
                    <p className="text-sm text-gray-500">
                      Keep your latest CV on file for applications and sharing.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-primary-light/60 rounded-xl px-4 py-3">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 tracking-wide">
                        CURRENT RESUME
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {resumeFileName}
                      </p>
                    </div>
                    <CheckCircle2 size={18} className="text-green-500 ml-2" />
                  </div>

                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleResumeChange}
                  />
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-5 py-3 rounded-lg transition-colors"
                  >
                    <Upload size={16} />
                    Upload New CV
                  </button>
                </div>
              </section>

              <hr className="border-gray-100" />

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Shield size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Account Security
                    </h2>
                    <p className="text-sm text-gray-500">
                      Choose a strong password you don't use elsewhere.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2.5 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    Use at least 8 characters with a mix of letters, numbers and symbols.
                  </p>

                  {passwordError && (
                    <p className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle size={16} />
                      {passwordError}
                    </p>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={handleSavePassword}
                      disabled={savingPassword}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-medium px-5 py-3 rounded-lg transition-colors"
                    >
                      {savingPassword ? "Saving..." : "Save New Password"}
                      {!savingPassword && <CheckCircle2 size={16} />}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
