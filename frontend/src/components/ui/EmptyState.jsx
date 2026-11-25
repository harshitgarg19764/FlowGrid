import './EmptyState.css';

/**
 * A placeholder component for empty content areas.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.icon] - Optional icon (SVG, emoji, etc.)
 * @param {string} props.title - Primary message (e.g., "No bookings yet")
 * @param {string} [props.description] - Secondary description text
 * @param {React.ReactNode} [props.action] - Optional action element (e.g., a Button)
 * @param {string} [props.className]
 */
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  const classNames = ['empty-state', className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 className="empty-state__title">{title}</h3>

      {description && (
        <p
          className={`empty-state__description${action ? ' empty-state__description--with-action' : ''}`}
        >
          {description}
        </p>
      )}

      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
