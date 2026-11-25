import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import bookingService from '../bookingService';
import ApprovalActions from '../components/ApprovalActions';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import Icon from '../../../components/ui/Icon';
import { formatDateTime, formatDuration } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

/**
 * ApprovalQueuePage
 * The manual verification queue for held requests.
 */
const ApprovalQueuePage = () => {
  const { activeOrganisation } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const orgId = activeOrganisation?.organisationId;

  const fetchPending = useCallback(async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    try {
      const data = await bookingService.getPendingApprovals(orgId);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending approval requests.');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (bookingId) => {
    setError('');
    try {
      await bookingService.approveBooking(orgId, bookingId);
      setFeedback('Request approved. The customer has been notified.');
      setRequests((prev) => prev.filter((request) => request.id !== bookingId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve. The slot may have expired or conflicted.');
      fetchPending();
    }
  };

  const handleDecline = async (bookingId, reason) => {
    setError('');
    try {
      await bookingService.declineBooking(orgId, bookingId, reason);
      setFeedback('Request declined. The held window has been released.');
      setRequests((prev) => prev.filter((request) => request.id !== bookingId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline the request.');
      fetchPending();
    }
  };

  if (!orgId) {
    return (
      <div className="workspace">
        <EmptyState
          icon="building"
          title="No organisation selected"
          description="Select an active organisation to review its approval queue."
          action={
            <Link to={ROUTES.REGISTER_ORGANISATION} className="btn btn-primary">
              Register organisation
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="workspace">
      <header className="workspace-head">
        <div>
          <h1>Approval queue</h1>
          <p>Requests holding a window while they wait for an operator decision.</p>
        </div>

        <div className="workspace-actions">
          <span className="workspace-meta mono">
            {loading ? '—' : String(requests.length).padStart(2, '0')} pending
          </span>
          <button type="button" className="btn btn-outline" onClick={fetchPending} disabled={loading}>
            <Icon name="refresh" size={15} />
            Refresh
          </button>
        </div>
      </header>

      {feedback && (
        <div className="notice notice--success" role="status">
          <Icon name="circleCheck" size={18} />
          <div>{feedback}</div>
        </div>
      )}

      {error && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Queue update failed</strong>
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-block">
          <Loader size="large" text="Loading approval queue" />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon="circleCheck"
          title="Queue is clear"
          description="No requests are waiting for a decision. New holds will appear here automatically."
        />
      ) : (
        <div className="panel panel--flush">
          <div className="table-responsive">
            <table className="table table--ledger table--queue">
              <thead>
                <tr>
                  <th scope="col">Request</th>
                  <th scope="col">Window</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Hold until</th>
                  <th scope="col" className="cell-actions">
                    Decision
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="queue-request">
                        <strong>{request.resourceName || request.resourceId}</strong>
                        <span className="queue-customer">
                          <Icon name="user" size={12} />
                          {request.customerName || request.customerEmail || 'Customer'}
                        </span>
                        {request.purpose && (
                          <span className="queue-note">&ldquo;{request.purpose}&rdquo;</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="queue-window">
                        <span className="meta-value">{formatDateTime(request.startTime)}</span>
                        <span className="queue-window-end">to {formatDateTime(request.endTime)}</span>
                      </div>
                    </td>
                    <td className="mono">{formatDuration(request.startTime, request.endTime)}</td>
                    <td className="mono">
                      {request.totalAmount
                        ? formatCurrency(request.totalAmount, request.currency || 'USD')
                        : 'No charge'}
                    </td>
                    <td>
                      {request.decisionDeadline ? (
                        <span className="queue-deadline">
                          <Icon name="clock" size={12} />
                          {formatDateTime(request.decisionDeadline)}
                        </span>
                      ) : (
                        <span className="text-muted text-sm">Standard</span>
                      )}
                    </td>
                    <td className="cell-actions">
                      <ApprovalActions
                        booking={request}
                        onApprove={handleApprove}
                        onDecline={handleDecline}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueuePage;
