import { useState } from "react";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import Logo from "../assets/LOGO.svg";

export default function LoginPage({ onBack, onSignUpClick, onForgotClick, onLoginSuccess }) {
  const { login, userExists } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [socialError, setSocialError] = useState("");

  const handleSocialLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!userExists(email)) {
      onSignUpClick();
      return;
    }
    const success = login(email, password);
    if (success) {
      try {
        const res = await api.post("/auth/login", { email, password });
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
      } catch {
        try {
          const users = JSON.parse(localStorage.getItem("nexora_users") || "[]");
          const u = users.find((x) => x.email === email);
          if (u) await api.post("/auth/register", { name: u.name, email: u.email, password: u.password });
          const res = await api.post("/auth/login", { email, password });
          if (res.data.token) localStorage.setItem("token", res.data.token);
        } catch {}
      }
      onLoginSuccess();
    } else {
      setError("Email or password is incorrect");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ============ LEFT: Form ============ */}
      <div className="flex w-full flex-col justify-center px-10 py-12 lg:w-1/2 lg:px-20">
        {/* Logo */}
        <a href="/" aria-label="Nexora home">
          <img src={Logo} alt="Nexora" style={{ width: "184px", height: "62px" }} />
        </a>

        {/* Heading */}
        <div className="mt-12">
          <h1 className="text-[28px] font-bold leading-[36px] text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-slate-500">
            Sign in to your NEXORA account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[14px] font-medium text-slate-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[14px] font-medium text-slate-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            <div className="mt-1 text-right">
              <button
                type="button"
                onClick={onForgotClick}
                className="text-[13px] font-medium text-primary hover:text-primary-hover"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          )}

          {/* Log In button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-slate-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[13px] text-slate-400">OR</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Social buttons */}
        <div className="flex flex-col gap-3">
          {socialError && (
            <p className="text-[13px] text-red-500 text-center">{socialError}</p>
          )}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {/* Google icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {/* Facebook icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* Sign Up link */}
        <p className="mt-8 text-center text-[14px] text-slate-500">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSignUpClick}
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* ============ RIGHT: Visual panel ============ */}
      <div
        className="hidden flex-col items-center justify-center px-10 lg:flex lg:w-1/2"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.10) 0%, rgba(214,211,248,0.20) 50%, rgba(214,211,248,0) 100%)",
          backgroundColor: "#ffffff",
        }}
      >
     {/* Dashboard card mockup */}
<div className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 animate-float">
  {/* top bar */}
  <div className="flex items-center justify-between px-5 py-4">
    <div className="flex gap-1.5">
      <span className="h-3 w-3 rounded-full bg-red-400" />
      <span className="h-3 w-3 rounded-full bg-yellow-400" />
      <span className="h-3 w-3 rounded-full bg-green-400" />
    </div>
    {/* Avatars */}
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-purple-300 to-indigo-300"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-primary">
              <circle cx="12" cy="8" r="4" fill="currentColor" />
              <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" fill="currentColor" />
            </svg>
          </div>
        ))}
      </div>
      <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white">
        +5k
      </span>
    </div>
  </div>

  <div className="px-5 pb-6">
    <div className="grid grid-cols-3 gap-4">
      {/* Career Growth chart */}
      <div className="col-span-2 rounded-xl bg-slate-50 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          Career Growth
          <br />
          Forecast
        </p>
        <div className="mt-3 flex items-end gap-1.5">
          {[30, 50, 70, 55].map((h, i) => (
            <span
              key={i}
              className="w-6 rounded-t"
              style={{
                height: `${h}px`,
                background: i === 2 ? "#2f0081" : i === 3 ? "#A78BFA" : "#DDD6FE",
              }}
            />
          ))}
        </div>
      </div>

      {/* AI Optimized card */}
      <div className="col-span-1 flex flex-col items-start justify-between rounded-xl bg-[#2f0081] p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <p className="mt-2 text-[12px] font-semibold leading-5 text-white">
          AI Optimized Profile active.
        </p>
      </div>

      {/* Skill Mastery */}
      <div className="col-span-1 rounded-xl bg-slate-50 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          Skill
          <br />
          Mastery
        </p>
        <p className="mt-2 text-[20px] font-bold text-slate-900">84%</p>
      </div>

      {/* Network Pulse */}
      <div className="col-span-1 rounded-xl bg-slate-50 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          Network
          <br />
          Pulse
        </p>
        <p className="mt-2 text-[20px] font-bold text-slate-900">+12.4k</p>
      </div>
    </div>
  </div>
</div>

<style>{`
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-12px);
    }
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
`}</style>

        {/* Text below card */}
        <div className="mt-10 max-w-sm text-center">
          <h2 className="text-[28px] font-bold leading-[36px] text-primary">
            Empowering your career
            <br />
            journey with AI.
          </h2>
          <p className="mt-4 text-[14px] leading-6 text-slate-500">
            NEXORA uses advanced predictive analytics to transform your professional path.
            Get personalized insights, skill gaps analysis, and direct connections to
            high-growth opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}