import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { pathname } = useLocation();
  
  
  
  const name = sessionStorage.getItem('name');
  const role = sessionStorage.getItem('role');
  const token =sessionStorage.getItem('token');
  const isLoggedIn = !!token;
  
  const isAuthPage = pathname === '/auth';
  const isHome = pathname === '/';
  const isJobs = pathname === '/jobs';
  const isDashboard = pathname === '/dashboard';
  
  const isAdminDashboard = pathname === '/admin-dashboard';

  const handleLogout = () => {
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Job Portal</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {!isHome && !isAdminDashboard && (
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
            )}

            {!isJobs && !isAdminDashboard && (
              <li className="nav-item">
                <Link className="nav-link" to="/jobs">Jobs</Link>
              </li>
            )}

            {!isLoggedIn && !isAuthPage && (
              <li className="nav-item">
                <Link className="nav-link" to="/auth">Login/Register</Link>
              </li>
            )}

            {isLoggedIn && (
              <>
                {!isDashboard && !isAdminDashboard && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                )}

                {isDashboard && (
                  <li className="nav-item">
                    <NotificationBell />
                  </li>
                )}

                <li className="nav-item">
                  <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
