import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';
import resourceService from '../resourceService';
import ResourceForm from '../components/ResourceForm';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import Icon from '../../../components/ui/Icon';

/**
 * ResourceFormPage
 * Create or edit a resource record inside the operator console.
 */
const ResourceFormPage = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { activeOrganisation } = useAuth();

  const isEditMode = Boolean(resourceId);
  const orgId = activeOrganisation?.organisationId;

  const [initialData, setInitialData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let isMounted = true;

    if (isEditMode && resourceId) {
      const loadResource = async () => {
        try {
          const resource = await resourceService.getResourceById(resourceId);
          if (isMounted) setInitialData(resource);
        } catch (err) {
          if (isMounted) {
            setApiError(err.response?.data?.message || 'Failed to load resource details');
          }
        } finally {
          if (isMounted) setLoadingInitial(false);
        }
      };

      loadResource();
    }

    return () => {
      isMounted = false;
    };
  }, [resourceId, isEditMode]);

  const handleSubmit = async (formData) => {
    if (!orgId) {
      setApiError('No active organisation found. Please select an organisation first.');
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      if (isEditMode) {
        await resourceService.updateResource(orgId, resourceId, formData);
      } else {
        await resourceService.createResource(orgId, formData);
      }

      navigate(ROUTES.ORG_RESOURCES);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to save resource';
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!orgId) {
    return (
      <div className="workspace">
        <EmptyState
          icon="building"
          title="Active organisation required"
          description="Select or register an organisation before managing resources."
          action={
            <Link to={ROUTES.REGISTER_ORGANISATION} className="btn btn-primary">
              Register organisation
            </Link>
          }
        />
      </div>
    );
  }

  if (loadingInitial) {
    return (
      <div className="workspace">
        <div className="loading-block">
          <Loader size="large" text="Loading resource" />
        </div>
      </div>
    );
  }

  return (
    <div className="workspace workspace--narrow">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.ORG_RESOURCES}>
          <Icon name="arrowLeft" size={14} />
          Resources
        </Link>
      </nav>

      <header className="workspace-head">
        <div>
          <h1>{isEditMode ? 'Edit resource' : 'New resource'}</h1>
          <p>
            {isEditMode
              ? 'Update the operating conditions for this record. Changes apply to future requests.'
              : 'Describe the space, set its rate and publish it to the catalogue.'}
          </p>
        </div>
      </header>

      <div className="panel">
        <div className="panel-body">
          <ResourceForm
            initialValues={initialData || {}}
            onSubmit={handleSubmit}
            loading={submitting}
            apiError={apiError}
            submitButtonText={isEditMode ? 'Save changes' : 'Publish resource'}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceFormPage;
