import { Search, Bell } from 'lucide-react'
import { useUser } from '../context/UserContext'

export default function Navbar() {
  const { user } = useUser();
  const displayName = user?.name || "Guest";
  const initials = displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
  const avatar = user?.avatar;

  return (
    <header
      className="h-16 flex items-center px-6 sticky top-0 z-40 border-b shadow-sm"
      style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:flex items-center rounded-lg px-3 py-1.5 border" style={{ width: '567px', background: '#EEEEF8', borderColor: '#E5E7EB' }}>
          <Search size={16} style={{ color: '#9CA3AF' }} className="mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: '#1F2937' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative transition-colors" style={{ color: '#6B7280' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1F2937'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6B7280'; }}
        >
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#4FACFE' }} />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          {avatar ? (
            <img src={avatar} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #3A1078, #4FACFE)' }}
            >
              {initials}
            </div>
          )}
          <span className="text-sm font-medium hidden sm:block" style={{ color: '#1F2937' }}>{displayName}</span>
        </div>
      </div>
    </header>
  )
}
