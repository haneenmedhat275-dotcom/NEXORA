import { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const steps = [
      { at: 20, text: 'Connecting to secure server...' },
      { at: 40, text: 'Loading your profile...' },
      { at: 60, text: 'Syncing interview data...' },
      { at: 80, text: 'Analyzing performance metrics...' },
      { at: 100, text: 'Ready!' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        const step = steps.find((s) => next >= s.at);
        if (step) setStatus(step.text);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111115]">
      {/* Logo */}
      <div className="mb-12">
        <span className="text-4xl font-bold tracking-widest text-white">
          NEX<span className="text-[#4FACFE]">ORA</span>
        </span>
        <p className="mt-2 text-center text-sm text-[#666672]">Tactile Intelligence for the Modern Enterprise</p>
      </div>

      {/* Progress Ring */}
      <div className="relative mb-8">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#2D2D34" strokeWidth="4" />
          <circle
            cx="60" cy="60" r="54" fill="none" stroke="url(#gradient)" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3A1078" />
              <stop offset="100%" stopColor="#4FACFE" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{progress}%</span>
        </div>
      </div>

      {/* Status */}
      <p className="text-sm text-[#9E9EA1]">{status}</p>

      {/* Dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 animate-pulse rounded-full"
            style={{
              background: progress > i * 33 ? '#4FACFE' : '#2D2D34',
              animationDelay: `${i * 0.2}s`,
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
