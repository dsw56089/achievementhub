import { NavLink, Outlet } from 'react-router-dom'
import { Gamepad2, Compass, Trophy, Pin, ListChecks, User, PlusCircle } from 'lucide-react'

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/gry" className="brand">
            <span className="brand-mark"><Trophy size={19} /></span>
            <span>achievement<span className="brand-accent">hub</span></span>
          </NavLink>
          <nav className="main-nav">
            <NavLink to="/gry" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Gamepad2 size={17} /> Gry</NavLink>
            <NavLink to="/odkrywaj" className="nav-link"><Compass size={17} /> Odkrywaj</NavLink>
            <NavLink to="/przypiete" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Pin size={17} /> Przypięte</NavLink>
            <NavLink to="/moje" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><ListChecks size={17} /> Moje</NavLink>
            <NavLink to="/nowe" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><PlusCircle size={17} /> Nowe</NavLink>
            <NavLink to="/profil" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><User size={17} /> Profil</NavLink>
          </nav>
          <div className="topbar-right">
            <span className="online-dot" />
            <span className="user-label">Gracz</span>
            <div className="avatar">G</div>
          </div>
        </div>
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="footer">
        <span>© 2025 Achievement Hub</span>
        <span>Stworzone dla łowców osiągnięć <Trophy size={13} /></span>
      </footer>
    </div>
  )
}
