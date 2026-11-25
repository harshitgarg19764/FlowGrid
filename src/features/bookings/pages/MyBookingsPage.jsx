import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bookingService from '../bookingService';
import BookingCard from '../components/BookingCard';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import { ROUTES } from '../../../constants/routes';

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PAST', label: 'Past' },
];

/**
 * MyBookingsPage
 * Personal reservation ledger with lifecycle tabs and cancellation.
 */
const MyBookingsPage = () => {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const successMessage = location.state?.message;

  const fetchBookings = useCallback(async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your personal bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const counts = useMemo(() => {
    return {
      ALL: bookings.length,
      PENDING: bookings.filter((booking) => booking.status === 'PENDING').length,
      CONFIRMED: bookings.filter(
        (booking) => booking.status === 'CONFIRMED' || booking.status === 'APPROVED'
      ).length,
      PAST: bookings.filter(
        (booking) =>
          booking.status === 'COMPLETED' ||
          booking.status === 'CANCELLED' ||
          booking.status === 'DECLINED' ||
          booking.status === 'EXPIRED'
      ).length,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (activeTab === 'ALL') return bookings;
    if (activeTab === 'PENDING') return bookings.filter((booking) => booking.status === 'PENDING');
    if (activeTab === 'CONFIRMED') {
      return bookings.filter(
        (booking) => booking.status === 'CONFIRMED' || booking.status === 'APPROVED'
      );
    }
    if (activeTab === 'PAST') {
      return bookings.filter(
        (booking) =>
          booking.status === 'COMPLETED' ||
          booking.status === 'CANCELLED' ||
          booking.status === 'DECLINED' ||
          booking.status === 'EXPIRED'
      );
    }
    return bookings;
  }, [bookings, activeTab]);

  const handleOpenCancel = (bookingId) => {
    setBookingToCancel(bookingId);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    setCancelling(true);
    try {
      await bookingService.cancelBooking(bookingToCancel, cancelReason);
      setCancelModalOpen(false);
      setBookingToCancel(null);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="page page--mid">
      <header className="page-head">
        <div>
          <h1>Bookings</h1>
          <p className="page-lede">
            Every request you have made, from the first hold to the final decision.
          </p>
        </div>

        <div className="page-head-aside">
          <span className="page-head-figure">{loading ? '—' : bookings.length}</span>
          <span className="page-head-caption">requests on record</span>
        </div>
      </header>

      {successMessage && (
        <div className="notice notice--success" role="status">
          <Icon name="circleCheck" size={18} />
          <div>{successMessage}</div>
        </div>
      )}

      {error && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Could not refresh bookings</strong>
            {error}
          </div>
        </div>
      )}

      <div className="tabs" role="group" aria-label="Filter bookings">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            aria-pressed={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="tab-count">{counts[tab.key]}</span>
          </button>
        ))}

        <Link to={ROUTES.APP_RESOURCES} className="btn btn-outline btn-sm tab-action">
          <Icon name="search" size={14} />
          Find a resource
        </Link>
      </div>

      {loading ? (
        <div className="loading-block">
          <Loader size="large" text="Loading bookings" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          icon="calendar"
          title={activeTab === 'ALL' ? 'No bookings yet' : `No ${TABS.find((tab) => tab.key === activeTab)?.label.toLowerCase()} bookings`}
          description={
            activeTab === 'ALL'
              ? 'When you request a resource, the hold and its decision trail will appear here.'
              : 'Try another tab, or browse the catalogue to request a new window.'
          }
          action={
            <Link to={ROUTES.APP_RESOURCES} className="btn btn-outline">
              Browse catalogue
            </Link>
          }
        />
      ) : (
        <div className="booking-list">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleOpenCancel} />
          ))}
        </div>
      )}

      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel request"
        size="small"
      >
        <p>
          Cancelling releases any hold on this window. It cannot be undone, but you can submit a new request
          afterwards.
        </p>

        <div className="form-group">
          <label htmlFor="cancelReason" className="form-label">
            Reason (optional)
          </label>
          <textarea
            id="cancelReason"
            className="form-textarea"
            rows={2}
            placeholder="Let the organisation know why you are cancelling…"
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            disabled={cancelling}
          />
        </div>

        <div className="modal-actions">
          <Button variant="outline" onClick={() => setCancelModalOpen(false)} disabled={cancelling}>
            Keep booking
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel} loading={cancelling} disabled={cancelling}>
            Confirm cancellation
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;
