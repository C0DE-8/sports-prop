import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage/index.jsx'
import DashboardPage from './pages/DashboardPage/index.jsx'
import LandingPage from './pages/LandingPage/index.jsx'
import MatchesPage from './pages/MatchesPage/index.jsx'
import NotFoundPage from './pages/NotFoundPage/index.jsx'
import PropsPage from './pages/PropsPage/index.jsx'
import StatusPage from './pages/StatusPage/index.jsx'
import Navigation from './components/navigation/Navigation.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Navigation />

      <main className="page">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/props" element={<PropsPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
