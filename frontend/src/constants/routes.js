/**
 * Application route path constants.
 * Centralized route definitions for consistent navigation throughout the app.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  REGISTER_ORGANISATION: '/register-organisation',

  APP: {
    RESOURCES: '/app/resources',
    RESOURCE_DETAILS: '/app/resources/:resourceId',
    BOOKINGS: '/app/bookings',
    BOOKING_DETAILS: '/app/bookings/:bookingId',
    NEW_BOOKING: '/app/bookings/new/:resourceId',
    WAITLISTS: '/app/waitlists',
    NOTIFICATIONS: '/app/notifications',
    PAYMENTS: '/app/payments',
  },

  ORG: {
    DASHBOARD: '/org/dashboard',
    RESOURCES: '/org/resources',
    NEW_RESOURCE: '/org/resources/new',
    EDIT_RESOURCE: '/org/resources/:resourceId/edit',
    APPROVALS: '/org/approvals',
    BOOKINGS: '/org/bookings',
    MEMBERS: '/org/members',
    SETTINGS: '/org/settings',
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    ORGANISATIONS: '/admin/organisations',
    USERS: '/admin/users',
  },
};
