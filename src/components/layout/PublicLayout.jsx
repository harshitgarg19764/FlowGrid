import { useEffect, useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Brand from '../ui/Brand';
import Icon from '../ui/Icon';
import ThemeToggle from '../ui/ThemeToggle';
import './PublicLayout.css';

/**
 * Public Layout
 * Used for landing, auth and organisation registration pages.
 */
const PublicLayout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: ROUTES.APP_RESOURCES, label: 'Catalogue' },
    { to: ROUTES.REGISTER_ORGANISATION, label: 'For operators' },
  ];

  return (
    <div className="public-layout">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="public-header">
        <div className="container public-nav">
          <Brand />

          <nav className="public-nav-links" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            <a href="#how-it-works" className="public-nav-link">
              How it works
            </a>
          </nav>

          <div className="public-nav-actions">
            <ThemeToggle />
            <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm public-signin">
              Sign in
            </Link>
            <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
              Create account
            </Link>
            <button
              type="button"
              className="public-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="public-mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="public-mobile-nav" className="public-mobile-nav" aria-label="Mobile">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="public-mobile-link">
                {item.label}
                <Icon name="arrowUpRight" size={16} />
              </NavLink>
            ))}
            <a href="#how-it-works" className="public-mobile-link">
              How it works
              <Icon name="arrowUpRight" size={16} />
            </a>
            <div className="public-mobile-actions">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <ThemeToggle showLabel />
              </div>
              <Link to={ROUTES.LOGIN} className="btn btn-outline btn-block">
                Sign in
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-block">
                Create account
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-section">
              <Brand light />
              <p className="footer-tagline">
                The live grid for rooms, labs, equipment, parking and chargers.
                Requests, holds and handovers in one operating record.
              </p>
              <div className="footer-status">
                <span className="status-dot" aria-hidden="true" />
                All systems operational
              </div>
            </div>

            <div className="footer-links-group">
              <div className="footer-section">
                <h2>Platform</h2>
                <Link to={ROUTES.APP_RESOURCES}>Browse catalogue</Link>
                <Link to={ROUTES.APP_BOOKINGS}>My bookings</Link>
                <Link to={ROUTES.REGISTER_ORGANISATION}>Open a workspace</Link>
              </div>

              <div className="footer-section">
                <h2>Access</h2>
                <Link to={ROUTES.LOGIN}>Sign in</Link>
                <Link to={ROUTES.REGISTER}>Create account</Link>
                <Link to={ROUTES.ORG_DASHBOARD}>Operator console</Link>
              </div>

              <div className="footer-section footer-section--meta">
                <h2>Built for</h2>
                <p>Campuses, studios, labs, buildings and shared operations teams.</p>
                <span className="footer-coordinate mono">51.5072° N / 0.1276° W</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 FlowGrid. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#terms">Terms</a>
              <a href="#privacy">Privacy</a>
              <span className="mono">v1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
