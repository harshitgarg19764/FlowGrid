import { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../authService';
import AuthForm from '../components/AuthForm';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      footer={
        <span>
          <Link to="/login">Back to sign in</Link>
        </span>
      }
    >
      {submitted ? (
        <div className="forgot-password-success" role="status">
          If an account exists with that email, you&apos;ll receive a password reset link.
        </div>
      ) : (
        <>
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

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Send reset link
          </Button>
        </>
      )}
    </AuthForm>
  );
}
