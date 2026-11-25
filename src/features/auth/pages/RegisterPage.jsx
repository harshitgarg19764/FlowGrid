import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import AuthShell from '../components/AuthShell';
import './AuthPages.css';

/**
 * Registration Page
 * Allows new users to create an account
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      // Redirect to app resources
      navigate(ROUTES.APP_RESOURCES, { replace: true });
    } else {
      setApiError(result.error);
    }
  };

  return (
    <AuthShell mode="register">
      <div className="auth-panel-head">
        <span className="auth-panel-kicker mono">Create account / 01</span>
        <h2>Start booking</h2>
        <p>One account works across every organisation affiliated with FlowGrid.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}

        <div className="form-row">
          <Input
            label="First name"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
            disabled={loading}
            autoComplete="given-name"
          />

          <Input
            label="Last name"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
            disabled={loading}
            autoComplete="family-name"
          />
        </div>

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
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helpText="Minimum 8 characters, chosen by you."
          required
          disabled={loading}
          autoComplete="new-password"
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          disabled={loading}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="large"
          block
          loading={loading}
          disabled={loading}
        >
          Create account
        </Button>
      </form>

      <p className="auth-alt">
        Already on the grid? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>

      <p className="auth-legal">
        By creating an account you agree to FlowGrid&rsquo;s terms of use and acceptable use
        policy. Organisation registration is a separate step.
      </p>
    </AuthShell>
  );
};

export default RegisterPage;
