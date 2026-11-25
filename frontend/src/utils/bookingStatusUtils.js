import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/bookingStatuses';

/**
 * Returns the CSS variable name corresponding to the booking status color.
 *
 * @param {string} status - A BOOKING_STATUS value
 * @returns {string} CSS variable name (e.g., 'var(--color-success)')
 */
export const getStatusColor = (status) => {
  const colorMap = {
    [BOOKING_STATUS.CONFIRMED]: 'var(--color-success)',
    [BOOKING_STATUS.COMPLETED]: 'var(--color-success)',
    [BOOKING_STATUS.APPROVED]: 'var(--color-info)',
    [BOOKING_STATUS.PENDING_APPROVAL]: 'var(--color-warning)',
    [BOOKING_STATUS.DECLINED]: 'var(--color-danger)',
    [BOOKING_STATUS.CANCELLED]: 'var(--color-danger)',
    [BOOKING_STATUS.EXPIRED]: 'var(--color-gray-500)',
    [BOOKING_STATUS.NO_SHOW]: 'var(--color-danger)',
  };

  return colorMap[status] || 'var(--color-gray-500)';
};

/**
 * Returns a semantic variant string for the booking status.
 * Useful for mapping to badge/tag component variants.
 *
 * @param {string} status - A BOOKING_STATUS value
 * @returns {'success'|'warning'|'danger'|'info'|'default'} Variant string
 */
export const getStatusVariant = (status) => {
  const variantMap = {
    [BOOKING_STATUS.CONFIRMED]: 'success',
    [BOOKING_STATUS.COMPLETED]: 'success',
    [BOOKING_STATUS.APPROVED]: 'info',
    [BOOKING_STATUS.PENDING_APPROVAL]: 'warning',
    [BOOKING_STATUS.DECLINED]: 'danger',
    [BOOKING_STATUS.CANCELLED]: 'danger',
    [BOOKING_STATUS.EXPIRED]: 'default',
    [BOOKING_STATUS.NO_SHOW]: 'danger',
  };

  return variantMap[status] || 'default';
};

/**
 * Returns a semantic variant string for the payment status.
 *
 * @param {string} status - A PAYMENT_STATUS value
 * @returns {'success'|'warning'|'danger'|'info'|'default'} Variant string
 */
export const getPaymentStatusVariant = (status) => {
  const variantMap = {
    [PAYMENT_STATUS.PAID]: 'success',
    [PAYMENT_STATUS.AUTHORIZED]: 'success',
    [PAYMENT_STATUS.AWAITING_PAYMENT]: 'warning',
    [PAYMENT_STATUS.REFUND_PENDING]: 'warning',
    [PAYMENT_STATUS.FAILED]: 'danger',
    [PAYMENT_STATUS.REFUNDED]: 'info',
    [PAYMENT_STATUS.VOIDED]: 'default',
    [PAYMENT_STATUS.NONE]: 'default',
  };

  return variantMap[status] || 'default';
};

/**
 * Checks whether a booking is eligible for cancellation based on its current status.
 * Only bookings that are pending, approved, or confirmed can be cancelled.
 *
 * @param {Object} booking - The booking object
 * @param {string} booking.status - The booking's current status
 * @returns {boolean} True if the booking can be cancelled
 */
export const canCancelBooking = (booking) => {
  if (!booking || !booking.status) return false;

  const cancellableStatuses = [
    BOOKING_STATUS.PENDING_APPROVAL,
    BOOKING_STATUS.APPROVED,
    BOOKING_STATUS.CONFIRMED,
  ];

  return cancellableStatuses.includes(booking.status);
};

/**
 * Checks whether any user actions are available for the booking.
 * A booking is actionable if it can be cancelled or has pending payment.
 *
 * @param {Object} booking - The booking object
 * @param {string} booking.status - The booking's current status
 * @param {string} [booking.paymentStatus] - The booking's payment status
 * @returns {boolean} True if any actions are available
 */
export const isBookingActionable = (booking) => {
  if (!booking) return false;

  if (canCancelBooking(booking)) return true;

  if (booking.paymentStatus === PAYMENT_STATUS.AWAITING_PAYMENT) return true;

  return false;
};
