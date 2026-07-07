import InterviewHistory from './InterviewHistory'
import GoalsTracking from './GoalsTracking'

export default function InterviewGoals({ rows = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
      <InterviewHistory rows={rows} />
      <GoalsTracking rows={rows} />
    </div>
  )
}
