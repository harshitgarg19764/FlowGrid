import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for expired session message from URL params
  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('Your session has expired. Please sign in again.');
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/resources', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login({ email: email.trim(), password });
      navigate('/app/resources', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPage.Wrapper
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    >
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        autoFocus
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <div className="login-forgot-password">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        Sign in
      </Button>
    </LoginPage.Wrapper>
  );
}

// Internal wrapper to keep JSX clean
LoginPage.Wrapper = function LoginWrapper({ children, error, loading, onSubmit }) {
  return (
    <AuthForm
      title="Sign in to FlowGrid"
      subtitle="Welcome back"
      error={error}
      loading={loading}
      onSubmit={onSubmit}
      footer={
        <span>
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </span>
      }
    >
      {children}
    </AuthForm>
  );
};
