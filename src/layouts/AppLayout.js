import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN); };

  return <div className="app-shell">
    <aside className="sidebar">
      <Logo />
      <nav className="sidebar-nav">
        <NavLink to={ROUTES.DASHBOARD}><i className="bi bi-graph-up" /> Dashboard</NavLink>
        <NavLink to={ROUTES.CREATE_TEST}><i className="bi bi-pencil-square" /> Test Creation</NavLink>
        <NavLink to={ROUTES.TRACKING}><i className="bi bi-calendar-check" /> Test Tracking</NavLink>
      </nav>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <div />
        <div className="topbar-actions">
          <button className="notification"><i className="bi bi-bell" /><span /></button>
          <div className="avatar">A</div>
          <div className="profile-copy"><strong>{user?.name || 'Alex Wando'}</strong><small>{user?.role || 'Admin'}</small></div>
          <button className="btn btn-light btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <section className="content-area"><Outlet /></section>
    </main>
  </div>;
}
