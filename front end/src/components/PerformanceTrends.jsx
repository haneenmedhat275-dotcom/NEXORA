import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Activity, Layers, Eye } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

const insights = [
  { icon: Activity,  color: { bg: '#EEEDFE', text: '#3C3489' }, title: 'Speech Pace',      desc: 'Candidates are speaking 15% faster during technical questions. Recommend breathing prompts.' },
  { icon: Layers,    color: { bg: '#E1F5EE', text: '#0F6E56' }, title: 'Answer Structure', desc: 'STAR method usage is up by 40% this week. Improving result clarity in reports.' },
  { icon: Eye, color: { bg: '#E6F1FB', text: '#185FA5' }, title: 'Eye Contact', desc: 'High level of engagement detected across senior roles.' },
]

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    data: [42, 55, 48, 62, 58, 70, 75],
    borderColor: '#534AB7',
    borderWidth: 2,
    pointBackgroundColor: '#534AB7',
    tension: 0.45,
    fill: true,
    backgroundColor: 'rgba(83,74,183,0.07)',
  }],
}

export default function PerformanceTrends() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
      <div style={{ background: '#fff', border: '0.5px solid #d0d0d0', borderRadius: 14, padding: '1.1rem 1.25rem' }}>
        <p style={{ fontWeight: 500, margin: '0 0 2px' }}>Performance Trends</p>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 1rem' }}>Real-time performance metrics</p>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 6px' }}>Readiness Over Time</p>
        <div style={{ height: 180 }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { color: '#e8e7e0' }, ticks: { font: { size: 11 } } } } }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111115', margin: 0 }}>AI Behavioral Insights</p>
        {insights.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} style={{
              background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '14px 16px', display: 'flex', gap: 10, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: item.color.text }} />
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: item.color.bg, color: item.color.text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Icon size={15} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111115', margin: '0 0 4px' }}>{item.title}</p>
                <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
