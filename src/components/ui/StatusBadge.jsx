import {
  getBookingStatusLabel,
  getBookingStatusColor,
} from '../../utils/bookingStatusUtils';

const RESOURCE_LABELS = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
  MAINTENANCE: 'Maintenance',
};

const RESOURCE_COLORS = {
  AVAILABLE: 'success',
  UNAVAILABLE: 'secondary',
  MAINTENANCE: 'warning',
};

const PAYMENT_LABELS = {
  PENDING: 'Payment pending',
  AUTHORIZED: 'Authorized',
  PAID: 'Paid',
  FAILED: 'Payment failed',
  REFUNDED: 'Refunded',
  REFUND_PENDING: 'Refund pending',
};

const PAYMENT_COLORS = {
  PENDING: 'warning',
  AUTHORIZED: 'info',
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'secondary',
  REFUND_PENDING: 'warning',
};

/**
 * Status badge
 * Displays booking, payment, or resource state as a compact ledger token.
 *
 * @param {string} status - Status value
 * @param {string} type - Type of status: booking, payment, resource
 * @param {string} customLabel - Override default label
 * @param {string} customColor - Override default color
 */
const StatusBadge = ({ status, type = 'booking', customLabel, customColor }) => {
  const safeStatus = status || 'PENDING';

  const resolveLabel = () => {
    if (customLabel) return customLabel;
    if (type === 'booking') return getBookingStatusLabel(safeStatus);
    if (type === 'resource') return RESOURCE_LABELS[safeStatus] || safeStatus;
    if (type === 'payment') return PAYMENT_LABELS[safeStatus] || safeStatus;
    return safeStatus;
  };

  const resolveColor = () => {
    if (customColor) return customColor;
    if (type === 'booking') return getBookingStatusColor(safeStatus);
    if (type === 'resource') return RESOURCE_COLORS[safeStatus] || 'secondary';
    if (type === 'payment') return PAYMENT_COLORS[safeStatus] || 'secondary';
    return 'secondary';
  };

  return (
    <span className={`badge badge-${resolveColor()}`}>{resolveLabel()}</span>
  );
};

export default StatusBadge;
