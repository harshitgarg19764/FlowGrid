import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { USER_ROLES } from '../constants/bookingStatuses';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import CustomerLayout from '../components/layout/CustomerLayout';
import OrganisationLayout from '../components/layout/OrganisationLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Public Pages
import HomePage from '../features/auth/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import RegisterOrganisationPage from '../features/organisations/pages/RegisterOrganisationPage';

// Customer Pages
import ResourceSearchPage from '../features/resources/pages/ResourceSearchPage';
import ResourceDetailsPage from '../features/resources/pages/ResourceDetailsPage';
import BookingRequestPage from '../features/bookings/pages/BookingRequestPage';
import MyBookingsPage from '../features/bookings/pages/MyBookingsPage';
import BookingDetailsPage from '../features/bookings/pages/BookingDetailsPage';

// Organisation Pages
import OrganisationDashboardPage from '../features/organisations/pages/OrganisationDashboardPage';
import ManageResourcesPage from '../features/resources/pages/ManageResourcesPage';
import ResourceFormPage from '../features/resources/pages/ResourceFormPage';
import ApprovalQueuePage from '../features/bookings/pages/ApprovalQueuePage';

/**
 * Main Application Routing
 * 
 * Route organization:
 * - Public routes (/, /login, /register, /register-organisation)
 * - Customer routes (/app/*)
 * - Organisation routes (/org/*)
 * - Admin routes (/admin/*)
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.REGISTER_ORGANISATION} element={<RegisterOrganisationPage />} />
      </Route>

      {/* Customer Routes - Require Authentication */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.APP_RESOURCES} replace />} />
        <Route path="resources" element={<ResourceSearchPage />} />
        <Route path="resources/:resourceId" element={<ResourceDetailsPage />} />
        <Route path="bookings/new/:resourceId" element={<BookingRequestPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="bookings/:bookingId" element={<BookingDetailsPage />} />
      </Route>

      {/* Organisation Routes - Require Organisation Role */}
      <Route
        path="/org"
        element={
          <ProtectedRoute>
            <RoleRoute roles={[USER_ROLES.ORG_OWNER, USER_ROLES.ORG_ADMIN, USER_ROLES.ORG_STAFF]}>
              <OrganisationLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.ORG_DASHBOARD} replace />} />
        <Route path="dashboard" element={<OrganisationDashboardPage />} />
        <Route path="resources" element={<ManageResourcesPage />} />
        <Route path="resources/new" element={<ResourceFormPage />} />
        <Route path="resources/:resourceId/edit" element={<ResourceFormPage />} />
        <Route path="approvals" element={<ApprovalQueuePage />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

export default AppRoutes;
