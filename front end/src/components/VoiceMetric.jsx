const VoiceMetric = ({ children }) => (
  <div className="rounded-lg border border-[#2D2D34] bg-[#111115] p-4">
    {children}
  </div>
);

export const MetricRow = ({ label, badge, badgeColor, value, tip, target }) => (
  <VoiceMetric>
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#9E9EA1]">{label}</span>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          badgeColor === 'orange' ? 'bg-orange-900/40 text-orange-400' :
          badgeColor === 'green' ? 'bg-green-900/40 text-green-400' : ''
        }`}>
          {badge}
        </span>
      )}
    </div>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    {tip && <p className="mt-1 text-xs text-[#666672]">{tip}</p>}
    {target && <p className="mt-1 text-xs text-[#666672]">{target}</p>}
  </VoiceMetric>
);

export const ProgressMetric = ({ label, value, barColor = 'blue', tip }) => (
  <VoiceMetric>
    <div className="mb-2 flex items-center justify-between">
      <span className="text-sm text-[#9E9EA1]">{label}</span>
      <span className="text-sm font-medium text-white">{value}%</span>
    </div>
    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-[#2D2D34]">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          barColor === 'blue' ? 'bg-[#4FACFE]' : 'bg-[#583291]'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
    {tip && <p className="text-xs text-[#666672]">{tip}</p>}
  </VoiceMetric>
);

export default VoiceMetric;
