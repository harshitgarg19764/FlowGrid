/**
 * Button Component
 * Reusable button with multiple variants
 *
 * Note: Base button styles are in global.css
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  loading = false,
  block = false,
  onClick,
  ...props
}) => {
  const classes = ['btn', `btn-${variant}`];

  if (size === 'small') classes.push('btn-sm');
  if (size === 'large') classes.push('btn-lg');
  if (block) classes.push('btn-block');

  return (
    <button
      type={type}
      className={classes.join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="btn-loading" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
