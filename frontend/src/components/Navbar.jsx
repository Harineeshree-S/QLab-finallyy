import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import * as auth from '../services/auth';

const Navbar = ({ items = null }) => {
  const location = useLocation();

  const navItems = items || [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/challenges', label: 'Challenges', icon: '🌍' },
    { path: '/challengeroom', label: 'Challenge Room', icon: '⚡' },
    { path: '/about', label: 'About', icon: '📚' },
    { path: '/upload', label: 'Upload', icon: '📤' }
  ];

  const authCtx = useAuth() || {};
  const { user, setUser } = authCtx;

  const handleLogout = async () => {
    await auth.logout();
    if (setUser) setUser(null);
  };

  return (
    <nav className="nav-menu">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}

      <div style={{ marginTop: 14 }}>
        {user ? (
          <div className="nav-link" role="button" tabIndex={0} onClick={handleLogout}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Logout</span>
          </div>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              <span className="nav-icon">🔑</span>
              <span className="nav-label">Login</span>
            </Link>
            <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
              <span className="nav-icon">✍️</span>
              <span className="nav-label">Register</span>
            </Link>
            <Link to="/privacy" className={`nav-link ${location.pathname === '/privacy' ? 'active' : ''}`}>
              <span className="nav-icon">🔒</span>
              <span className="nav-label">Privacy</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string
  }))
};

export default Navbar;
