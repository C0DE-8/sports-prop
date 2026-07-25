import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { FaChartLine, FaDatabase, FaHouse, FaListUl, FaRightToBracket, FaSignal, FaTrophy } from 'react-icons/fa6'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import MatchesPage from './pages/MatchesPage.jsx'
import PropsPage from './pages/PropsPage.jsx'
import StatusPage from './pages/StatusPage.jsx'
import './App.css'

const navItems = [
  { to: '/', label: 'Home', icon: FaHouse },
  { to: '/dashboard', label: 'Dashboard', icon: FaChartLine },
  { to: '/props', label: 'Props', icon: FaListUl },
  { to: '/matches', label: 'Matches', icon: FaTrophy },
  { to: '/status', label: 'Status', icon: FaSignal },
  { to: '/login', label: 'Login', icon: FaRightToBracket },
]

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <FaChartLine />
          </span>
          <div>
            <strong>Prop Desk</strong>
            <span>Sports prop board</span>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="gateway-chip">
          <FaDatabase />
          <span>DBMS Gateway</span>
        </div>
      </aside>

      <main className="page">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/props" element={<PropsPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
