/**
 * Booking status enum constants.
 * Used to identify the current state of a booking.
 */
export const BOOKING_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
};

/**
 * Human-readable labels for booking statuses.
 */
export const BOOKING_STATUS_LABELS = {
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED: 'Approved',
  DECLINED: 'Declined',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
};

/**
 * Payment status enum constants.
 */
export const PAYMENT_STATUS = {
  NONE: 'NONE',
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  AUTHORIZED: 'AUTHORIZED',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  REFUND_PENDING: 'REFUND_PENDING',
  VOIDED: 'VOIDED',
};

/**
 * Human-readable labels for payment statuses.
 */
export const PAYMENT_STATUS_LABELS = {
  NONE: 'No Payment Required',
  AWAITING_PAYMENT: 'Awaiting Payment',
  AUTHORIZED: 'Payment Authorized',
  PAID: 'Paid',
  FAILED: 'Payment Failed',
  REFUNDED: 'Refunded',
  REFUND_PENDING: 'Refund Pending',
  VOIDED: 'Voided',
};

/**
 * Resource status enum constants.
 */
export const RESOURCE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFT: 'DRAFT',
};

/**
 * User role enum constants for role-based access control.
 */
export const USER_ROLES = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  ORG_OWNER: 'ORG_OWNER',
  ORG_ADMIN: 'ORG_ADMIN',
  ORG_STAFF: 'ORG_STAFF',
  ORG_MEMBER: 'ORG_MEMBER',
  CUSTOMER: 'CUSTOMER',
};

/**
 * Resource access level constants.
 */
export const RESOURCE_ACCESS = {
  PUBLIC: 'PUBLIC',
  MEMBERS_ONLY: 'MEMBERS_ONLY',
  RESTRICTED: 'RESTRICTED',
};
