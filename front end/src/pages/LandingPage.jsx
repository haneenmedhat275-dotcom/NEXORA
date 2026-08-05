import { useState, useEffect } from "react";
import Logo from "../assets/lOGO.svg";
import heroDashboard from "../assets/hero.png";
import IconVid from "../assets/vid.svg";
import IconEmo from "../assets/imo.svg";
import IconVoice from "../assets/voice.svg";
import IconStar from "../assets/star.svg";
import section3Image from "../assets/section3.png";


export default function LandingPage({ onLoginClick, onSignUpClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [animateBars, setAnimateBars] = useState(false);
  const [barValues, setBarValues] = useState({ Situation: 0, Action: 0, Results: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setAnimateBars(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!animateBars) return;
    const targets = { Situation: 94, Action: 88, Results: 91 };
    const duration = 1000;
    const startTime = Date.now();

    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setBarValues({
        Situation: Math.round(progress * targets.Situation),
        Action: Math.round(progress * targets.Action),
        Results: Math.round(progress * targets.Results),
      });
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [animateBars]);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Analytics", href: "#analytics" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <>
      {/* ============ NAVBAR ============ */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "linear-gradient(to bottom, rgba(238,242,255,0.85), rgba(237,233,254,0.75))" }}>
        <nav className="mx-auto flex w-full max-w-page items-center justify-between px-8 py-5 lg:px-12">
          <a href="#" className="flex items-center" aria-label="Nexora home">
            <img src={Logo} alt="Nexora" style={{ width: "173px", height: "46px" }} />
          </a>

          <div className="hidden items-center gap-10 lg:flex">
            {/* Desktop nav */}
            <ul className="flex items-center" style={{ gap: "32px" }}>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setActiveLink(link.label)}
                    className="text-[14px] font-medium leading-6 transition-colors"
                    style={{ color: activeLink === link.label ? "#3A1078" : "#59626E" }}
                    onMouseEnter={(e) => {
                      if (activeLink !== link.label) e.currentTarget.style.color = "#3A107899";
                    }}
                    onMouseLeave={(e) => {
                      if (activeLink !== link.label) e.currentTarget.style.color = "#59626E";
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop actions */}
            <div className="flex items-center gap-5">
              <button
                onClick={onLoginClick}
                className="text-[14px] font-medium leading-6 px-4 py-2 rounded-full border border-transparent transition-colors hover:bg-slate-900  hover:border-slate-900 hover:text-white"
                style={{ color: "#59626E" }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#59626E'}
              >
                Log in
              </button>
              <button
                onClick={onSignUpClick}
                className="rounded-full border border-slate-900 px-6 py-2.5 text-btn-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md lg:hidden">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block text-[14px] font-medium"
                    style={{ color: activeLink === link.label ? "#3A1078" : "#59626E" }}
                    onClick={() => { setActiveLink(link.label); setMobileOpen(false); }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={onLoginClick}
                className="text-left text-[14px] font-medium px-4 py-2 rounded-full border border-transparent transition-colors hover:bg-slate-900 hover:text-white hover:border-slate-900"
                style={{ color: "#59626E" }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#59626E'}
              >
                Log in
              </button>
              <button
                onClick={onSignUpClick}
                className="rounded-full border border-slate-900 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-purple-50 to-sky-100">
        <div className="mx-auto flex max-w-content flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-28">
          <div className="w-full lg:w-1/2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-caption font-semibold tracking-wide text-slate-500 ring-1 ring-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              ENGINEERING EXCELLENCE AT FAANG
            </span>
            <h1
              className="mt-6 bg-clip-text text-3xl tracking-tight text-transparent sm:text-4xl lg:text-hero"
              style={{ backgroundImage: "linear-gradient(90deg, #000000 0%, #3A1078 50%, #000000 100%)" }}
            >
              Master Elite Tech
              <br />
              Interviews with AI.
            </h1>
            <p className="mt-5 max-w-md text-body text-slate-500">
              HireMind AI uses advanced behavioral modeling and real-time intelligence to
              prepare ambitious engineers for the world&apos;s most competitive roles.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button onClick={onSignUpClick} className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                Try Nexora Now
              </button>
              <a href="#features" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover">
                See Features Overview
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
          <div className="relative flex w-full items-center justify-center lg:w-1/2 lg:justify-end">
            <div className="relative" style={{ filter: 'drop-shadow(0 0 80px rgba(58, 64, 237, 0.33))' }}>
              <img src={heroDashboard} alt="Nexora dashboard preview" className="w-full max-w-[560px] [transform:scaleX(-1)]" />
            </div>
          </div>
        </div>
      </section>
 
      {/* ============ FEATURES ============ */}
      <section id="features" className="bg-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-content">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-h2">
              Precision Intelligence for Peak Performance
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-slate-500">
              Our platform focuses on the nuances that distinguish elite candidates from the rest.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: IconVid, title: "Interview Sim", desc: "Hyper-realistic video simulations tailored to elite engineering roles at FAANG companies." },
              { icon: IconEmo, title: "Emotion IQ", desc: "Advanced sentiment analysis to perfect your confidence, composure, and micro-expressions." },
              { icon: IconVoice, title: "Voice Profiling", desc: "Real-time tracking of pacing, tone, and filler words for a more commanding delivery." },
            ].map((card) => (
              <div key={card.title} className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-[12px_20px_40px_-8px_rgba(99,102,241,0.12)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C4B5FD] hover:shadow-[0_0_40px_rgba(124,58,237,0.25)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                  <img src={card.icon} alt="" className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-h3 text-slate-900">{card.title}</h3>
                <p className="mt-2 text-caption leading-relaxed text-slate-500">{card.desc}</p>
              </div>
            ))}
            <div className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-[12px_20px_40px_-8px_rgba(99,102,241,0.12)] transition-all duration-300 hover:-translate-y-2 hover:border-[#C4B5FD] hover:shadow-[0_0_40px_rgba(124,58,237,0.25)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                <img src={IconStar} alt="" className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-h3 text-slate-900">Smart STAR</h3>
              <div className="mt-4 space-y-3">
                {[{ label: "Situation", value: 94 }, { label: "Action", value: 88 }, { label: "Results", value: 91 }].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-caption text-slate-500">
                      <span>{row.label}</span>
                      <span className="font-medium text-slate-700">{barValues[row.label]}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out" style={{ width: animateBars ? `${row.value}%` : '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-caption leading-relaxed text-slate-500">
                LLM-driven markers ensure your stories hit every structural marker with maximum impact.
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* ============ PATHWAY TO MASTERY ============ */}
      <section id="how-it-works" className="bg-[#F5F3FF] px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-content">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-h2">Pathway to Mastery</h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-slate-500">A systematic approach to interview excellence.</p>
          </div>
          <div className="relative mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-slate-200 lg:block" style={{ marginInline: "12.5%" }} aria-hidden="true" />
            {[
              { num: "01", title: "Context Injection", desc: "Upload your target job description and resume for deep personalization." },
              { num: "02", title: "AI Interview", desc: "Engage in a live, interactive video interview with our realistic AI agents." },
              { num: "03", title: "Real-time Analysis", desc: "Receive instant behavioral and technical flags as you speak." },
              { num: "04", title: "Deep Reporting", desc: "Get a comprehensive PDF report with specific improvements and scores." },
            ].map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="pointer-events-none absolute -inset-6 flex items-center justify-center" aria-hidden="true" style={{ animation: 'pulse-glow 2s ease-in-out infinite', animationDelay: `${(parseInt(step.num) - 1) * 0.3}s` }}>
                    <div className="h-20 w-20 rounded-full opacity-80 blur-sm" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, rgba(167,139,250,0.3) 50%, transparent 70%)' }} />
                  </div>
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900 shadow-sm ring-1 ring-slate-100">{step.num}</span>
                </div>
                <h3 className="mt-5 text-h3 text-slate-900">{step.title}</h3>
                <p className="mt-2 max-w-[220px] text-caption leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ============ ELITE ANALYTICS ============ */}
      <section id="analytics" className="relative overflow-hidden bg-slate-950 px-6 pb-28 pt-20 lg:px-8 lg:pb-36 lg:pt-28">
        <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} aria-hidden="true" />
        <div className="mx-auto flex max-w-content flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-8">
          <div className="relative z-10 w-full lg:w-1/2">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-h2">Elite Analytics for Elite Engineers.</h2>
            <p className="mt-4 max-w-md text-body text-slate-400">Quantify your growth with high-precision data. We track over 200 behavioral markers to give you a definitive readiness score.</p>
            <ul className="mt-8 space-y-4">
              {["Peer-Benchmarking against Top 1% candidates.", "Historical Progress tracking across multiple roles.", "Detailed breakdown of Technical vs. Soft Skills."].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <svg className="h-3.5 w-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-caption text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative z-10 flex w-full justify-center lg:w-1/2 lg:justify-end" style={{ animation: 'float 4s ease-in-out infinite' }}>
            <div className="rounded-[32px] p-3 ring-1 ring-white/20 shadow-[0_0_60px_-5px_rgba(56,189,248,0.35)]">
              <img src={section3Image} alt="Nexora analytics dashboard" className="w-full max-w-[460px] rounded-[24px]" />
            </div>
          </div>
          <style>{`html { scroll-behavior: smooth } @keyframes float { 0%, 100% { transform: translateY(0px) } 50% { transform: translateY(-12px) } } @keyframes pulse-glow { 0%, 100% { transform: scale(1); opacity: 0.5 } 50% { transform: scale(1.6); opacity: 1 } } @keyframes star-pop { 0% { transform: scale(0); opacity: 0 } 60% { transform: scale(1.3); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }`}</style>
        </div>
        <svg className="absolute -bottom-px left-0 block w-full text-[#F5F3FF]" viewBox="0 0 1440 80" fill="currentColor" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="bg-white px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-content">
          <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-h2">Trusted by the Best</h2>
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {[
              { quote: "The STAR feedback engine is a game changer. I finally understood why my behavioral answers weren't landing. Signed my offer at Google last month.", name: "Alex Chen", role: "Senior SRE, Google" },
              { quote: "Real-time sentiment analysis helped me fix my poker face. I felt completely in control during my L6 interview at Meta.", name: "Marcus Thorne", role: "Staff Engineer, Meta" },
              { quote: "I've tried every platform out there. HireMind AI is the only one that feels like a real conversation with a Tier 1 recruiter.", name: "Sarah Jenkins", role: "Backend Lead, Stripe" },
            ].map((t) => (
              <div key={t.name} className="flex flex-col transition-all duration-500 ease-out hover:-translate-y-1">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 transition-all duration-300 hover:scale-125 hover:text-purple-700" fill="currentColor" viewBox="0 0 20 20" style={{ animation: 'star-pop 0.4s ease-out forwards', animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                      <path d="M10 1l2.755 5.59 6.17.897-4.463 4.349 1.054 6.144L10 14.97l-5.516 3.01 1.054-6.144L1.075 7.487l6.17-.897L10 1z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-caption leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200">
                    <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-slate-400">
                      <circle cx="12" cy="8" r="4" fill="currentColor" />
                      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" fill="currentColor" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-caption font-semibold text-slate-900">{t.name}</p>
                    <p className="text-caption text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-gradient-to-b from-indigo-50 via-purple-50 to-sky-100 px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-content">
          <div className="rounded-[40px] bg-white/60 px-6 py-16 text-center backdrop-blur-sm sm:px-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-h2">Ready to land your dream role?</h2>
            <p className="mx-auto mt-4 max-w-md text-body text-slate-500">Join thousands of elite engineers who have optimized their interview performance with NEXORA.</p>
            <button onClick={onSignUpClick} className="mt-8 inline-block rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">Join Now</button>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-white px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 border-t border-slate-100 pt-10 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <img src={Logo} alt="Nexora" className="h-7 w-auto" />
            <p className="text-caption text-slate-400">© 2024 NEXORA. Tactile Intelligence for the Modern Enterprise.</p>
          </div>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "API Status", "LinkedIn"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-caption text-slate-500 hover:text-slate-900">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
