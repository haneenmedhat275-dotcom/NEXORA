const SkillBar = ({ label, value, color = 'purple' }) => (
  <div className="mb-4">
    <div className="mb-1.5 flex items-center justify-between">
      <span className="text-sm text-[#9E9EA1]">{label}</span>
      <span className="text-sm font-medium text-white">{value}%</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#2D2D34]">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          color === 'purple' ? 'bg-[#583291]' : 'bg-[#4FACFE]'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default SkillBar;
