import Icon from './Icon';
import './EmptyState.css';

/**
 * EmptyState
 * A quiet, engineered placeholder for empty collections and error views.
 *
 * @param {string} icon - Icon name from the shared stroke set
 * @param {string} title - Primary message
 * @param {string} description - Secondary message
 * @param {ReactNode} action - Optional action button or link
 */
const EmptyState = ({ icon = 'box', title, description, action }) => {
  return (
    <div className="empty-state">
      <span className="empty-state-mark" aria-hidden="true">
        <Icon name={icon} size={24} strokeWidth={1.4} />
      </span>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
