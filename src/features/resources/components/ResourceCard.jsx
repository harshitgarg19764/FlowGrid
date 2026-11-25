import { Link } from 'react-router-dom';
import { buildRoute } from '../../../constants/routes';
import StatusBadge from '../../../components/ui/StatusBadge';
import Icon from '../../../components/ui/Icon';
import { formatCurrency } from '../../../utils/currencyUtils';
import { getResourceTypeIcon, getResourceTypeLabel } from '../../../utils/resourceUtils';
import { getResourceImage } from '../../../utils/imageAssets';

/**
 * ResourceCard
 * Displays a single resource in discovery search results with futuristic visual media
 */
const ResourceCard = ({ resource }) => {
  const isAvailable = resource.status === 'AVAILABLE';
  const typeLabel = getResourceTypeLabel(resource.type);
  const typeIcon = getResourceTypeIcon(resource.type);
  const previewImage = resource.imageUrl || getResourceImage(resource.type);

  return (
    <article className="resource-card">
      <div className="resource-card-media">
        <img
          src={previewImage}
          alt={resource.name}
          className="resource-card-img"
          loading="lazy"
        />
        <div className="resource-card-badge-overlay">
          <span className="resource-type-pill">
            <Icon name={typeIcon} size={14} />
            {typeLabel}
          </span>
          <StatusBadge status={resource.status || 'AVAILABLE'} type="resource" />
        </div>
      </div>

      <div className="resource-card-body">
        <h3>{resource.name}</h3>

        <p className="resource-org">
          {resource.organisationName ? (
            <>
              <Icon name="building" size={13} />
              {resource.organisationName}
            </>
          ) : (
            'Independent resource'
          )}
        </p>

        <p className="resource-desc">
          {resource.description || 'No additional details provided for this resource.'}
        </p>

        <dl className="resource-specs">
          <div>
            <dt>Location</dt>
            <dd>
              <Icon name="mapPin" size={12} />
              {resource.location || 'Main facility'}
            </dd>
          </div>
          <div>
            <dt>Capacity</dt>
            <dd>{resource.capacity || 1} people</dd>
          </div>
          <div>
            <dt>Slot length</dt>
            <dd>{resource.slotDurationMinutes || 60} min</dd>
          </div>
          <div>
            <dt>Access</dt>
            <dd>{resource.accessPolicy === 'MEMBERS_ONLY' ? 'Members' : 'Signed-in'}</dd>
          </div>
        </dl>
      </div>

      <div className="resource-card-foot">
        <div className="rate">
          <span className="rate-label">Rate</span>
          <span className="rate-value">
            {resource.isPaid
              ? `${formatCurrency(resource.hourlyRate, resource.currency || 'USD')}/hr`
              : 'No charge'}
          </span>
        </div>

        <Link
          to={buildRoute.resourceDetails(resource.id)}
          className={`btn ${isAvailable ? 'btn-primary' : 'btn-outline'} btn-sm`}
        >
          {isAvailable ? 'View & reserve' : 'View details'}
        </Link>
      </div>
    </article>
  );
};

export default ResourceCard;
