import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import bookingService from '../bookingService';
import BookingStatus from '../components/BookingStatus';
import Loader from '../../../components/ui/Loader';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import { ROUTES } from '../../../constants/routes';
import { formatDateTime, formatDuration } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

/**
 * BookingDetailsPage
 * The complete record for one reservation: lifecycle, window, cost and
 * the organisation's decision.
 */
const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const bannerMessage = location.state?.message;

  const fetchBooking = useCallback(async () => {
    try {
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, fetchBooking]);

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      await bookingService.cancelBooking(bookingId, cancelReason);
      setCancelModalOpen(false);
      await fetchBooking();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="page page--mid">
        <div className="loading-block">
          <Loader size="large" text="Loading booking record" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="page page--narrow">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={ROUTES.APP_BOOKINGS}>
            <Icon name="arrowLeft" size={14} />
            Bookings
          </Link>
        </nav>

        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Record not found</strong>
            {error || 'This booking request could not be loaded.'}
          </div>
        </div>

        <div className="form-actions form-actions--start">
          <Link to={ROUTES.APP_BOOKINGS} className="btn btn-outline">
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const canCancel =
    booking.status === 'PENDING' || booking.status === 'APPROVED' || booking.status === 'CONFIRMED';
  const shortId = booking.id?.substring(0, 8) || booking.id;

  return (
    <div className="page page--mid">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.APP_BOOKINGS}>
          <Icon name="arrowLeft" size={14} />
          Bookings
        </Link>
        <span aria-hidden="true">/</span>
        <span>#{shortId}</span>
      </nav>

      <header className="page-head">
        <div>
          <h1>
            Booking <span className="page-head-ref mono">#{shortId}</span>
          </h1>
          <p className="page-lede">
            {booking.resourceName || `Resource ${booking.resourceId}`} · requested{' '}
            {booking.createdAt ? formatDateTime(booking.createdAt) : 'recently'}
          </p>
        </div>

        {canCancel && (
          <div className="page-actions">
            <Button variant="ghost-danger" onClick={() => setCancelModalOpen(true)}>
              Cancel reservation
            </Button>
          </div>
        )}
      </header>

      {bannerMessage && (
        <div className="notice notice--success" role="status">
          <Icon name="circleCheck" size={18} />
          <div>{bannerMessage}</div>
        </div>
      )}

      {error && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>{error}</div>
        </div>
      )}

      <BookingStatus
        status={booking.status}
        paymentStatus={booking.paymentStatus}
        decisionDeadline={booking.decisionDeadline}
      />

      <section className="breakdown" aria-labelledby="breakdown-heading">
        <div className="breakdown-head">
          <h2 id="breakdown-heading">Reservation breakdown</h2>
          <span className="mono breakdown-ref">ref / {shortId}</span>
        </div>

        <dl className="breakdown-grid">
          <div>
            <dt className="meta-label">Resource</dt>
            <dd className="meta-value meta-value--text">
              {booking.resourceName || `Resource ${booking.resourceId}`}
            </dd>
          </div>
          <div>
            <dt className="meta-label">Organisation</dt>
            <dd className="meta-value meta-value--text">
              {booking.organisationName || 'Affiliated organisation'}
            </dd>
          </div>
          <div>
            <dt className="meta-label">Duration</dt>
            <dd className="meta-value">{formatDuration(booking.startTime, booking.endTime)}</dd>
          </div>
          <div>
            <dt className="meta-label">Starts</dt>
            <dd className="meta-value">{formatDateTime(booking.startTime)}</dd>
          </div>
          <div>
            <dt className="meta-label">Ends</dt>
            <dd className="meta-value">{formatDateTime(booking.endTime)}</dd>
          </div>
          <div>
            <dt className="meta-label">Total amount</dt>
            <dd className="meta-value meta-value--total">
              {booking.totalAmount ? formatCurrency(booking.totalAmount, booking.currency || 'USD') : 'No charge'}
            </dd>
          </div>
        </dl>

        {booking.purpose && (
          <div className="breakdown-note">
            <span className="meta-label">Purpose / notes</span>
            <p>{booking.purpose}</p>
          </div>
        )}

        {booking.declineReason && (
          <div className="notice notice--danger breakdown-alert" role="alert">
            <Icon name="x" size={18} />
            <div>
              <strong className="notice-title">Declined by the organisation</strong>
              {booking.declineReason}
            </div>
          </div>
        )}
      </section>

      <div className="notice">
        <Icon name="info" size={18} />
        <div>
          <strong className="notice-title">Keep this reference</strong>
          Quote <span className="mono">#{shortId}</span> when contacting the organisation about this reservation.
        </div>
      </div>

      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel this reservation"
        size="small"
      >
        <p>The hold or reserved window will be released immediately. This cannot be undone.</p>

        <div className="form-group">
          <label htmlFor="reason" className="form-label">
            Reason (optional)
          </label>
          <textarea
            id="reason"
            className="form-textarea"
            rows={2}
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            disabled={cancelling}
          />
        </div>

        <div className="modal-actions">
          <Button variant="outline" onClick={() => setCancelModalOpen(false)} disabled={cancelling}>
            Keep reservation
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel} loading={cancelling} disabled={cancelling}>
            Cancel reservation
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetailsPage;
