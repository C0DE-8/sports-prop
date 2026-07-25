import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaBars,
  FaChartLine,
  FaDatabase,
  FaHouse,
  FaListUl,
  FaRightToBracket,
  FaSignal,
  FaTrophy,
  FaXmark,
} from 'react-icons/fa6'
import styles from './Navigation.module.css'

const navItems = [
  { to: '/', label: 'Home', icon: FaHouse },
  { to: '/dashboard', label: 'Dashboard', icon: FaChartLine },
  { to: '/props', label: 'Props', icon: FaListUl },
  { to: '/matches', label: 'Matches', icon: FaTrophy },
  { to: '/status', label: 'Status', icon: FaSignal },
  { to: '/login', label: 'Login', icon: FaRightToBracket },
]

function Navigation() {
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  return (
    <>
      <header className={styles.mobileTopbar}>
        <Brand />
        <button
          className={styles.menuButton}
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <FaXmark /> : <FaBars />}
        </button>
      </header>

      <button
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
        type="button"
        aria-label="Close menu"
        onClick={closeMenu}
      />

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.desktopBrand}>
          <Brand />
        </div>

        <nav className={styles.navLinks} aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={closeMenu}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className={styles.gatewayChip}>
          <FaDatabase />
          <span>DBMS Gateway</span>
        </div>
      </aside>
    </>
  )
}

function Brand() {
  return (
    <div className={styles.brand}>
      <span className={styles.brandMark}>
        <FaChartLine />
      </span>
      <div>
        <strong>Prop Desk</strong>
        <span>Sports prop board</span>
      </div>
    </div>
  )
}

export default Navigation
