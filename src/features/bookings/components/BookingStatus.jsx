import StatusBadge from '../../../components/ui/StatusBadge';
import Icon from '../../../components/ui/Icon';
import { BOOKING_STATUS } from '../../../constants/bookingStatuses';
import { formatDateTime } from '../../../utils/dateUtils';

const STATUS_META = {
  [BOOKING_STATUS.PENDING]: {
    icon: 'clock',
    title: 'Awaiting review',
    copy: 'The request is in the organisation queue. The window stays held while a decision is pending.',
  },
  [BOOKING_STATUS.APPROVED]: {
    icon: 'shield',
    title: 'Approved',
    copy: 'The organisation accepted the request. Final confirmation or payment processing follows.',
  },
  [BOOKING_STATUS.CONFIRMED]: {
    icon: 'circleCheck',
    title: 'Confirmed',
    copy: 'The reservation is locked in. Arrive at the scheduled window and the resource is yours.',
  },
  [BOOKING_STATUS.DECLINED]: {
    icon: 'x',
    title: 'Declined',
    copy: 'The organisation declined this request. Any temporary hold on the slot has been released.',
  },
  [BOOKING_STATUS.CANCELLED]: {
    icon: 'x',
    title: 'Cancelled',
    copy: 'This reservation was cancelled and the slot returned to the grid.',
  },
  [BOOKING_STATUS.EXPIRED]: {
    icon: 'alert',
    title: 'Hold expired',
    copy: 'The decision window closed before the organisation responded, so the held slot was released.',
  },
  [BOOKING_STATUS.COMPLETED]: {
    icon: 'check',
    title: 'Completed',
    copy: 'This reservation has run its course and is kept here as part of the record.',
  },
};

/**
 * BookingStatus
 * Explains the current lifecycle phase in plain language.
 */
const BookingStatus = ({ status, paymentStatus, decisionDeadline }) => {
  const meta = STATUS_META[status] || {
    icon: 'info',
    title: 'Status update',
    copy: `Current state: ${status}.`,
  };

  return (
    <section className="status-panel" data-status={status} aria-label="Booking status">
      <div className="status-panel-top">
        <div className="status-panel-name">
          <Icon name={meta.icon} size={17} />
          {meta.title}
          <StatusBadge status={status || 'PENDING'} />
        </div>

        {paymentStatus && <StatusBadge status={paymentStatus} type="payment" />}
      </div>

      <p>{meta.copy}</p>

      {decisionDeadline && status === BOOKING_STATUS.PENDING && (
        <span className="status-deadline">
          <Icon name="clock" size={13} />
          Decision due {formatDateTime(decisionDeadline)}
        </span>
      )}
    </section>
  );
};

export default BookingStatus;
