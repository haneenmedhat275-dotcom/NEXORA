import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code2, Mic, Brain, Heart, Loader2, Users, Layers, Briefcase, Terminal, Globe, Database, Shield } from 'lucide-react'
import { useUser } from '../context/UserContext'
import AppSidebar from '../components/AppSidebar'
import ScoreCard from '../components/ScoreCard'
import PerformanceTrends from '../components/PerformanceTrends'
import InterviewGoals from '../components/InterviewGoals'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const roleIconMap = [
  { keywords: ['react', 'frontend', 'front-end', 'dev'], icon: Code2 },
  { keywords: ['hr', 'behavioral', 'behavior'], icon: Users },
  { keywords: ['system', 'design', 'architecture'], icon: Layers },
  { keywords: ['backend', 'back-end', 'node', 'server', 'api'], icon: Terminal },
  { keywords: ['database', 'sql', 'mongo', 'nosql'], icon: Database },
  { keywords: ['devops', 'deploy', 'ci/cd', 'cloud'], icon: Globe },
  { keywords: ['security', 'auth', 'cyber'], icon: Shield },
  { keywords: ['fullstack', 'full-stack', 'javascript', 'js', 'typescript'], icon: Code2 },
]

function getIconForRole(jobRole) {
  if (!jobRole) return Briefcase
  const lower = jobRole.toLowerCase()
  for (const m of roleIconMap) {
    if (m.keywords.some(kw => lower.includes(kw))) return m.icon
  }
  return Briefcase
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [result, setResult] = useState(null)
  const [rows, setRows] = useState([])
  const [hovered, setHovered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setFetching(false); return }

    fetch('/api/interviews/history', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) return

        const mappedRows = data.map(iv => ({
          icon: getIconForRole(iv.jobRole),
          type: iv.jobRole || 'Mock Interview',
          status: iv.status === 'completed' ? 'Completed' : 'In Progress',
          score: iv.result?.totalScore ?? null,
          interviewId: iv._id,
        }))
        setRows(mappedRows)

        const withResults = data.filter(iv => iv.result)
        if (withResults.length === 0) return

        const cur = withResults[0]
        const prev = withResults.length > 1 ? withResults[1] : null

        const r = cur.result
        const hasSummary = r.summary?.technical?.score != null
        const tech = hasSummary ? (r.summary.technical.score || 0) : (r.totalScore || 0)
        const personal = hasSummary ? (r.summary.personal.score || 0) : (r.totalScore || 0)

        const prevR = prev?.result
        const prevHasSummary = prevR?.summary?.technical?.score != null
        const prevTech = prevHasSummary ? (prevR.summary.technical.score || 0) : (prevR?.totalScore || 0)
        const prevPersonal = prevHasSummary ? (prevR.summary.personal.score || 0) : (prevR?.totalScore || 0)

        const calcChange = (curr, prevVal) => prev ? `${curr - prevVal >= 0 ? '+' : ''}${curr - prevVal}` : '—'

        setResult({
          overallScore: r.totalScore || 0,
          technicalScore: tech,
          communicationScore: Math.round(personal * 0.6),
          confidenceScore: Math.round(personal * 0.25),
          stressScore: Math.round(personal * 0.15),
          techChange: calcChange(tech, prevTech),
          commChange: calcChange(Math.round(personal * 0.6), Math.round(prevPersonal * 0.6)),
          confChange: calcChange(Math.round(personal * 0.25), Math.round(prevPersonal * 0.25)),
          stressChange: calcChange(Math.round(personal * 0.15), Math.round(prevPersonal * 0.15)),
        })
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const handleStartInterview = async () => {
    setLoading(true)
    setTimeout(() => navigate('/interview'), 500)
  }

  const hasData = !!result
  const overallScore = result?.overallScore ?? 0
  const cards = [
    { label: 'Technical Skills', value: result?.technicalScore ?? 0, change: result?.techChange ?? '—', trend: 'up', icon: Code2, color: 'purple' },
    { label: 'Communication', value: result?.communicationScore ?? 0, change: result?.commChange ?? '—', trend: 'up', icon: Mic, color: 'blue' },
    { label: 'Confidence Level', value: result?.confidenceScore ?? 0, change: result?.confChange ?? '—', trend: 'up', icon: Brain, color: 'teal' },
    { label: 'Stress Handling', value: result?.stressScore ?? 0, change: result?.stressChange ?? '—', trend: 'up', icon: Heart, color: 'pink' },
  ]

  const iconBg = {
    purple: { bg: '#EEEDFE', color: '#3C3489' },
    blue: { bg: '#E6F1FB', color: '#185FA5' },
    teal: { bg: '#E1F5EE', color: '#0F6E56' },
    pink: { bg: '#FBEAF0', color: '#993556' },
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#EEEEF8' }}>
      <AppSidebar />
      <div className="flex-1" style={{ marginLeft: 240 }}>
        <Navbar />
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Welcome + Score */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'stretch' }}>
            <div style={{
              background: '#000000',
              borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '160px',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'linear-gradient(to right, #000000 45%, transparent 75%)', zIndex: 0 }} />
              <img src="/Abstract visualization.svg" alt="" style={{ position: 'absolute', right: '-60px', top: 0, height: '110%', opacity: 0.35, pointerEvents: 'none', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                  {getGreeting()}, {user?.name?.split(" ")[0] || "Salma"}!
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: 1.6, maxWidth: '60%', marginBottom: '24px' }}>
                  {hasData ? "Your interview readiness improved by 12% this week. You're on the right track. Keep practicing!" : "Complete your first interview to see your readiness score and personalized insights."}
                </p>
                <button
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onClick={handleStartInterview}
                  style={{
                    background: hovered ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '1.5px solid rgba(255,255,255,0.9)', borderRadius: '50px',
                    padding: '10px 24px', color: '#FFFFFF', fontSize: '15px',
                    fontWeight: 500, cursor: 'pointer',
                    boxShadow: '0 0 15px rgba(255,255,255,0.2), 0 0 30px rgba(138,43,226,0.3)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  + Start Interview
                </button>
              </div>
            </div>
            <ScoreCard score={overallScore} />
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {cards.map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} style={{
                  background: '#fff', border: '0.5px solid #d0d0d0', borderRadius: 14,
                  padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8,
                  transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 14, color: '#888', fontWeight: 500 }}>{c.label}</span>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: iconBg[c.color].bg, color: iconBg[c.color].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 500, color: '#111115' }}>{c.value}</div>
                  <div style={{ fontSize: 13, color: c.change === '—' ? '#9E9EB0' : (c.trend === 'up' ? '#1D9E75' : '#E24B4A'), display: 'flex', alignItems: 'center', gap: 4 }}>
                    {c.change !== '—' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {c.trend === 'up'
                          ? <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>
                          : <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>
                        }
                      </svg>
                    )}
                    {c.change}
                  </div>
                </div>
              )
            })}
          </div>

          <PerformanceTrends />
          <InterviewGoals rows={rows} />
          <Footer />
        </div>
      </div>

      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(17,17,21,0.8)', zIndex: 999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <Loader2 size={40} color="#7C3AED" style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 500 }}>Preparing your interview...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
    </div>
  )
}
