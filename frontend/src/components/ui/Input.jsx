import './Input.css';

/**
 * A form input component with label, error, and help-text support.
 * Renders <input>, <textarea>, or <select> depending on `type`.
 *
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} props.id - Required for label association
 * @param {string} [props.type='text']
 * @param {string} [props.value]
 * @param {Function} [props.onChange]
 * @param {Function} [props.onBlur]
 * @param {string} [props.placeholder]
 * @param {string} [props.error] - Error message to display
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.helpText]
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children] - Options for select type
 * @param {number} [props.rows=3] - Row count for textarea
 */
export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  helpText,
  className = '',
  children,
  rows = 3,
  ...rest
}) {
  const wrapperClasses = ['input-wrapper', className].filter(Boolean).join(' ');

  const controlClasses = [
    'input-control',
    error ? 'input-control--error' : '',
    disabled ? 'input-control--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const sharedProps = {
    id,
    className: controlClasses,
    value,
    onChange,
    onBlur,
    placeholder,
    disabled,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error
      ? `${id}-error`
      : helpText
        ? `${id}-help`
        : undefined,
    ...rest,
  };

  let control;

  if (type === 'textarea') {
    control = <textarea {...sharedProps} rows={rows} />;
  } else if (type === 'select') {
    control = <select {...sharedProps}>{children}</select>;
  } else {
    control = <input type={type} {...sharedProps} />;
  }

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-label__required"> *</span>}
        </label>
      )}

      {control}

      {error && (
        <p id={`${id}-error`} className="input-error" role="alert">
          {error}
        </p>
      )}

      {!error && helpText && (
        <p id={`${id}-help`} className="input-help">
          {helpText}
        </p>
      )}
    </div>
  );
}
