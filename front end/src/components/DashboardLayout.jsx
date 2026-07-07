import AppSidebar from './AppSidebar'
import Navbar from './Navbar'
import Footer from './Footer'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#EEEEF8' }}>
      <AppSidebar />
      <div className="flex-1" style={{ marginLeft: 240 }}>
        <Navbar />
        <main className="p-6">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  )
}
