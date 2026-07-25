import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { FaChartLine, FaDatabase, FaHouse, FaListUl, FaSignal } from 'react-icons/fa6'
import DashboardPage from './pages/DashboardPage.jsx'
import PropsPage from './pages/PropsPage.jsx'
import StatusPage from './pages/StatusPage.jsx'
import './App.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: FaHouse },
  { to: '/props', label: 'Props', icon: FaListUl },
  { to: '/status', label: 'Status', icon: FaSignal },
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
          <Route path="/" element={<DashboardPage />} />
          <Route path="/props" element={<PropsPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
