import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
  LayoutDashboard, FileText, BarChart3, BookOpen, TrendingUp, Settings,
  HelpCircle, LogOut
} from 'lucide-react';
import logo from '../assets/LOGO.svg';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Interviews', path: '/interviews' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: BookOpen, label: 'Reports', path: '/reports' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside style={{
      width: 240,
      height: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
     {/* Logo */}
<Link to="/" style={{ textDecoration: 'none' }}>
  <div style={{ display: 'flex', alignItems: 'center', padding: '15px 15PX 15px' }}>
    <img src={logo} alt="NEXORA" width={150} height={40} />
  </div>
</Link>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 16px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: isActive ? '#FFFFFF' : '#6B7280',
                background: isActive ? '#111115' : 'transparent',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.color = '#1F2937'; }}}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link
          to="/help"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: '#6B7280',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.color = '#1F2937'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
        >
          <HelpCircle size={20} />
          <span>Help Center</span>
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: '#FF4444',
            fontSize: '14px',
            fontWeight: 500,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}