import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import organisationService from '../organisationService';
import OrganisationForm from '../components/OrganisationForm';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/ui/Icon';

const setupSteps = [
  {
    title: 'Owner account',
    copy: 'Sign in, or create the administrator account that will hold this workspace.',
  },
  {
    title: 'Organisation profile',
    copy: 'Name, contact route, address and operating timezone.',
  },
  {
    title: 'Publish resources',
    copy: 'Add rooms, labs, kit, bays or chargers with their own rate and slot length.',
  },
  {
    title: 'Run the queue',
    copy: 'Approve or decline held requests from the operator console.',
  },
];

/**
 * RegisterOrganisationPage
 * Opens a workspace: owner account first, then the organisation record.
 */
const RegisterOrganisationPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, register, refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [ownerData, setOwnerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [ownerErrors, setOwnerErrors] = useState({});

  const handleOwnerChange = (event) => {
    const { name, value } = event.target;
    setOwnerData((prev) => ({ ...prev, [name]: value }));
    if (ownerErrors[name]) setOwnerErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRegisterOrg = async (orgFormData) => {
    setLoading(true);
    setApiError('');

    try {
      if (!isAuthenticated) {
        if (!ownerData.email || !ownerData.password || !ownerData.firstName) {
          setOwnerErrors({
            firstName: !ownerData.firstName ? 'First name is required' : '',
            email: !ownerData.email ? 'Email is required' : '',
            password: !ownerData.password ? 'Password is required' : '',
          });
          setLoading(false);
          return;
        }

        const authRes = await register({
          firstName: ownerData.firstName,
          lastName: ownerData.lastName,
          email: ownerData.email,
          password: ownerData.password,
        });

        if (!authRes.success) {
          setApiError(authRes.error || 'Failed to create the owner account.');
          setLoading(false);
          return;
        }
      }

      const orgPayload = {
        ...orgFormData,
        ownerEmail: user?.email || ownerData.email,
      };

      await organisationService.registerOrganisation(orgPayload);
      await refreshUser();
      navigate(ROUTES.ORG_DASHBOARD);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to register organisation.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page--mid">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.HOME}>
          <Icon name="arrowLeft" size={14} />
          Overview
        </Link>
        <span aria-hidden="true">/</span>
        <span>Open a workspace</span>
      </nav>

      <div className="setup-layout">
        <aside className="setup-aside">
          <span className="setup-kicker mono">Workspace / setup</span>
          <h1>Open a workspace</h1>
          <p>
            Publish bookable capacity, hold requested windows and keep every approval decision on one record.
          </p>

          <ol className="step-list">
            {setupSteps.map((step, index) => (
              <li key={step.title}>
                <span className="step-index mono">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{step.title}</strong>
                  {step.copy}
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <div className="setup-card">
          {!isAuthenticated && (
            <section className="setup-section">
              <h2>Owner account</h2>
              <p>
                Already have an account? <Link to={ROUTES.LOGIN}>Sign in first</Link> and this workspace will
                attach to it.
              </p>

              <div className="form-row">
                <Input
                  label="First name"
                  name="firstName"
                  value={ownerData.firstName}
                  onChange={handleOwnerChange}
                  error={ownerErrors.firstName}
                  required
                />
                <Input
                  label="Last name"
                  name="lastName"
                  value={ownerData.lastName}
                  onChange={handleOwnerChange}
                />
              </div>

              <div className="form-row">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  value={ownerData.email}
                  onChange={handleOwnerChange}
                  error={ownerErrors.email}
                  required
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={ownerData.password}
                  onChange={handleOwnerChange}
                  error={ownerErrors.password}
                  required
                />
              </div>
            </section>
          )}

          <section className="setup-section">
            <h2>Organisation details</h2>
            <p>These details identify the workspace to customers in the catalogue.</p>

            <OrganisationForm
              onSubmit={handleRegisterOrg}
              loading={loading}
              apiError={apiError}
              submitButtonText="Open workspace"
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrganisationPage;
