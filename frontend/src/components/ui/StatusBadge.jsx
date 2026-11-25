import './StatusBadge.css';

/**
 * A badge component for displaying statuses with semantic colors.
 *
 * @param {object} props
 * @param {'success'|'warning'|'danger'|'info'|'default'|'primary'} [props.variant='default']
 * @param {React.ReactNode} props.children - Badge text content
 * @param {'sm'|'md'} [props.size='md']
 * @param {boolean} [props.dot=false] - Show a colored dot before text
 * @param {string} [props.className]
 */
export default function StatusBadge({
  variant = 'default',
  children,
  size = 'md',
  dot = false,
  className = '',
}) {
  const classNames = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
