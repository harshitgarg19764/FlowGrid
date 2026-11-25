import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import bookingService from '../../bookings/bookingService';
import resourceService from '../../resources/resourceService';
import OrganisationStats from '../components/OrganisationStats';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/ui/StatusBadge';
import Icon from '../../../components/ui/Icon';
import { formatDateTime } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

/**
 * OrganisationDashboardPage
 * The operator's morning read: capacity, queue pressure and the next
 * requests that need a decision.
 */
const OrganisationDashboardPage = () => {
  const { activeOrganisation } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResources: 0,
    availableResources: 0,
    pendingApprovals: 0,
    upcomingBookings: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState('');

  const orgId = activeOrganisation?.organisationId;

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      if (!orgId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [resourcesRes, pendingRes, bookingsRes] = await Promise.allSettled([
          resourceService.getOrganisationResources(orgId),
          bookingService.getPendingApprovals(orgId),
          bookingService.getOrganisationBookings(orgId),
        ]);

        if (!isMounted) return;

        const resources = resourcesRes.status === 'fulfilled' ? resourcesRes.value : [];
        const pending = pendingRes.status === 'fulfilled' ? pendingRes.value : [];
        const orgBookings = bookingsRes.status === 'fulfilled' ? bookingsRes.value : [];

        const now = new Date();
        const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcoming = (Array.isArray(orgBookings) ? orgBookings : []).filter((booking) => {
          if (booking.status !== 'CONFIRMED' && booking.status !== 'APPROVED') return false;
          const startsAt = new Date(booking.startTime);
          return startsAt >= now && startsAt <= weekAhead;
        }).length;

        setPendingRequests(Array.isArray(pending) ? pending.slice(0, 5) : []);
        setStats({
          totalResources: Array.isArray(resources) ? resources.length : 0,
          availableResources: Array.isArray(resources)
            ? resources.filter((resource) => resource.status === 'AVAILABLE').length
            : 0,
          pendingApprovals: Array.isArray(pending) ? pending.length : 0,
          upcomingBookings: upcoming,
        });
      } catch {
        if (isMounted) {
          setError('Unable to load some dashboard data. Showing the records that responded.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [orgId]);

  if (!orgId) {
    return (
      <div className="workspace">
        <EmptyState
          icon="building"
          title="No active organisation"
          description="Select an organisation from the sidebar or register one to start operating."
          action={
            <Link to={ROUTES.REGISTER_ORGANISATION} className="btn btn-primary">
              Register organisation
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="workspace">
        <div className="loading-block">
          <Loader size="large" text="Loading workspace" />
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <header className="workspace-head">
        <div>
          <h1>Overview</h1>
          <p>Live resource capacity and the approval queue, in one operating view.</p>
        </div>

        <div className="workspace-actions">
          <Link to={ROUTES.ORG_APPROVALS} className="btn btn-outline">
            <Icon name="list" size={15} />
            Approval queue
          </Link>
          <Link to={ROUTES.ORG_RESOURCES_NEW} className="btn btn-primary">
            <Icon name="plus" size={16} />
            New resource
          </Link>
        </div>
      </header>

      {error && (
        <div className="notice notice--warning" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Partial data</strong>
            {error}
          </div>
        </div>
      )}

      <OrganisationStats stats={stats} />

      <section className="panel panel--flush" aria-labelledby="pending-heading">
        <div className="panel-head">
          <div>
            <h2 id="pending-heading">Requests waiting on you</h2>
            <span className="panel-note">Held windows are released when the deadline passes.</span>
          </div>
          <Link to={ROUTES.ORG_APPROVALS} className="btn btn-outline btn-sm">
            Open queue ({stats.pendingApprovals})
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="panel-empty">
            <EmptyState
              icon="circleCheck"
              title="Nothing waiting"
              description="The approval queue is empty. New holds will surface here first."
            />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table--ledger">
              <thead>
                <tr>
                  <th scope="col">Resource</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Window</th>
                  <th scope="col">Total</th>
                  <th scope="col">State</th>
                  <th scope="col" className="cell-actions">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>{request.resourceName || request.resourceId}</strong>
                    </td>
                    <td>{request.customerName || request.customerEmail || 'Customer'}</td>
                    <td className="mono">
                      {formatDateTime(request.startTime)}
                      <span className="table-sub">to {formatDateTime(request.endTime)}</span>
                    </td>
                    <td className="mono">
                      {formatCurrency(request.totalAmount || 0, request.currency || 'USD')}
                    </td>
                    <td>
                      <StatusBadge status={request.status || 'PENDING'} />
                    </td>
                    <td className="cell-actions">
                      <Link to={ROUTES.ORG_APPROVALS} className="btn btn-outline btn-sm">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default OrganisationDashboardPage;
