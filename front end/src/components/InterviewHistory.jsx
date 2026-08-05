import { useNavigate } from 'react-router-dom';
import { Code2, Users, Layers, Briefcase, Terminal, Globe, Database, Shield } from 'lucide-react';

const hardcodedRows = [
  { icon: Code2, type: 'React Dev Role', status: 'Completed', score: 45 },
  { icon: Users, type: 'HR Behavioral', status: 'In Progress', score: 44 },
  { icon: Layers, type: 'System Design', status: 'In Progress', score: 44 },
  { icon: Layers, type: 'System Design', status: 'In Progress', score: 44 },
];

const statusStyles = {
  'Completed': { bg: '#DCFCE7', color: '#16A34A' },
  'In Progress': { bg: '#DBEAFE', color: '#2563EB' },
};

export default function InterviewHistory({ rows: propRows }) {
  const navigate = useNavigate();
  const rows = propRows && propRows.length > 0 ? propRows : hardcodedRows;

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '24px', padding: '28px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111115' }}>Interview History</h3>
        <span onClick={() => navigate('/reports')} style={{ fontSize: '14px', color: '#4F46E5', fontWeight: 500, cursor: 'pointer' }}>View All</span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
        paddingBottom: '12px', borderBottom: '1px solid #F0F0F5', marginBottom: '8px',
      }}>
        <span style={{ fontSize: '13px', color: '#9E9EB0', fontWeight: 500 }}>Interview Type</span>
        <span style={{ fontSize: '13px', color: '#9E9EB0', fontWeight: 500, textAlign: 'center' }}>Status</span>
        <span style={{ fontSize: '13px', color: '#9E9EB0', fontWeight: 500, textAlign: 'center' }}>Score</span>
        <span style={{ fontSize: '13px', color: '#9E9EB0', fontWeight: 500, textAlign: 'center' }}>Action</span>
      </div>

      {rows.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: '#9E9EB0', fontSize: '14px' }}>
          No interview records yet
        </div>
      ) : (
        rows.map((item, i) => {
          const Icon = item.icon;
          const statusStyle = statusStyles[item.status];
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
              alignItems: 'center', padding: '16px 0',
              borderBottom: i < rows.length - 1 ? '1px solid #F5F5FA' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color="#7C3AED" />
                <span style={{ fontSize: '14px', color: '#111115', fontWeight: 500 }}>{item.type}</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500, background: statusStyle.bg, color: statusStyle.color }}>
                  {item.status}
                </span>
              </div>

              <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: item.score !== null && item.score !== undefined ? '#111115' : '#9E9EB0' }}>{item.score !== null && item.score !== undefined ? `${item.score}%` : '—'}</div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => navigate(item.interviewId ? `/reports/${item.interviewId}` : '/reports')}
                  style={{
                  background: 'transparent', border: '1px solid #E5E5EC', borderRadius: '8px',
                  padding: '8px 16px', fontSize: '13px', color: '#6B7280', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#7C3AED'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5EC'; e.currentTarget.style.color = '#6B7280'; }}
                >
                  View Report
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
