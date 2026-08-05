import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Logo from "../assets/LOGO.svg";
import ForgotBg from "../assets/forgot.png";

const pageBg = {
  position: "relative",
};

// ============ Step 1: Forgot Password ============
function ForgotStep({ onSend, onLoginClick }) {
  const [email, setEmail] = useState("");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <img src={ForgotBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      <a href="/" className="mb-10 flex items-center gap-2">
        <img src={Logo} alt="Nexora" style={{ width: "184px", height: "62px" }} />
      </a>

      <h1 className="text-[28px] font-bold text-slate-900">Forgot your password?</h1>
      <p className="mt-2 text-[14px] text-slate-500">Don&apos;t worry! We&apos;ll help you recover your account.</p>

      <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_-4px_rgba(124,58,237,0.15)]">
        <p className="text-[14px] leading-6 text-slate-500">
          Enter your registered email address and we will send you a link to reset your password.
        </p>

        <div className="mt-6 flex flex-col gap-1.5">
          <label htmlFor="fp-email" className="text-[14px] font-medium text-slate-800">Email</label>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition">
            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              id="fp-email"
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-[14px] text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => onSend(email)}
          className="mt-6 w-full rounded-full bg-slate-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
        >
          Send Recovery Link
        </button>

        <button
          onClick={onLoginClick}
          className="mt-4 flex w-full items-center justify-center gap-2 text-[13px] font-medium text-primary hover:text-primary-hover"
        >
          Back to login
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============ Step 2: Sent Successfully ============
function SentStep({ email, onResetClick, onLoginClick }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <img src={ForgotBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      <a href="/" className="mb-10 flex items-center gap-2">
        <img src={Logo} alt="Nexora" style={{ width: "184px", height: "62px" }} />
      </a>

      <h1 className="text-[28px] font-bold text-slate-900">Forgot your password?</h1>
      <p className="mt-2 text-[14px] text-slate-500">Don&apos;t worry! We&apos;ll help you recover your account.</p>

      <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_-4px_rgba(124,58,237,0.15)] text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="mt-5 text-[18px] font-bold text-slate-900">Sent successfully!</h2>
        <p className="mt-2 text-[13px] text-slate-500">A password reset link has been sent to:</p>

        <div className="mx-auto mt-3 w-fit rounded-lg bg-primary-light px-5 py-2">
          <span className="text-[13px] font-medium text-primary">{email || "mariam@gmail.com"}</span>
        </div>

        <p className="mt-3 text-[13px] text-slate-500">
          Please check your inbox and click the link to reset your password.
        </p>

        <button
          onClick={onResetClick}
          className="mt-6 w-full rounded-full bg-slate-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
        >
          Go to reset password
        </button>

        <button
          onClick={onLoginClick}
          className="mt-3 w-full rounded-full border border-slate-200 py-3.5 text-[14px] font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Return to login
        </button>

        <p className="mt-4 text-[13px] text-slate-400">
          Didn&apos;t you receive the Link?{" "}
          <button className="font-semibold text-primary hover:text-primary-hover">Resend</button>
        </p>
      </div>
    </div>
  );
}

// ============ Step 3: Reset Password ============
function ResetStep({ onConfirm, onLoginClick }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <img src={ForgotBg} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      <a href="/" className="mb-10 flex items-center gap-2">
        <img src={Logo} alt="Nexora" style={{ width: "184px", height: "62px" }} />
      </a>

      <h1 className="text-[28px] font-bold text-slate-900">Reset Your password</h1>
      <p className="mt-2 text-[14px] text-slate-500">Don&apos;t worry! We&apos;ll help you recover your account.</p>

      <div className="mt-8 w-full max-w-[480px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_-4px_rgba(124,58,237,0.15)]">
        {/* Hint */}
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-[13px] leading-5 text-slate-500">
            Choose a strong password that includes letters, numbers, and symbols to better protect your account.
          </p>
        </div>

        {/* Password field */}
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

        {/* Confirm Password field */}
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

        {/* Requirements */}
        <div className="mt-4">
          <p className="text-[13px] font-semibold text-primary">Password requirements:</p>
          <ul className="mt-1 space-y-0.5">
            {["At least 8 letters", "At least one capital letter (optional)", "At least one number (optional)"].map((r) => (
              <li key={r} className="text-[12px] text-slate-500">• {r}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onConfirm(password)}
          className="mt-6 w-full rounded-full bg-slate-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
        >
          Confirm new password
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

// ============ Step 4: Password Changed Successfully ============
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
          Your password has been updated. You can now use your new password to log in to your account.
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

// ============ Main Export ============
export default function ForgotPasswordPage({ onLoginClick }) {
  const navigate = useNavigate();
  const { login, resetPassword } = useUser();
  const [step, setStep] = useState("forgot");
  const [email, setEmail] = useState("");

  if (step === "sent") return <SentStep email={email} onResetClick={() => setStep("reset")} onLoginClick={onLoginClick} />;
  if (step === "reset") return <ResetStep onConfirm={(pw) => { resetPassword(email, pw); login(email, pw); setStep("success"); }} onLoginClick={onLoginClick} />;
  if (step === "success") return <SuccessStep onDashboard={() => navigate("/dashboard")} />;

  return (
    <ForgotStep
      onSend={(e) => { setEmail(e); setStep("sent"); }}
      onLoginClick={onLoginClick}
    />
  );
}