import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import Dashboard from './pages/Dashboard'
import InterviewRecording from './pages/InterviewRecording'
import InterviewSetup from './pages/InterviewSetup'
import Reports from './pages/Reports'
import SignUpPage from './pages/SignUpPage'
import Settings from './pages/Settings'
import ProgressPage from './pages/progress'
import UploadCV from './pages/UploadCV'
import VerifyProfile from './pages/VerifyProfile'
import Success from './pages/Success'
import CareerPath from './pages/CareerPath'

function AppContent() {
  const navigate = useNavigate()
  const { user } = useUser()

  useEffect(() => {
    if (!user) return;
    const handler = () => {
      window.history.pushState(null, "", window.location.pathname);
    };
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [user]);

  const sharedProps = {
    onLoginClick: () => navigate('/login'),
    onSignUpClick: () => navigate('/signup'),
    onForgotClick: () => navigate('/forgot-password'),
    onBack: () => navigate('/'),
    onLoginSuccess: () => navigate('/dashboard', { replace: true }),
  }

  const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

  return (
    <Routes>
      <Route path="/" element={<LandingPage {...sharedProps} />} />
      <Route path="/login" element={<LoginPage {...sharedProps} />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage onLoginClick={() => navigate('/login')} />} />
      <Route path="/signup" element={<SignUpPage onLoginClick={() => navigate('/login')} onBack={() => navigate('/')} />} />
      <Route path="/dashboard" element={<P><Dashboard /></P>} />
      <Route path="/analytics" element={<P><AnalyticsDashboard /></P>} />
      <Route path="/interview" element={<P><InterviewRecording /></P>} />
      <Route path="/interviews" element={<P><InterviewSetup /></P>} />
      <Route path="/reports" element={<P><Reports /></P>} />
      <Route path="/reports/:interviewId" element={<P><Reports /></P>} />
      <Route path="/progress" element={<P><ProgressPage /></P>} />
      <Route path="/settings" element={<P><Settings /></P>} />
      <Route path="/upload-cv" element={<P><UploadCV /></P>} />
      <Route path="/verify" element={<P><VerifyProfile /></P>} />
      <Route path="/career-path" element={<P><CareerPath /></P>} />
      <Route path="/success" element={<P><Success /></P>} />
      <Route path="*" element={<LandingPage {...sharedProps} />} />
    </Routes>
  )
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App
