import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo from "../assets/LOGO.svg";
import { LayoutDashboard, Users, BarChart2, FileText, TrendingUp, Settings, HelpCircle, LogOut, Search, Bell, ChevronDown } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Interviews", path: "/interviews" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

function DashboardPageLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useUser();
  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="flex min-h-screen bg-nexora-bg">

      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-4">

        {/* Logo */}
        <div className="mb-8 px-2">
          <img src={logo} alt="Nexora" className="h-8" />
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${location.pathname === item.path
                  ? "bg-nexora-dark text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col gap-1 border-t border-gray-100 pt-4">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
            <HelpCircle size={18} />
            Help Center
          </button>
          <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50">
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-80">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search ..."
              className="bg-transparent text-sm text-gray-600 outline-none w-full"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100">
              <Bell size={18} className="text-gray-500" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-xl px-2 py-1">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-nexora-purple-light flex items-center justify-center text-nexora-purple font-semibold text-sm">
                  {initials}
                </div>
              )}
              <span className="text-sm font-medium text-gray-700">{user?.name || "Guest"}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>

        </div>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>


  {/* Footer */}
  <footer className="px-8 py-6 border-t border-gray-100 bg-nexora-bg flex items-center justify-between">
    <div>
      <img src={logo} alt="Nexora" className="h-8 mb-2" />
      <p className="text-sm text-gray-400">
        © 2024 NEXORA. Tactile Intelligence for the Modern Enterprise.
      </p>
    </div>

    <div className="flex gap-8 text-sm text-gray-500">
      <button className="hover:text-nexora-purple" onClick={() => window.open('https://nexora.com/privacy', '_blank')}>
        Privacy
      </button>
      <button className="hover:text-nexora-purple" onClick={() => window.open('https://nexora.com/terms', '_blank')}>
        Terms
      </button>
      <button className="hover:text-nexora-purple" onClick={() => window.open('https://nexora.com/api-status', '_blank')}>
        API Status
      </button>
      <button className="hover:text-nexora-purple" onClick={() => window.open('https://linkedin.com/company/nexora', '_blank')}>
        LinkedIn
      </button>
    </div>
  </footer>
      </div>

    </div>
  );
}

export default DashboardPageLayout;