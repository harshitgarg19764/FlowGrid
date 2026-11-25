import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import resourceService from '../resourceService';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import Loader from '../../../components/ui/Loader';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import { ROUTES, buildRoute } from '../../../constants/routes';
import { formatCurrency } from '../../../utils/currencyUtils';
import { getResourceTypeIcon, getResourceTypeLabel } from '../../../utils/resourceUtils';
import { getResourceImage } from '../../../utils/imageAssets';

/**
 * ResourceDetailsPage
 * Full resource record, operating conditions and live slot picker.
 */
const ResourceDetailsPage = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [resData, availData] = await Promise.allSettled([
          resourceService.getResourceById(resourceId),
          resourceService.getAvailability(resourceId),
        ]);

        if (!isMounted) return;

        if (resData.status === 'fulfilled') {
          setResource(resData.value);
        } else {
          setError(resData.reason?.response?.data?.message || 'Failed to load resource details');
        }

        if (availData.status === 'fulfilled') {
          setAvailability(Array.isArray(availData.value) ? availData.value : []);
        }
      } catch {
        if (isMounted) setError('An unexpected error occurred while loading this resource.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (resourceId) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [resourceId]);

  const handleProceedToBooking = () => {
    if (!selectedSlot) return;
    navigate(buildRoute.bookingNew(resourceId), {
      state: {
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        slotLabel: selectedSlot.label,
        resource,
      },
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-block">
          <Loader size="large" text="Loading resource record" />
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="page page--narrow">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={ROUTES.APP_RESOURCES}>
            <Icon name="arrowLeft" size={14} />
            Catalogue
          </Link>
        </nav>

        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Resource unavailable</strong>
            {error || 'This resource could not be found. It may have been withdrawn.'}
          </div>
        </div>

        <div className="form-actions form-actions--start">
          <Link to={ROUTES.APP_RESOURCES} className="btn btn-outline">
            Back to catalogue
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = resource.status === 'AVAILABLE';
  const typeLabel = getResourceTypeLabel(resource.type);
  const typeIcon = getResourceTypeIcon(resource.type);
  const rate = resource.isPaid
    ? `${formatCurrency(resource.hourlyRate, resource.currency || 'USD')}/hr`
    : 'No charge';

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.APP_RESOURCES}>
          <Icon name="arrowLeft" size={14} />
          Catalogue
        </Link>
        <span aria-hidden="true">/</span>
        <span>{resource.name}</span>
      </nav>

      <header className="resource-header">
        <div className="resource-header-bg" aria-hidden="true">
          <img src={resource.imageUrl || getResourceImage(resource.type)} alt="" />
        </div>

        <div className="resource-header-top">
          <span className="resource-type">
            <Icon name={typeIcon} size={15} />
            {typeLabel}
          </span>
          <StatusBadge status={resource.status || 'AVAILABLE'} type="resource" />
        </div>

        <h1>{resource.name}</h1>

        <p className="resource-header-org">
          {resource.organisationName ? (
            <>
              <Icon name="building" size={13} />
              Managed by {resource.organisationName}
            </>
          ) : (
            'Independent resource'
          )}
        </p>

        <p className="resource-header-desc">
          {resource.description || 'No detailed description has been published for this resource yet.'}
        </p>

        <dl className="spec-ledger">
          <div>
            <dt className="spec-label">Location</dt>
            <dd className="spec-value">{resource.location || 'Main facility'}</dd>
          </div>
          <div>
            <dt className="spec-label">Capacity</dt>
            <dd className="spec-value">{resource.capacity || 1} people</dd>
          </div>
          <div>
            <dt className="spec-label">Slot length</dt>
            <dd className="spec-value">{resource.slotDurationMinutes || 60} min</dd>
          </div>
          <div>
            <dt className="spec-label">Rate</dt>
            <dd className="spec-value">{rate}</dd>
          </div>
        </dl>
      </header>

      <div className="detail-layout">
        <div className="detail-main">
          {isAvailable ? (
            <AvailabilityCalendar
              resourceId={resource.id}
              slotDurationMinutes={resource.slotDurationMinutes || 60}
              bookedSlots={availability}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          ) : (
            <div className="notice notice--warning" role="status">
              <Icon name="alert" size={18} />
              <div>
                <strong className="notice-title">Not accepting requests</strong>
                This resource is currently marked {resource.status?.toLowerCase() || 'unavailable'}. Check back once the
                operator reopens it.
              </div>
            </div>
          )}

          <div className="notice">
            <Icon name="info" size={18} />
            <div>
              <strong className="notice-title">How holds work</strong>
              Every request is reviewed by the organisation. Your chosen window is held while a decision is pending and
              released automatically if the request is declined or expires.
            </div>
          </div>
        </div>

        <aside className="summary-panel" aria-label="Booking summary">
          <h2>Request this resource</h2>

          <div className="summary-row">
            <span>Rate</span>
            <strong>{rate}</strong>
          </div>
          <div className="summary-row">
            <span>Approval</span>
            <strong>Manual review</strong>
          </div>
          <div className="summary-row">
            <span>Access</span>
            <strong>{resource.accessPolicy === 'MEMBERS_ONLY' ? 'Members only' : 'Signed-in users'}</strong>
          </div>
          <div className="summary-row">
            <span>Status</span>
            <strong>{isAvailable ? 'Open for requests' : 'Closed'}</strong>
          </div>

          {selectedSlot ? (
            <div className="selected-slot">
              <span className="selected-slot-label">Selected window</span>
              <span className="selected-slot-value">{selectedSlot.label}</span>
            </div>
          ) : (
            <p className="summary-hint">
              Pick an open slot from the availability table to start a request.
            </p>
          )}

          <Button
            variant="primary"
            size="large"
            block
            disabled={!isAvailable || !selectedSlot}
            onClick={handleProceedToBooking}
          >
            Continue to request
          </Button>

          <p className="summary-hint">
            Submitting does not confirm the booking. The organisation must approve the request first.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default ResourceDetailsPage;
