// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import Loader from '../components/ui/Loader';

/**
 * Protected Route Component
 * Requires authentication to access
 * Redirects to login if not authenticated
 * 
 * NOTE: This is a UX improvement, not a security boundary
 * The backend must independently authorize every protected operation
 */
const ProtectedRoute = ({ children }) => {
  // Authentication check temporarily commented out so pages can be visited without login:
  return children;

  /*
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
  */
};

export default ProtectedRoute;
