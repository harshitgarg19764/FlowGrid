// Public routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_ORGANISATION: '/register-organisation',
  
  // Customer routes
  APP_RESOURCES: '/app/resources',
  APP_RESOURCE_DETAILS: '/app/resources/:resourceId',
  APP_BOOKING_NEW: '/app/bookings/new/:resourceId',
  APP_BOOKINGS: '/app/bookings',
  APP_BOOKING_DETAILS: '/app/bookings/:bookingId',
  APP_WAITLISTS: '/app/waitlists',
  APP_NOTIFICATIONS: '/app/notifications',
  APP_PAYMENTS: '/app/payments',
  
  // Organisation routes
  ORG_DASHBOARD: '/org/dashboard',
  ORG_RESOURCES: '/org/resources',
  ORG_RESOURCES_NEW: '/org/resources/new',
  ORG_RESOURCE_EDIT: '/org/resources/:resourceId/edit',
  ORG_APPROVALS: '/org/approvals',
  ORG_BOOKINGS: '/org/bookings',
  ORG_MEMBERS: '/org/members',
  ORG_SETTINGS: '/org/settings',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORGANISATIONS: '/admin/organisations',
  ADMIN_USERS: '/admin/users',
};

// Helper functions to build dynamic routes
export const buildRoute = {
  resourceDetails: (resourceId) => `/app/resources/${resourceId}`,
  bookingNew: (resourceId) => `/app/bookings/new/${resourceId}`,
  bookingDetails: (bookingId) => `/app/bookings/${bookingId}`,
  orgResourceEdit: (resourceId) => `/org/resources/${resourceId}/edit`,
};
