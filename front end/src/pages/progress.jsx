import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPageLayout from "../layouts/DashboardPageLayout";

function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return }

    Promise.all([
      fetch("/api/results/analytics", {
        headers: { "Authorization": `Bearer ${token}` },
      }).then(r => r.json().catch(() => ({}))),
      fetch("/api/interviews/history", {
        headers: { "Authorization": `Bearer ${token}` },
      }).then(r => r.json().catch(() => [])),
    ])
    .then(([analyticsData, historyData]) => {
      setAnalytics(analyticsData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const totalInterviews = analytics?.totalInterviews ?? 0;
  const avgScore = analytics?.averageScore ?? 0;
  const lastResult = history[0]?.result;

  if (loading) {
    return (
      <DashboardPageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Progress & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track your interview performance and growth over time.
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Two big cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* Job Readiness */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center">
          <h2 className="font-semibold text-gray-900 mb-6">Job Readiness</h2>
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#583291" strokeWidth="3"
                strokeDasharray={`${avgScore} ${100 - avgScore}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{avgScore}%</span>
              <span className="text-xs text-gray-400">Overall</span>
            </div>
          </div>
          <p className="font-semibold text-gray-900 mb-2">Overall Job Readiness Score</p>
          <p className="text-gray-500 text-sm text-center">
            {totalInterviews > 0
              ? `Based on ${totalInterviews} interview${totalInterviews > 1 ? 's' : ''}. Keep practicing to improve!`
              : "Complete your first interview to see your readiness score."}
          </p>
        </div>

        {/* Growth Trajectory */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Growth Trajectory</h2>
          <p className="text-gray-400 text-xs mb-6">Performance tracking over time</p>
          <div className="relative h-48">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#583291" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#583291" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line x1="40" y1={190 - v * 1.7} x2="390" y2={190 - v * 1.7}
                    stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                  <text x="30" y={194 - v * 1.7} fontSize="10" fill="#9CA3AF" textAnchor="end">{v}</text>
                </g>
              ))}
              {history.length > 0 ? (() => {
                const scores = history.map(iv => iv.result?.totalScore ?? 0).reverse();
                const maxScore = Math.max(...scores, 10);
                const points = scores.map((s, i) => {
                  const x = 60 + (i / Math.max(scores.length - 1, 1)) * 300;
                  const y = 190 - (s / maxScore) * 170;
                  return { x, y, score: s };
                });
                return <>
                  {points.length > 1 && (
                    <polygon points={points.map(p => `${p.x},${p.y}`).join(" ") + ` ${points[points.length-1].x},190 ${points[0].x},190`} fill="url(#chartGradient)" />
                  )}
                  <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#583291" strokeWidth="2.5" strokeLinecap="round" />
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#583291" />
                  ))}
                  {scores.map((_, i) => (
                    <text key={i} x={60 + (i / Math.max(scores.length - 1, 1)) * 300} y="198" fontSize="10" fill="#9CA3AF" textAnchor="middle">{`Int ${i + 1}`}</text>
                  ))}
                </>
              })() : (
                <>
                  <polyline points="60,170 160,170 260,170 360,170" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="6 4" />
                  <text x="200" y="100" fontSize="12" fill="#9CA3AF" textAnchor="middle">Complete interviews to see your trajectory</text>
                </>
              )}
            </svg>
          </div>
        </div>

      </div>

      {/* 4 Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-semibold tracking-widest mb-2">TOTAL INTERVIEWS</p>
          <p className="text-3xl font-bold text-gray-900">{totalInterviews}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-semibold tracking-widest mb-2">AVG. SCORE</p>
          <p className="text-3xl font-bold text-gray-900">{avgScore}<span className="text-lg font-normal text-gray-400">%</span></p>
          <p className="text-green-500 text-xs mt-2">{totalInterviews > 0 ? "↗ Based on all sessions" : "—"}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-semibold tracking-widest mb-2">QUESTIONS ANSWERED</p>
          <p className="text-3xl font-bold text-gray-900">{history.reduce((sum, iv) => sum + (iv.questions?.length || 0), 0)}</p>
          <p className="text-green-500 text-xs mt-2">✓ Across all interviews</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-semibold tracking-widest mb-2">GLOBAL RANKING</p>
          <p className="text-3xl font-bold text-gray-900">{totalInterviews > 0 ? "Top " + Math.max(1, 50 - avgScore / 2) + "%" : "—"}</p>
          <p className="text-xs mt-2" style={{color: "#583291"}}>{avgScore >= 70 ? "✦ Platinum Tier" : avgScore >= 50 ? "✦ Gold Tier" : totalInterviews > 0 ? "✦ Silver Tier" : "—"}</p>
        </div>
      </div>

      {/* Interview History */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-gray-900">Interview History</h2>
            <p className="text-gray-400 text-xs mt-1">Chronological milestone feed</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />

          {history.length === 0 ? (
            <div className="flex gap-4 relative">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 z-10">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
              </div>
              <div className="flex-1 border border-gray-100 rounded-2xl p-4">
                <p className="text-gray-400 text-sm">No interviews yet. Start your first interview to see history here.</p>
              </div>
            </div>
          ) : (
            history.map((iv, idx) => {
              const score = iv.result?.totalScore ?? null;
              const maxPossible = (iv.questions?.length || 1) * 10;
              const pct = score !== null ? Math.round((score / maxPossible) * 100) : null;
              const date = new Date(iv.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
              const isBest = score === Math.max(...history.map(h => h.result?.totalScore ?? 0));

              return (
                <div key={iv._id} className="flex gap-4 mb-6 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${score !== null ? "bg-green-50" : "bg-gray-100"}`}>
                    <div className={`w-3 h-3 rounded-full ${score !== null ? "bg-green-500" : "bg-gray-300"}`} />
                  </div>
                  <div className="flex-1 border border-gray-100 rounded-2xl p-4 flex items-center justify-between min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1">
                        {iv.status === "completed" ? "Mock Interview" : "Ongoing Interview"}
                      </p>
                      <p className="text-gray-400 text-xs mb-2">{date}</p>
                      <div className="flex gap-2 flex-wrap">
                        {iv.status === "completed" && (
                          <>
                            <span className={`text-xs px-2 py-1 rounded-full ${pct >= 70 ? "bg-green-50 text-green-600" : pct >= 40 ? "bg-orange-50 text-orange-500" : "bg-red-50 text-red-500"}`}>
                              ● Scored: {pct}%
                            </span>
                            {isBest && <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">↑ Best session</span>}
                          </>
                        )}
                        {iv.status !== "completed" && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-600">● In Progress</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      {pct !== null && (
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${pct >= 70 ? "border-green-500 text-green-600" : pct >= 40 ? "border-orange-400 text-orange-400" : "border-red-400 text-red-400"}`}>
                          {pct}
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/reports/${iv._id}`)}
                        className="text-sm font-medium whitespace-nowrap"
                        style={{color: "#583291"}}
                      >
                        View Detailed Report ›
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </DashboardPageLayout>
  );
}

export default Dashboard;