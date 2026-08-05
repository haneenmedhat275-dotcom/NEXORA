import { useState } from 'react'
import { Award } from 'lucide-react';

const staticGoals = [
  { label: 'Complete 5 mock interviews', displayFraction: '4 / 5', percent: 80, color: '#583291' },
  { label: 'Reach 85% confidence score', displayFraction: '78% / 85%', percent: 91.7, color: '#111115' },
  { label: 'Practice 3 days streak', displayFraction: '2 / 3', percent: 66.6, color: '#583291' },
];

const staticStats = [
  { label: 'Day streak', value: '7' },
  { label: 'Badges', value: '3' },
  { label: 'Elite', isAward: true },
];

export default function GoalsTracking({ rows = [] }) {
  const [activeStat, setActiveStat] = useState(null)

  if (!rows || rows.length === 0) {
    return (
      <div style={{
        background: '#FFFFFF', borderRadius: '24px', padding: '28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111115', margin: '0 0 24px' }}>
          Goals Tracking
        </h3>
        {staticGoals.map((goal, i) => (
          <div key={i} style={{ marginBottom: i < staticGoals.length - 1 ? '24px' : 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', color: '#374151' }}>{goal.label}</span>
              <span style={{ fontSize: '14px', color: '#111115', fontWeight: 600 }}>{goal.displayFraction}</span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: '#E8E8F0', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${goal.percent}%`, background: goal.color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {staticStats.map((s, i) => {
            const isActive = activeStat === i
            return (
              <div key={i} onClick={() => setActiveStat(activeStat === i ? null : i)}
                style={{ flex: 1, borderRadius: '16px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: isActive ? '#583291' : '#F5F4FA', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                {s.isAward ? <Award size={20} color={isActive ? '#FFFFFF' : '#583291'} style={{ marginBottom: '4px' }} /> : <div style={{ fontSize: '24px', fontWeight: 700, color: isActive ? '#FFFFFF' : '#111115' }}>{s.value}</div>}
                <div style={{ fontSize: s.isAward ? '13px' : '11px', fontWeight: s.isAward ? 600 : 400, color: isActive ? '#FFFFFF' : '#9E9EB0', marginTop: s.isAward ? 0 : '2px' }}>{s.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const completed = rows.filter(r => r.status === 'Completed').length
  const total = rows.length
  const bestScore = Math.max(...rows.map(r => r.score ?? 0))
  const completedPct = Math.min(100, Math.round((completed / 5) * 100))
  const scorePct = Math.min(100, Math.round((bestScore / 85) * 100))

  const goals = [
    { label: 'Complete 5 mock interviews', displayFraction: `${completed} / 5`, percent: completedPct, color: '#583291' },
    { label: 'Reach 85% confidence score', displayFraction: `${bestScore}% / 85%`, percent: scorePct, color: '#111115' },
    { label: 'Practice 3 days streak', displayFraction: `${Math.min(completed, 3)} / 3`, percent: Math.min(100, Math.round((completed / 3) * 100)), color: '#583291' },
  ];

  const badgeCount = rows.filter(r => r.score !== null && r.score >= 70).length

  const stats = [
    { label: 'Day streak', value: `${Math.min(total, 30)}` },
    { label: 'Badges', value: `${badgeCount}` },
    { label: 'Elite', isAward: bestScore >= 85 },
  ];

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '24px', padding: '28px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111115', margin: '0 0 24px' }}>
        Goals Tracking
      </h3>

      {goals.map((goal, i) => (
        <div key={i} style={{ marginBottom: i < goals.length - 1 ? '24px' : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>{goal.label}</span>
            <span style={{ fontSize: '14px', color: '#111115', fontWeight: 600 }}>{goal.displayFraction}</span>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: '#E8E8F0', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${goal.percent}%`, background: goal.color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        {stats.map((s, i) => {
          const isActive = activeStat === i
          return (
            <div key={i} onClick={() => setActiveStat(activeStat === i ? null : i)}
              style={{ flex: 1, borderRadius: '16px', padding: '16px', textAlign: 'center', cursor: 'pointer', background: isActive ? '#583291' : '#F5F4FA', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              {s.isAward ? <Award size={20} color={isActive ? '#FFFFFF' : '#583291'} style={{ marginBottom: '4px' }} /> : <div style={{ fontSize: '24px', fontWeight: 700, color: isActive ? '#FFFFFF' : '#111115' }}>{s.value}</div>}
              <div style={{ fontSize: s.isAward ? '13px' : '11px', fontWeight: s.isAward ? 600 : 400, color: isActive ? '#FFFFFF' : '#9E9EB0', marginTop: s.isAward ? 0 : '2px' }}>{s.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
