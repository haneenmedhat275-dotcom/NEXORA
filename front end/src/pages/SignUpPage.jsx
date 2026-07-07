import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../api/axios";
import Logo from "../assets/LOGO.svg";

const radialBg = {
  background: "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.10) 0%, rgba(214,211,248,0.20) 50%, rgba(214,211,248,0) 100%)",
  backgroundColor: "#ffffff",
};

export default function SignUpPage({ onLoginClick, onBack }) {
  const navigate = useNavigate();
  const { signup } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    const ok = signup({ name, email, password });
    if (ok) {
      try {
        await api.post("/auth/register", { name, email, password });
        const loginRes = await api.post("/auth/login", { email, password });
        if (loginRes.data.token) {
          localStorage.setItem("token", loginRes.data.token);
        }
      } catch {}
      navigate("/upload-cv");
    } else {
      setError("This email is already registered. Please sign in instead.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ============ LEFT: Form ============ */}
      <div className="flex w-full flex-col justify-center px-10 py-5 lg:w-1/2 lg:px-20 bg-white">
        {/* Logo */}
        <a href="/" aria-label="Nexora home">
          <img src={Logo} alt="Nexora" style={{ width: "174px", height: "62px" }} />
        </a>

        {/* Heading */}
        <div className="mt-12">
          <h1 className="text-[28px] font-bold leading-[36px] text-slate-900">
            Create an account
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-slate-500">
            Sign up now and unlock exclusive access!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-[14px] font-medium text-slate-800">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

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
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-slate-900 py-3.5 text-[14px] font-semibold text-white transition hover:bg-slate-800"
          >
            sign up
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
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
          >
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
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white py-3 text-[14px] font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebooke
          </button>
        </div>

        {/* Sign in link */}
        <p className="mt-8 text-center text-[14px] text-slate-500">
          Have an account?{" "}
          <button
            onClick={onLoginClick}
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* ============ RIGHT: Visual panel ============ */}
      <div
        className="hidden flex-col justify-start items-center pt-20  px-10 lg:flex lg:w-1/2 bg-[#f8f8f8]"
        style={radialBg}
      >
        {/* Heading */}
        <div className="mb-10 justify-center text-center">
          <h2 className="text-[32px] font-bold leading-[42px] text-primary">
            Empowering your
            <br />
            career journey with AI.
          </h2>
          <p className="mt-4 text-[14px] leading-6 text-slate-500">
            Experience the next generation of career management.
            <br />
            Precision tools built for ambitious professionals.
          </p>
        </div>

        {/* Dashboard mockup card */}
        <div className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 animate-float">
          {/* top bar */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h6M4 10h6M4 14h6M14 6h6M14 10h6M14 14h6" />
              </svg>
            </div>
            <div className="h-2 w-28 rounded-full bg-slate-100" />
          </div>
          <style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  .animate-float { animation: float 4s ease-in-out infinite; }
  @keyframes barUp {
    from { height: 0px; }
    to { height: var(--h); }
  }
`}</style>
          <div className="flex gap-3 p-4">
            {/* Skill Growth chart */}
            <div className="flex-1 rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-slate-700">Skill Growth</span>
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="mt-4 flex items-end gap-2">
                {[40, 55, 70, 80, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: barsVisible ? `${h}px` : "0px",
                      transition: `height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.15}s`,
                      background: i >= 3 ? "#7C3AED" : i === 2 ? "#A78BFA" : "#DDD6FE",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Matches card */}
            <div className="w-24 shrink-0 rounded-xl border border-slate-100 p-4">
              <p className="text-[12px] text-slate-500">Matches</p>
              <p className="mt-1 text-[22px] font-bold text-slate-900">98%</p>
              <div className="mt-2 h-1 w-full rounded-full bg-purple-600" />
            </div>
          </div>

          {/* Bottom rows */}
          <div className="space-y-3 border-t border-slate-100 px-5 py-4">
            {[
              { icon: "✓", label: "Resume Analysis Complete", color: "text-green-500" },
              { icon: "✉", label: "New opportunity identified", color: "text-slate-400" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className={`text-[14px] ${row.color}`}>{row.icon}</span>
                <span className="text-[13px] text-slate-600">{row.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent badge */}
        <div className="mt-4 self-end">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-md ring-1 ring-slate-100">
            <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">AI Agent Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
