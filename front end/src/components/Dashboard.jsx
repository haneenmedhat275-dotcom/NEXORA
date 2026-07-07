import { useNavigate } from 'react-router-dom'
import { Target, Clock, BookOpen, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'
import AppSidebar from '../components/AppSidebar'

const stats = [
  { icon: Target, title: 'Total Interviews', value: '12', badge: '+3', color: '#7C3AED' },
  { icon: Clock, title: 'Practice Hours', value: '42h', badge: '+6h', color: '#3B82F6' },
  { icon: BookOpen, title: 'Skills Assessed', value: '8', badge: '2 new', color: '#10B981' },
  { icon: TrendingUp, title: 'Avg. Score', value: '78%', badge: '+5%', color: '#F59E0B' },
]

const quickActions = [
  { label: 'Start a Mock Interview', desc: 'Practice with AI-powered feedback', color: '#7C3AED' },
  { label: 'Review Your Weak Areas', desc: 'Focus on improving your skills', color: '#3B82F6' },
  { label: 'View Performance Report', desc: 'Track your progress over time', color: '#10B981' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen" style={{ background: '#EEEEF8' }}>
      <AppSidebar />
      <div style={{ marginLeft: 240, flex: 1, padding: '32px', maxWidth: 1000 }}>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111115' }}>Welcome back, Salma 👋</h1>
        <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>Here's your interview preparation overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.title} style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px solid #E8E8F4',
              padding: 20,
              transition: 'all 0.25s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={s.color} />
                </div>
                <span style={{ color: '#6B7280', fontSize: 14, fontWeight: 500 }}>{s.title}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111115' }}>{s.value}</div>
              <span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>{s.badge}</span>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1.5px solid #E8E8F4', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111115', marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate('/analytics')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderRadius: 12, border: '1px solid #E8E8F4',
                background: '#FAFAFE', cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.background = '#F5F3FF' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E8E8F4'; e.currentTarget.style.background = '#FAFAFE' }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#111115', fontSize: 14 }}>{a.label}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>{a.desc}</div>
              </div>
              <ArrowRight size={18} color={a.color} />
            </button>
          ))}
        </div>
      </div>

      {/* Start Practice CTA */}
      <div style={{
        background: '#F8F8FF', borderRadius: 16, padding: '24px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: '1px solid #E8E8F4',
      }}>
        <div>
          <p style={{ fontWeight: 600, color: '#1F2937', fontSize: 16 }}>Ready to level up?</p>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>
            Start a personalized practice session based on your weak areas
          </p>
        </div>
        <button
          onClick={() => navigate('/interviews/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12, border: 'none',
            background: '#111115', color: '#FFFFFF', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#2D2D34' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#111115' }}
        >
          Start AI Practice <Sparkles size={16} />
        </button>
      </div>
    </div>
    </div>
  )
}
