import './Button.css';

/**
 * A versatile button component with multiple variants and sizes.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {'button'|'submit'|'reset'} [props.type='button']
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.loading=false] - Shows spinner and disables button
 * @param {boolean} [props.fullWidth=false]
 * @param {Function} [props.onClick]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.icon] - Optional icon rendered before text
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  icon,
  ...rest
}) {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : '',
    loading ? 'btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && icon && <span className="btn__icon">{icon}</span>}
      {children && <span className="btn__text">{children}</span>}
    </button>
  );
}
