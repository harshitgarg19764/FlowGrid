import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import AuthShell from '../components/AuthShell';
import './AuthPages.css';

/**
 * Login Page
 * Allows users to sign in to their account
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || ROUTES.APP_RESOURCES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      // Redirect to the page they tried to visit or to app resources
      navigate(from, { replace: true });
    } else {
      setApiError(result.error);
    }
  };

  return (
    <AuthShell mode="signin">
      <div className="auth-panel-head">
        <span className="auth-panel-kicker mono">Sign in / customer</span>
        <h2>Welcome back</h2>
        <p>Pick up where you left off — holds, requests and confirmations are waiting.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}

        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          disabled={loading}
          autoComplete="email"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={loading}
          autoComplete="current-password"
        />

        <div className="auth-form-foot">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          block
          loading={loading}
          disabled={loading}
        >
          Sign in to FlowGrid
        </Button>
      </form>

      <p className="auth-alt">
        No account yet? <Link to={ROUTES.REGISTER}>Create one</Link> — it takes a minute.
      </p>
    </AuthShell>
  );
};

export default LoginPage;
