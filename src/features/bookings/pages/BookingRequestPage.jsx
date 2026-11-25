import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import resourceService from '../../resources/resourceService';
import bookingService from '../bookingService';
import BookingRequestForm from '../components/BookingRequestForm';
import Loader from '../../../components/ui/Loader';
import Icon from '../../../components/ui/Icon';
import { ROUTES, buildRoute } from '../../../constants/routes';

/**
 * BookingRequestPage
 * Final review step before a booking request enters the approval queue.
 */
const BookingRequestPage = () => {
  const { resourceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const [resource, setResource] = useState(stateData.resource || null);
  const [loadingResource, setLoadingResource] = useState(!stateData.resource);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let isMounted = true;

    if (!resource && resourceId) {
      const fetchResource = async () => {
        try {
          const data = await resourceService.getResourceById(resourceId);
          if (isMounted) setResource(data);
        } catch (err) {
          if (isMounted) {
            setApiError(err.response?.data?.message || 'Could not load resource details.');
          }
        } finally {
          if (isMounted) setLoadingResource(false);
        }
      };

      fetchResource();
    }

    return () => {
      isMounted = false;
    };
  }, [resource, resourceId]);

  const handleSubmitBooking = async (payload) => {
    setSubmitting(true);
    setApiError('');

    try {
      const result = await bookingService.createBooking(payload, payload.idempotencyKey);
      const newBookingId = result?.id || result?.bookingId;

      if (newBookingId) {
        navigate(buildRoute.bookingDetails(newBookingId), {
          state: { message: 'Request submitted. The organisation now has it in the approval queue.' },
        });
      } else {
        navigate(ROUTES.APP_BOOKINGS, {
          state: { message: 'Request submitted. The organisation now has it in the approval queue.' },
        });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setApiError('This window was just requested or booked by someone else. Choose another slot.');
      } else {
        setApiError(
          err.response?.data?.message || 'Failed to submit the request. Check the details and try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingResource) {
    return (
      <div className="page page--narrow">
        <div className="loading-block">
          <Loader size="large" text="Loading request" />
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="page page--narrow">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={ROUTES.APP_RESOURCES}>
            <Icon name="arrowLeft" size={14} />
            Catalogue
          </Link>
        </nav>

        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Cannot start this request</strong>
            {apiError || 'The resource could not be found.'}
          </div>
        </div>

        <div className="form-actions form-actions--start">
          <Link to={ROUTES.APP_RESOURCES} className="btn btn-outline">
            Back to catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--narrow">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={buildRoute.resourceDetails(resourceId)}>
          <Icon name="arrowLeft" size={14} />
          {resource.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span>Request</span>
      </nav>

      <header className="page-head">
        <div>
          <h1>Request booking</h1>
          <p className="page-lede">
            Check the window and estimated cost, then send it to the operator for review.
          </p>
        </div>
      </header>

      <BookingRequestForm
        resource={resource}
        initialStartTime={stateData.startTime}
        initialEndTime={stateData.endTime}
        onSubmit={handleSubmitBooking}
        loading={submitting}
        apiError={apiError}
      />
    </div>
  );
};

export default BookingRequestPage;
