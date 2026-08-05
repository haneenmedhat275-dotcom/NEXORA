import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import Logo from "../assets/LOGO.svg";
import ForgotBg from "../assets/forgot.png";

function ResetStep({ onConfirm, onLoginClick }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await onConfirm(password);
    } catch (err) {
      setError(err.response?.data?.message || "This reset link is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <img src={ForgotBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      <a href="/" className="mb-10 flex items-center gap-2">
        <img src={Logo} alt="Nexora" style={{ width: "184px", height: "62px" }} />
      </a>

      <h1 className="text-[28px] font-bold text-slate-900">Reset Your password</h1>
      <p className="mt-2 text-[14px] text-slate-500">Don&apos;t worry! We&apos;ll help you recover your account.</p>

      <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_-4px_rgba(124,58,237,0.15)]">
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-[13px] leading-5 text-slate-500">
            Choose a strong password that includes letters, numbers, and symbols to better protect your account.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-slate-800">Password</label>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-[14px] text-slate-800 placeholder-slate-400 outline-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}>
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={showPass ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-slate-800">Confirm Password</label>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Enter Your Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full text-[14px] text-slate-800 placeholder-slate-400 outline-none"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={showConfirm ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-semibold text-primary">Password requirements:</p>
          <ul className="mt-1 space-y-0.5">
            {["At least 8 characters", "At least one capital letter (optional)", "At least one number (optional)"].map((r) => (
              <li key={r} className="text-[12px] text-slate-500">{r}</li>
            ))}
          </ul>
        </div>

        {error && (
          <p className="mt-3 text-[13px] text-red-500 text-center">{error}</p>
        )}

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-slate-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Confirm new password"}
        </button>

        <button
          onClick={onLoginClick}
          className="mt-4 flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-primary hover:text-primary-hover"
        >
          Return to login
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SuccessStep({ onDashboard }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <img src={ForgotBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      <a href="/" className="mb-10 flex items-center gap-2">
        <img src={Logo} alt="Nexora" style={{ width: "184px", height: "62px" }} />
      </a>

      <h1 className="text-[28px] font-bold text-slate-900">Password Changed Successfully!</h1>
      <p className="mt-2 text-[14px] text-slate-500">You can now access your account with your new password.</p>

      <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_-4px_rgba(124,58,237,0.15)] text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
          <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="mt-5 text-[18px] font-bold text-slate-900">Password Changed Successfully!</h2>
        <p className="mt-2 text-[13px] leading-6 text-slate-500">
          Your password has been updated, and you've been logged in with it automatically.
        </p>

        <button
          onClick={onDashboard}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
        >
          Go to Dashboard
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage({ onLoginClick }) {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loginWithToken } = useUser();
  const [step, setStep] = useState("reset");

  const handleConfirm = async (password) => {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    if (res.data.token) {
      await loginWithToken(res.data.token);
    }
    setStep("success");
  };

  if (step === "success") {
    return <SuccessStep onDashboard={() => navigate("/dashboard", { replace: true })} />;
  }

  return <ResetStep onConfirm={handleConfirm} onLoginClick={onLoginClick} />;
}
