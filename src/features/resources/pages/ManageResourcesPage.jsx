import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES, buildRoute } from '../../../constants/routes';
import resourceService from '../resourceService';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import StatusBadge from '../../../components/ui/StatusBadge';
import Icon from '../../../components/ui/Icon';
import { formatCurrency } from '../../../utils/currencyUtils';
import { getResourceTypeIcon, getResourceTypeLabel } from '../../../utils/resourceUtils';

/**
 * ManageResourcesPage
 * The organisation's resource ledger: publish, edit and retire records.
 */
const ManageResourcesPage = () => {
  const { activeOrganisation } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orgId = activeOrganisation?.organisationId;

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      if (!orgId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const data = await resourceService.getOrganisationResources(orgId);
        if (isMounted) setResources(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to fetch organisation resources.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, [orgId]);

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Remove this resource? Active bookings may be affected.')) {
      return;
    }

    try {
      await resourceService.deleteResource(orgId, resourceId);
      setResources((prev) => prev.filter((resource) => resource.id !== resourceId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete resource.');
    }
  };

  if (!orgId) {
    return (
      <div className="workspace">
        <EmptyState
          icon="building"
          title="No active organisation"
          description="Select or register an organisation to manage its bookable resources."
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
          <h1>Resources</h1>
          <p>Configure rooms, equipment, parking bays and lab benches that can be requested.</p>
        </div>

        <div className="workspace-actions">
          <span className="workspace-meta mono">
            {loading ? '—' : String(resources.length).padStart(2, '0')} records
          </span>
          <Link to={ROUTES.ORG_RESOURCES_NEW} className="btn btn-primary">
            <Icon name="plus" size={16} />
            New resource
          </Link>
        </div>
      </header>

      {error && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Could not load resources</strong>
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-block">
          <Loader size="large" text="Loading resource ledger" />
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          icon="box"
          title="No resources published yet"
          description="Publish the first resource so customers and members can discover it and request a slot."
          action={
            <Link to={ROUTES.ORG_RESOURCES_NEW} className="btn btn-primary">
              Publish a resource
            </Link>
          }
        />
      ) : (
        <div className="panel panel--flush">
          <div className="table-responsive">
            <table className="table table--ledger">
              <thead>
                <tr>
                  <th scope="col">Resource</th>
                  <th scope="col">Location</th>
                  <th scope="col">Capacity</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="cell-actions">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td>
                      <div className="table-resource">
                        <span className="table-resource-icon" aria-hidden="true">
                          <Icon name={getResourceTypeIcon(resource.type)} size={16} />
                        </span>
                        <span className="table-resource-copy">
                          <Link to={buildRoute.resourceDetails(resource.id)} className="table-resource-name">
                            {resource.name}
                          </Link>
                          <span className="table-resource-meta">
                            {getResourceTypeLabel(resource.type)}
                            {resource.slotDurationMinutes ? ` · ${resource.slotDurationMinutes} min slots` : ''}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td>{resource.location || '—'}</td>
                    <td className="mono">{resource.capacity || 1}</td>
                    <td className="mono">
                      {resource.isPaid
                        ? `${formatCurrency(resource.hourlyRate, resource.currency || 'USD')}/hr`
                        : 'No charge'}
                    </td>
                    <td>
                      <StatusBadge status={resource.status || 'AVAILABLE'} type="resource" />
                    </td>
                    <td className="cell-actions">
                      <div className="table-actions">
                        <Link to={buildRoute.orgResourceEdit(resource.id)} className="btn btn-outline btn-sm">
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-ghost-danger btn-sm"
                          onClick={() => handleDelete(resource.id)}
                        >
                          Remove
                        </button>
                      </div>
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

export default ManageResourcesPage;
