import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutGrid,
  MessageCircle,
  Trophy,
  Pen,
  Code,
  Database,
  Sparkles,
  Calendar,
  Info,
  Lock,
  Monitor,
  Check,
  Mic,
} from 'lucide-react';
import AppSidebar from '../components/AppSidebar';
import Navbar from '../components/Navbar';

const tracks = [
  {
    id: 'domain',
    icon: LayoutGrid,
    title: 'Domain & Technical',
    desc: 'Deep dive into your industry-specific logic, technical knowledge, and hard skills tailored to your exact role.',
  },
  {
    id: 'behavioral',
    icon: MessageCircle,
    title: 'Behavioral & HR',
    desc: 'Evaluate your communication, situational judgment, problem-solving, and professional culture-fit.',
  },
  {
    id: 'full',
    icon: Trophy,
    title: 'Full Mock Simulation',
    desc: 'The ultimate realistic practice combining both your specific domain questions and HR rounds in one session.',
  },
];

const roles = [
  { id: 'uiux', icon: Pen, label: 'UI/UX Product Designer' },
  { id: 'frontend', icon: Code, label: 'Frontend Developer' },
  { id: 'backend', icon: Database, label: 'Backend Developer' },
  { id: 'custom', icon: Sparkles, label: 'Custom / Other Roles' },
];

function StepCircle({ num }) {
  return (
    <span className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: '#3A1078' }}>
      {num}
    </span>
  );
}

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [selectedTracks, setSelectedTracks] = useState(new Set(['domain']));
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleSearch, setRoleSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const startInterview = () => {
    setLoading(true);
    setTimeout(() => navigate('/interview'), 1500);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#EEEEF8' }}>
      <AppSidebar />
      <div className="flex-1" style={{ marginLeft: 240 }}>
        <Navbar />
        <main className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>New Interview Setup</h1>
            <p className="text-sm mt-1" style={{ color: '#828291' }}>
              Configure your environment for a realistic, AI-driven practice session.
            </p>
          </div>

          {/* Section 1 — Select Interview Track */}
          <section className="mb-6">
            <div className="flex items-center gap-2.5 mb-4">
              <StepCircle num="1" />
              <span className="font-semibold" style={{ color: '#07060F' }}>Select Interview Track</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tracks.map((t) => {
                const Icon = t.icon;
                const active = selectedTracks.has(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      const next = new Set(selectedTracks);
                      if (next.has(t.id)) next.delete(t.id); else next.add(t.id);
                      setSelectedTracks(next);
                    }}
                    className={`relative rounded-xl p-5 text-left transition-all duration-200 cursor-pointer ${
                      active
                        ? 'border border-violet-500 bg-violet-50'
                        : 'border border-[#E5E7EB] bg-white hover:shadow-sm hover:border-[#9E9EB0]'
                    }`}
                  >
                    {active && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3A1078' }}>
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                    <div className={`p-2.5 rounded-lg w-fit mb-4 ${
                      active ? 'bg-violet-100' : 'bg-gray-100'
                    }`}>
                      <Icon size={22} className={active ? 'text-violet-700' : 'text-gray-500'} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1.5">{t.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Main row: Section 2 (left) + Upcoming Sessions & Hardware (right) */}
          <div className="flex gap-8">
            <div className="flex-1">
              {/* Section 2 — Select Your Role */}
              <section className="mb-0">
                <div className="flex items-center gap-2.5 mb-3">
                  <StepCircle num="2" />
                  <span className="font-semibold" style={{ color: '#07060F' }}>Select Your Role</span>
                </div>
                <div className="relative mb-2">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                    placeholder="Search or type any job role... (e.g., Product Manager, Cyber Security, Civil Engineer)"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const active = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`flex items-center gap-3 rounded-lg transition-all duration-150 cursor-pointer ${
                          active
                            ? 'border-violet-400 bg-violet-50'
                            : 'bg-white hover:border-violet-400 hover:bg-violet-50'
                        }`}
                        style={{
                          height: '48px',
                          padding: '10px 12px',
                          border: active
                            ? '1px solid #7c3aed'
                            : r.id === 'custom'
                              ? '1px dashed #E4E4E8'
                              : '1px solid #E4E4E8',
                        }}
                      >
                        <div className={`p-1.5 rounded ${active ? 'bg-violet-100' : 'bg-gray-100'}`}>
                          <Icon size={16} className={active ? 'text-violet-600' : 'text-gray-500'} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#07060F' }}>
                          {r.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
              {/* Section 3 — Hardware Status & Launch */}
              <section className="mt-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <StepCircle num="3" />
                  <span className="font-semibold text-sm" style={{ color: '#07060F' }}>Hardware Status & Launch</span>
                </div>
                <div className="rounded-xl bg-white p-3" style={{ border: '1px solid #E4E4E8' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative w-20 h-[52px] rounded-lg overflow-hidden shrink-0 flex items-center justify-center" style={{ backgroundColor: '#170630', border: '1px solid rgba(158, 158, 176, 0.34)' }}>
                      <div className="flex items-center justify-center gap-1 rounded-full" style={{ width: '65px', height: '15px', backgroundColor: '#170630', border: '1px solid #9E9EB0', boxShadow: '0 0 6px rgba(158, 158, 176, 0.4)' }}>
                        <Mic size={7} style={{ color: '#109D72' }} />
                        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '9px', letterSpacing: '0%', fontWeight: 400, color: '#FFFFFF', textShadow: '0 0 4px rgba(255,255,255,0.4)' }}>LIVE</span>
                        <span className="w-[4px] h-[4px] rounded-full" style={{ backgroundColor: '#109D72' }}></span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-xs" style={{ color: '#07060F' }}>Hardware Verified</h4>
                      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: '#07060F' }}>
                        Camera & mic are optimized.
                      </p>
                    </div>
                  </div>
                  <button onClick={startInterview} className="w-full text-white rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-violet-700 transition-all duration-200 cursor-pointer" style={{ backgroundColor: '#000000' }}>
                    Enter AI Interview Room →
                  </button>
                </div>
              </section>
            </div>
            <div className="hidden lg:block w-[280px] shrink-0">
              {/* Upcoming Sessions */}
              <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: '1px solid #E4E4E8' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#07060F' }}>Upcoming Sessions</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F5F5F8', color: '#20202B' }}>2</span>
                </div>
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-violet-100 text-[10px] font-semibold px-2 py-0.5 rounded uppercase" style={{ color: '#3A1078' }}>Technical</span>
                    <span className="text-[10px]"><span style={{ color: '#717177' }}>•</span> <span style={{ color: '#07060F' }}>Frontend Architect</span></span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#717177' }}>
                      <Calendar size={13} style={{ color: '#717177' }} />
                      <span>Today at 8:00 PM</span>
                    </div>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">15 min</span>
                  </div>
                  <button onClick={startInterview} className="w-full text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition-all duration-150 cursor-pointer" style={{ backgroundColor: '#3A1078' }}>
                    Start Session
                  </button>
                </div>
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 text-[10px] font-semibold px-2 py-0.5 rounded uppercase" style={{ color: '#3A1078' }}>Behavioral</span>
                    <span className="text-[10px]"><span style={{ color: '#717177' }}>•</span> <span style={{ color: '#07060F' }}>Culture Fit Sync</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: '#717177' }}>
                    <Calendar size={13} style={{ color: '#717177' }} />
                    <span>Tomorrow at 10:30 AM</span>
                  </div>
                  <button className="w-full bg-white rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-all duration-150 cursor-pointer" style={{ color: '#07060F', border: '1px solid #E4E4E8', boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}>
                    Remind Me
                  </button>
                </div>
                <div className="flex items-start gap-2 text-gray-400 text-[11px] italic leading-relaxed">
                  <Lock size={12} className="mt-0.5 shrink-0" />
                  <span>Practice makes perfect. All AI sessions are recorded securely for your private performance review.</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#EEEEF8', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: 'spin 1s linear infinite' }}>
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="#7C3AED" strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * 0.75}`}
              strokeLinecap="round" transform="rotate(-90 24 24)"
            />
          </svg>
          <span style={{ color: '#6B7280', fontSize: 14 }}>Preparing your interview...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
