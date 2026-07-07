const StatCard = ({ value, badge, badgeColor, subtitle, label, icon: Icon }) => (
  <div className="rounded-xl border border-[#2D2D34] bg-[#1A1A1F] p-5 transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(58,16,120,0.15)]">
    <div className="mb-1 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-[#9E9EA1]" />}
      <span className="text-xs font-medium text-[#9E9EA1]">{label}</span>
    </div>
    <div className="mt-2 flex items-baseline gap-3">
      <span className="text-3xl font-bold text-white">{value}</span>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
          badgeColor === 'green' ? 'bg-green-900/40 text-green-400' : 'bg-green-900/40 text-green-400'
        }`}>
          {badge}
        </span>
      )}
    </div>
    <p className="mt-1 text-xs text-[#666672]">{subtitle}</p>
  </div>
);

export default StatCard;
