import { Link } from 'react-router-dom';
import { buildRoute } from '../../../constants/routes';
import StatusBadge from '../../../components/ui/StatusBadge';
import Icon from '../../../components/ui/Icon';
import { formatDateTime } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

/**
 * BookingCard
 * A single reservation record in the customer's booking ledger.
 */
const BookingCard = ({ booking, onCancel }) => {
  const canCancel =
    booking.status === 'PENDING' || booking.status === 'CONFIRMED' || booking.status === 'APPROVED';

  const requestedOn = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <article className="booking-row" data-status={booking.status}>
      <div className="booking-row-head">
        <div>
          <h3>
            <Link to={buildRoute.bookingDetails(booking.id)}>
              {booking.resourceName || `Resource ${booking.resourceId}`}
            </Link>
          </h3>
          <span className="booking-org">
            <Icon name="building" size={13} />
            {booking.organisationName || 'Affiliated organisation'}
          </span>
        </div>

        <StatusBadge status={booking.status || 'PENDING'} />
      </div>

      <dl className="booking-row-meta">
        <div>
          <dt className="meta-label">Starts</dt>
          <dd className="meta-value">{formatDateTime(booking.startTime)}</dd>
        </div>
        <div>
          <dt className="meta-label">Ends</dt>
          <dd className="meta-value">{formatDateTime(booking.endTime)}</dd>
        </div>
        <div>
          <dt className="meta-label">Amount</dt>
          <dd className="meta-value meta-value--strong">
            {booking.totalAmount ? formatCurrency(booking.totalAmount, booking.currency || 'USD') : 'No charge'}
          </dd>
        </div>
      </dl>

      <div className="booking-row-foot">
        <span className="booking-ref mono">Requested {requestedOn}</span>

        <div className="booking-row-actions">
          <Link to={buildRoute.bookingDetails(booking.id)} className="btn btn-outline btn-sm">
            View record
          </Link>

          {canCancel && onCancel && (
            <button
              type="button"
              className="btn btn-ghost-danger btn-sm"
              onClick={() => onCancel(booking.id)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookingCard;
