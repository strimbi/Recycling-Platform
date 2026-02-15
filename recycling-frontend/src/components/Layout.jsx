import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';

function NavItem({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const auth = useAuth();
  const nav = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand" onClick={() => nav('/')}>
          ♻️ Recycling Platform
        </div>

        <nav className="nav">
          <NavItem to="/" end>Map</NavItem>
          <NavItem to="/leaderboard">Leaderboard</NavItem>

          {auth.isAuthed && <NavItem to="/reports">Report</NavItem>}
          {auth.isAuthed && <NavItem to="/my-reports">My reports</NavItem>}

          {auth.isAdmin && <NavItem to="/admin/reports">Admin reports</NavItem>}
          {auth.isAdmin && <NavItem to="/admin/locations">Admin locations</NavItem>}
        </nav>

        <div className="authbox">
          {!auth.isAuthed ? (
            <>
              <button className="btn" onClick={() => nav('/login')}>Login</button>
              <button className="btn btn-primary" onClick={() => nav('/register')}>Register</button>
            </>
          ) : (
            <>
              <div className="me">
                <div className="me-name">{auth.user?.displayName ?? auth.user?.email}</div>
                <div className="me-role">{auth.user?.role}</div>
              </div>
              <button className="btn" onClick={() => { auth.logout(); nav('/'); }}>Logout</button>
            </>
          )}
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
