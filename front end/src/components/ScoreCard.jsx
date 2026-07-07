import { useState, useEffect } from 'react'

export default function ScoreCard({ score = 78 }) {
  const [offset, setOffset] = useState(282.74)

  const radius = 45
  const strokeWidth = 9
  const circumference = 2 * Math.PI * radius

  const clamped = Math.min(100, Math.max(0, score))
  const progress = (100 - clamped) / 100 * circumference

  let label, labelColor
  if (clamped >= 90) { label = 'Excellent'; labelColor = '#2eaa7e' }
  else if (clamped >= 70) { label = 'Good'; labelColor = '#2eaa7e' }
  else if (clamped >= 50) { label = 'Fair'; labelColor = '#e5a000' }
  else { label = 'Needs Work'; labelColor = '#d84040' }

  useEffect(() => {
    const timer = setTimeout(() => setOffset(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 16,
      border: '1px solid #E8E5F5',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }}>
      <p style={{ color: '#111115', fontSize: 18, fontWeight: 700, 
lineHeight: 1.4, fontFamily: 'Inter, sans-serif', margin: 0, marginBottom: 8, width: '100%' }}>Overall Readiness Score</p>
      <svg width={108} height={108} viewBox="0 0 108 108">
        <circle
          cx="54" cy="54" r={radius}
          fill="none"
          stroke="#e8e5f5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="54" cy="54" r={radius}
          fill="none"
          stroke="#3C3489"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: '54px 54px' }}
        />
        <text x="54" y="48" textAnchor="middle" dominantBaseline="central" fill="#111115" fontSize="22" fontWeight="700" fontFamily="inherit">
          {clamped}%
        </text>
        <text x="54" y="63" textAnchor="middle" dominantBaseline="central" fill={labelColor} fontSize="11" fontWeight="600" fontFamily="inherit">
          {label}
        </text>
      </svg>
      <p style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
        Keep focusing on your weak areas to reach excellence.
      </p>
    </div>
  )
}
