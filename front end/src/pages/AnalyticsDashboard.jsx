import { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import {
  ChevronDown, ChevronRight,
  CheckCircle2, Target, Clock, BookOpen, TrendingUp, Code2, Users, Sparkles,
  AlertTriangle, AlertCircle, ArrowRight, Mic, Eye
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import AppSidebar from '../components/AppSidebar';

const chartData = [
  { week: 'Week 1', Behavioral: 45, Score: 40, Technical: 42 },
  { week: 'Week 2', Behavioral: 50, Score: 47, Technical: 48 },
  { week: 'Week 3', Behavioral: 56, Score: 53, Technical: 55 },
  { week: 'Week 4', Behavioral: 60, Score: 58, Technical: 60 },
  { week: 'Week 5', Behavioral: 68, Score: 64, Technical: 66 },
  { week: 'Week 6', Behavioral: 74, Score: 70, Technical: 72 },
  { week: 'Week 7', Behavioral: 82, Score: 76, Technical: 80 },
];

const strengths = [
  'Excellent technical communication',
  'Strong problem-solving approach',
  'Clear articulation of past experiences',
];

const improvements = [
  { label: 'System Design Interviews', button: 'Start Practice' },
  { label: 'Behavioral Questions', button: 'Start Practice' },
  { label: 'Filler Word Reduction', button: 'Voice Coach' },
];

function StatCard({ icon: Icon, title, value, badge, subtitle, progress, isHovered, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: isHovered ? '1.5px solid #9576C4' : '1.5px solid #E8E8F4',
        boxShadow: isHovered ? '0 8px 20px rgba(109, 74, 232, 0.15)' : '0 2px 6px rgba(0,0,0,0.05)',
        transition: 'all 0.25s ease',
        padding: '20px',
        cursor: 'pointer'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500 }}>{title}</span>
        <Icon size={20} color="#7C3AED" />
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span style={{ color: '#111115', fontSize: '32px', fontWeight: 700 }}>{value}</span>
        {badge && (
          <span style={{ color: '#22C55E', fontSize: '13px', fontWeight: 600 }}>{badge}</span>
        )}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: '13px' }}>{subtitle}</div>
      {progress !== undefined && (
        <div className="mt-4 h-[6px] rounded-full overflow-hidden" style={{ background: '#E5E7EB', width: '60%' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4F46E5, #60A5FA)' }}
          />
        </div>
      )}
    </div>
  );
}

function SkillBar({ label, value, barColor }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-sm mb-1.5">
        <span style={{ color: '#6B7280' }}>{label}</span>
        <span className="font-semibold" style={{ color: '#1F2937' }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: barColor }} />
      </div>
    </div>
  );
}

function PerformanceChart() {
  return (
    <div
      className="h-full"
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid #E8E8F4',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        padding: '20px',
      }}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-base" style={{ color: '#1F2937' }}>Performance Progression</h3>
        <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Your interview readiness over time</p>
      </div>
      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF9800' }} />
          <span style={{ color: '#6B7280' }}>Behavioral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#5B3291' }} />
          <span style={{ color: '#6B7280' }}>Score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4FACFE' }} />
          <span style={{ color: '#6B7280' }}>Technical</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[40, 100]} tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', color: '#1F2937' }}
              labelStyle={{ color: '#6B7280' }}
            />
            <Line type="monotone" dataKey="Behavioral" stroke="#FF9800" strokeWidth={2} dot={{ r: 3, fill: '#FF9800' }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="Score" stroke="#5B3291" strokeWidth={2} dot={{ r: 3, fill: '#5B3291' }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="Technical" stroke="#4FACFE" strokeWidth={2} dot={{ r: 3, fill: '#4FACFE' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const PlayIcon = () => (
  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.583496 1.75039C0.583372 1.33255 0.80671 0.946552 1.16902 0.738418C1.53133 0.530283 1.97728 0.531797 2.33816 0.742386L9.33641 4.82455C9.69583 5.03311 9.91719 5.41709 9.91755 5.83263C9.91791 6.24817 9.69722 6.63254 9.33816 6.84172L2.33816 10.9251C1.97728 11.1356 1.53133 11.1372 1.16902 10.929C0.80671 10.7209 0.583372 10.3349 0.583496 9.91705V1.75039" stroke="white" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AnalyticsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hovered1, setHovered1] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [hovered3, setHovered3] = useState(false);
  const [hovered4, setHovered4] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: '#EEEEF8' }}>
      <AppSidebar />

      {/* MAIN */}
      <div className="flex-1" style={{ marginLeft: 240 }}>
        <Navbar />

        {/* CONTENT */}
        <main className="p-6">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1F2937' }}>Analytics Dashboard</h1>
              <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Track your interview preparation progress</p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border cursor-pointer shadow-sm"
                style={{ background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                Ui/UX Designer <ChevronDown size={14} style={{ color: '#9CA3AF' }} />
              </div>
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border cursor-pointer shadow-sm"
                style={{ background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                Last 30 Days <ChevronDown size={14} style={{ color: '#9CA3AF' }} />
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Target} title="Overall Readiness Score" value="78%" badge="+8%" subtitle="Market Average: 70%" progress={78} isHovered={hovered1} onMouseEnter={() => setHovered1(true)} onMouseLeave={() => setHovered1(false)} />
            <StatCard icon={BookOpen} title="Interviews Completed" value="24" badge="+6h" subtitle="This Month: 8" isHovered={hovered2} onMouseEnter={() => setHovered2(true)} onMouseLeave={() => setHovered2(false)} />
            <StatCard icon={Clock} title="Practice Time" value="42h" badge="+6h" subtitle="Recommended: 50h" isHovered={hovered3} onMouseEnter={() => setHovered3(true)} onMouseLeave={() => setHovered3(false)} />
            <StatCard icon={TrendingUp} title="Success Rate" value="85%" badge="+13%" subtitle="Industry Avg: 72%" isHovered={hovered4} onMouseEnter={() => setHovered4(true)} onMouseLeave={() => setHovered4(false)} />
          </div>

          {/* Chart + Voice AI row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="lg:w-[60%]">
              <PerformanceChart />
            </div>

            {/* Voice AI Panel */}
            <div className="lg:w-[40%]">
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E8E8F4',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  padding: '20px',
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <Mic size={22} color="#5B4FCF" strokeWidth={1.8} />
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1A1A2E" }}>Soft Skills &amp; Voice AI Analysis</h3>
                </div>
                <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#9090A8" }}>
                  Real-time feedback from your practice sessions
                </p>

                <div>
                  {/* Filler Words Counter Card */}
                  <div style={{
                    background: "rgba(241, 245, 249, 0.3)",
                    border: "1px solid #E8E6F8",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    marginBottom: "22px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <AlertCircle size={20} color="#F59E0B" />
                        <span style={{ fontSize: "15px", fontWeight: "500", color: "#374151" }}>Filler Words Counter</span>
                      </div>
                      <span style={{
                        background: "#FEF3C7",
                        color: "#D97706",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "4px 12px",
                        borderRadius: "20px",
                      }}>
                        Needs Work
                      </span>
                    </div>
                    <p style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "700", color: "#1A1A2E" }}>
                      14 <span style={{ fontSize: "16px", fontWeight: "400" }}>Times</span>
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6B6B85", lineHeight: "1.5" }}>
                      Try pausing instead of using &quot;um&quot; or &quot;like&quot;. Practice with deliberate silence between thoughts.
                    </p>
                  </div>

                  {/* Eye Contact Rate */}
                  <div style={{ marginBottom: "22px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Eye size={18} color="#10B981" strokeWidth={1.8} />
                        <span style={{ fontSize: "15px", fontWeight: "500", color: "#374151" }}>Eye Contact Rate</span>
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "#5B4FCF" }}>72%</span>
                    </div>
                    <div style={{ height: "6px", background: "#E8E6F8", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                      <div style={{
                        width: "72%", height: "100%", borderRadius: "4px",
                        background: "linear-gradient(90deg, #5B4FCF 0%, #10B981 100%)",
                      }} />
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9090A8" }}>
                      Great improvement! Aim for 70&ndash;80% for natural engagement.
                    </p>
                  </div>

                  {/* Speech Pace */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "500", color: "#374151" }}>Speech Pace</span>
                      <span style={{
                        background: "#D1FAE5",
                        color: "#059669",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "4px 14px",
                        borderRadius: "20px",
                      }}>
                        Optimal
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#9090A8" }}>
                      145 words/min &nbsp;&nbsp; Target: 130&ndash;160 wpm
                    </p>
                  </div>

                  {/* Voice Confidence */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "500", color: "#374151" }}>Voice Confidence</span>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "#5B4FCF" }}>81%</span>
                    </div>
                    <div style={{ height: "6px", background: "#E8E8F4", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        width: "81%", height: "100%", borderRadius: "3px",
                        background: "#6D28D9",
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E8E8F4',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                padding: '20px',
              }}
            >
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1F2937' }}>
                <Code2 size={18} color="#7C3AED" />
                Hard Skills
              </h3>
              <SkillBar label="System Design" value={85} barColor="#22C55E" />
              <SkillBar label="Coding Problems" value={72} barColor="#7C3AED" />
              <SkillBar label="Technical Knowledge" value={78} barColor="#7C3AED" />
              <SkillBar label="Problem Solving" value={80} barColor="#22C55E" />
            </div>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E8E8F4',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                padding: '20px',
              }}
            >
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: '#1F2937' }}>
                <Users size={18} color="#7C3AED" />
                Soft Skills
              </h3>
              <SkillBar label="Communication" value={85} barColor="#22C55E" />
              <SkillBar label="Leadership" value={72} barColor="#7C3AED" />
              <SkillBar label="Adaptability" value={78} barColor="#7C3AED" />
              <SkillBar label="Critical Thinking" value={80} barColor="#22C55E" />
            </div>
          </div>

          {/* AI Recommendation & Action Plan */}
          <div
            className="mb-6"
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #E8E8F4',
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2" style={{ color: '#1F2937' }}>
                  <Sparkles size={18} color="#7C3AED" />
                  AI Recommendation &amp; Action Plan
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Tailored insights based on your recent performance</p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#F7F5FF', color: '#7661DF' }}>Personalized</span>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
              {/* Top Strengths */}
              <div style={{ width: '45%' }}>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5" style={{ color: '#22C55E' }}>
                  <CheckCircle2 size={16} color="#22C55E" />
                  Top Strengths
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {strengths.map((s) => (
                    <li
                      key={s}
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <CheckCircle2 size={16} color="#22C55E" />
                      <span className="text-sm" style={{ color: '#6B7280' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div style={{ width: '55%' }}>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5" style={{ color: '#F59E0B' }}>
                  <AlertTriangle size={16} color="#F59E0B" />
                  Areas to Improve
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {improvements.map((item) => (
                    <li
                      key={item.label}
                      style={{
                        background: 'rgba(241, 245, 249, 0.3)',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500, color: '#111115', fontSize: '14px' }}>{item.label}</div>
                        <div style={{ color: '#9E9EB0', fontSize: '12px', marginTop: '4px' }}>Focus on improvement</div>
                      </div>
                      <button
                        className="text-xs font-medium whitespace-nowrap flex items-center justify-center gap-1"
                        style={{
                          background: '#3A1078',
                          width: '110px',
                          height: '30px',
                          borderRadius: '9.6px',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <PlayIcon />
                        {item.button}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA inside container */}
            <div
              style={{
                background: '#F8F8FF',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #E8E8F4',
                marginTop: '20px',
              }}
            >
              <div>
                <p className="font-semibold" style={{ color: '#1F2937' }}>Ready to level up?</p>
                <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>Start a personalized practice session based on your weak areas</p>
              </div>
              <button
                className="px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors text-white"
                style={{ background: '#111115' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#2D2D34'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#111115'; }}
              >
                Start AI Practice <ArrowRight size={16} color="#FFFFFF" />
              </button>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
