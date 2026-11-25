import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import Brand from '../ui/Brand';
import Icon from '../ui/Icon';
import ThemeToggle from '../ui/ThemeToggle';
import './OrganisationLayout.css';

const orgNavItems = [
  { to: ROUTES.ORG_DASHBOARD, label: 'Dashboard', icon: 'chart' },
  { to: ROUTES.ORG_RESOURCES, label: 'Resources', icon: 'box' },
  { to: ROUTES.ORG_APPROVALS, label: 'Approval queue', icon: 'list' },
];

const roleLabel = (role) =>
  (role || 'Member')
    .replace(/^ORG_/, '')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());

/**
 * Organisation Layout
 * Operator console for organisation owners, admins and staff.
 */
const OrganisationLayout = () => {
  const {
    user,
    activeOrganisation,
    switchActiveOrganisation,
    getUserOrganisations,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const organisations = getUserOrganisations();
  const orgName =
    activeOrganisation?.organisationName ||
    activeOrganisation?.name ||
    'Organisation workspace';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleOrgChange = (e) => {
    switchActiveOrganisation(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="org-layout">
      <a className="skip-link" href="#org-main">
        Skip to content
      </a>

      <aside id="org-sidebar" className={`org-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <div className="org-sidebar-head">
          <Brand light />
          <button
            type="button"
            className="org-sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="org-switcher">
          <span className="org-switcher-label mono">Active workspace</span>
          {organisations.length > 0 ? (
            <div className="org-select-wrap">
              <Icon name="building" size={15} />
              <select
                id="org-select"
                className="org-select"
                aria-label="Active organisation"
                value={activeOrganisation?.organisationId || ''}
                onChange={handleOrgChange}
              >
                {organisations.map((org) => (
                  <option key={org.organisationId} value={org.organisationId}>
                    {org.organisationName || org.name || `Org: ${org.organisationId}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <Link to={ROUTES.REGISTER_ORGANISATION} className="btn btn-inverse btn-sm btn-block">
              Register organisation
            </Link>
          )}
          <span className="org-switcher-role">
            <span className="status-dot" aria-hidden="true" />
            {roleLabel(activeOrganisation?.role)} access
          </span>
        </div>

        <nav className="org-nav" aria-label="Organisation workspace">
          <span className="org-nav-label mono">Console</span>
          {orgNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `org-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="org-sidebar-foot">
          <Link to={ROUTES.APP_RESOURCES} className="org-context-link">
            <Icon name="arrowLeft" size={15} />
            Customer catalogue
          </Link>

          <div className="org-user">
            <span className="org-user-avatar" aria-hidden="true">
              {(user?.firstName || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
            <span className="org-user-copy">
              <span className="org-user-label mono">Signed in</span>
              <span className="org-user-email" title={user?.email}>
                {user?.email || 'Operator account'}
              </span>
            </span>
          </div>

          <button type="button" className="org-logout" onClick={handleLogout}>
            <Icon name="logout" size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="org-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="org-main-content">
        <header className="org-topbar">
          <div className="org-topbar-left">
            <button
              type="button"
              className="org-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="org-sidebar"
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'x' : 'menu'} size={20} />
            </button>
            <div className="org-topbar-copy">
              <span className="org-topbar-kicker mono">Operator console</span>
              <p className="org-topbar-title">{orgName}</p>
            </div>
          </div>

          <div className="org-topbar-actions">
            <ThemeToggle />
            <span className="org-role-badge">
              <span className="status-dot" aria-hidden="true" />
              {roleLabel(activeOrganisation?.role)}
            </span>
            <Link to={ROUTES.ORG_RESOURCES_NEW} className="btn btn-primary btn-sm">
              <Icon name="plus" size={15} />
              New resource
            </Link>
          </div>
        </header>

        <main id="org-main" className="org-page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganisationLayout;
