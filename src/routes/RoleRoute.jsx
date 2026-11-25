// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import Loader from '../components/ui/Loader';

/**
 * Role-Based Route Component
 * Requires specific role(s) to access
 * Redirects to home if user doesn't have required role
 * 
 * NOTE: This is a UX improvement, not a security boundary
 * The backend must independently authorize every protected operation
 * 
 * @param {string|string[]} roles - Required role(s)
 * @param {string} organisationId - Required for organisation-specific roles
 */
const RoleRoute = ({ children }) => {
  // Role checks temporarily commented out so pages can be visited without login:
  return children;

  /*
  const { user, isAuthenticated, isLoading, activeOrganisation, hasRole, hasOrganisationRole } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize roles to array
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  // Check if user has any of the required roles
  let hasAccess = false;

  const targetOrgId = organisationId || activeOrganisation?.organisationId;

  if (targetOrgId) {
    // Check specific organisation role
    hasAccess = requiredRoles.some((role) => hasOrganisationRole(targetOrgId, role));
  }
  
  if (!hasAccess) {
    // Check platform-level roles
    hasAccess = requiredRoles.some((role) => hasRole(role));
  }

  if (!hasAccess && user?.organisationMemberships?.length > 0) {
    // Check if user has required role in ANY organisation
    hasAccess = user.organisationMemberships.some((m) => requiredRoles.includes(m.role));
  }

  if (!hasAccess) {
    // User doesn't have required role - redirect to appropriate page
    return <Navigate to="/app/resources" replace />;
  }

  return children;
  */
};

export default RoleRoute;
