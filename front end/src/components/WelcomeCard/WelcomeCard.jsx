import { useState } from 'react';
import api from '../../api/axios';

export default function WelcomeCard() {
  const [loading, setLoading] = useState(false);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      await api.post('/interviews/start');
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d0d12] rounded-[var(--radius)] px-10 py-9 flex items-start text-white min-h-[200px] relative overflow-hidden flex-1">
      <div className="absolute right-0 top-0 w-[55%] h-full pointer-events-none z-0 opacity-[0.55] mix-blend-screen"
        style={{
          maskImage: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.9), transparent 80%)',
          background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 30%, #2563EB 60%, #06B6D4 100%)',
        }}
      />
      <div className="-top-[60px] -right-[60px] w-[420px] h-[420px] absolute pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at center, rgba(120, 60, 220, 0.18) 0%, transparent 70%)' }} />
      <div className="flex-1 z-[1] flex flex-col gap-0">
        <h1 className="text-[26px] font-bold mb-[10px] -tracking-[0.2px]">Good morning, Salma!</h1>
        <p className="text-sm text-white/65 leading-[1.65] max-w-[380px] mb-7">
          Your interview readiness improved by 12% this week. You're on the right track.
          Keep practicing!
        </p>
        <button
          className="inline-flex items-center gap-[6px] bg-transparent text-white px-[30px] py-[13px] rounded-[50px] border-[1.5px] border-white/35 shadow-[0_0_18px_3px_rgba(255,255,255,0.12)] text-sm font-medium tracking-[0.2px] transition-all w-fit hover:border-white/65 hover:bg-white/5 disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleStartInterview}
          disabled={loading}
        >
          {loading ? 'Starting...' : '+ Start Interview'}
        </button>
      </div>
    </div>
  );
}
