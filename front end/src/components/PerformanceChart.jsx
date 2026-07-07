import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { week: 'Week 1', Behavioral: 45, Score: 50, Technical: 42 },
  { week: 'Week 2', Behavioral: 52, Score: 55, Technical: 48 },
  { week: 'Week 3', Behavioral: 58, Score: 62, Technical: 55 },
  { week: 'Week 4', Behavioral: 65, Score: 68, Technical: 60 },
  { week: 'Week 5', Behavioral: 72, Score: 75, Technical: 68 },
  { week: 'Week 6', Behavioral: 78, Score: 82, Technical: 75 },
  { week: 'Week 7', Behavioral: 85, Score: 88, Technical: 82 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-[#2D2D34] bg-[#1A1A1F] p-3 shadow-xl">
      <p className="mb-1 text-xs text-[#9E9EA1]">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {entry.value}%
        </p>
      ))}
    </div>
  );
};

const PerformanceChart = () => (
  <div className="rounded-xl border border-[#2D2D34] bg-[#1A1A1F] p-5">
    <div className="mb-1">
      <h3 className="text-base font-semibold text-white">Performance Progression</h3>
      <p className="text-xs text-[#666672]">Your interview readiness over time</p>
    </div>
    <div className="mt-4" style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D2D34" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: '#666672', fontSize: 12 }} axisLine={{ stroke: '#2D2D34' }} tickLine={false} />
          <YAxis domain={[40, 100]} tick={{ fill: '#666672', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Line type="monotone" dataKey="Behavioral" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: '#F59E0B' }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="Score" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: '#22C55E' }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="Technical" stroke="#4FACFE" strokeWidth={2} dot={{ r: 3, fill: '#4FACFE' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PerformanceChart;
