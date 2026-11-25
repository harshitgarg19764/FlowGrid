import { BOOKING_STATUS, BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '../constants/bookingStatuses';

/**
 * Get display label for booking status
 */
export const getBookingStatusLabel = (status) => {
  return BOOKING_STATUS_LABELS[status] || status;
};

/**
 * Get badge color class for booking status
 */
export const getBookingStatusColor = (status) => {
  return BOOKING_STATUS_COLORS[status] || 'secondary';
};

/**
 * Check if booking can be cancelled
 */
export const canCancelBooking = (status) => {
  return [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.APPROVED,
    BOOKING_STATUS.CONFIRMED,
  ].includes(status);
};

/**
 * Check if booking requires approval
 */
export const requiresApproval = (status) => {
  return status === BOOKING_STATUS.PENDING;
};

/**
 * Check if booking is active
 */
export const isActiveBooking = (status) => {
  return [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.APPROVED,
    BOOKING_STATUS.CONFIRMED,
  ].includes(status);
};

/**
 * Check if booking is completed or terminated
 */
export const isTerminalBooking = (status) => {
  return [
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.DECLINED,
    BOOKING_STATUS.EXPIRED,
  ].includes(status);
};
