import './AuthForm.css';

export default function AuthForm({ title, subtitle, children, onSubmit, footer, error, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-card">
        <div className="auth-form-brand">FlowGrid</div>

        {title && <h1 className="auth-form-title">{title}</h1>}
        {subtitle && <p className="auth-form-subtitle">{subtitle}</p>}

        {error && (
          <div className="auth-form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-form-body">
            {children}
          </div>
        </form>

        {footer && (
          <div className="auth-form-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
