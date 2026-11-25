import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import Brand from '../ui/Brand';
import Icon from '../ui/Icon';
import ThemeToggle from '../ui/ThemeToggle';
import './CustomerLayout.css';

const navItems = [
  { to: ROUTES.APP_RESOURCES, label: 'Catalogue', icon: 'search' },
  { to: ROUTES.APP_BOOKINGS, label: 'My bookings', icon: 'calendar' },
];

/**
 * Customer Layout
 * Shell for authenticated customer pages.
 */
const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'Account';
  const initial = (user?.firstName || user?.email || 'U').charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="customer-layout">
      <a className="skip-link" href="#app-main">
        Skip to content
      </a>

      <header className="customer-header">
        <div className="container-fluid customer-nav">
          <Brand />

          <nav className="customer-nav-links" aria-label="Customer workspace">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="customer-nav-actions">
            <ThemeToggle />

            <Link to={ROUTES.ORG_DASHBOARD} className="customer-console-link">
              <Icon name="building" size={16} />
              <span>Operator console</span>
            </Link>

            <span className="customer-nav-divider" aria-hidden="true" />

            {user ? (
              <>
                <span className="customer-user" title={user?.email}>
                  <span className="customer-avatar" aria-hidden="true">
                    {initial}
                  </span>
                  <span className="customer-user-name">{displayName}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm customer-signout"
                >
                  <Icon name="logout" size={16} />
                  <span>Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
                  Create account
                </Link>
              </>
            )}

            <button
              type="button"
              className="customer-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="customer-mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="customer-mobile-nav" className="customer-mobile-nav" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="customer-mobile-link">
                <span>
                  <Icon name={item.icon} size={17} />
                  {item.label}
                </span>
                <Icon name="arrowUpRight" size={16} />
              </NavLink>
            ))}
            <NavLink to={ROUTES.ORG_DASHBOARD} className="customer-mobile-link">
              <span>
                <Icon name="building" size={17} />
                Operator console
              </span>
              <Icon name="arrowUpRight" size={16} />
            </NavLink>
            {user && (
              <button
                type="button"
                className="customer-mobile-logout"
                onClick={handleLogout}
              >
                <Icon name="logout" size={17} />
                Sign out of {user?.email || 'your account'}
              </button>
            )}
          </nav>
        )}
      </header>

      <main id="app-main" className="customer-main">
        <Outlet />
      </main>

      <footer className="customer-footer">
        <div className="container-fluid customer-footer-inner">
          <span className="mono">flowgrid / customer console</span>
          <div className="customer-footer-meta">
            <Link to={ROUTES.APP_RESOURCES}>Catalogue</Link>
            <Link to={ROUTES.APP_BOOKINGS}>Bookings</Link>
            <span className="customer-footer-live">
              <span className="status-dot" aria-hidden="true" />
              Live
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
