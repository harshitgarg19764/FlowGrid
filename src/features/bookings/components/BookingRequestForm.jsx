import { useState, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import { formatDateTime, formatDuration } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';
import { generateIdempotencyKey } from '../../../utils/validation';

/**
 * BookingRequestForm
 * Reviews the exact window, estimated cost and hold policy before the
 * request enters the organisation's approval queue.
 */
const BookingRequestForm = ({
  resource,
  initialStartTime,
  initialEndTime,
  onSubmit,
  loading = false,
  apiError = '',
}) => {
  const startTime = initialStartTime || '';
  const endTime = initialEndTime || '';
  const [purpose, setPurpose] = useState('');
  const [acknowledgedPolicy, setAcknowledgedPolicy] = useState(false);
  const [errors, setErrors] = useState({});

  const idempotencyKey = useMemo(() => generateIdempotencyKey(), []);

  const durationText = useMemo(() => {
    if (!startTime || !endTime) return '';
    return formatDuration(startTime, endTime);
  }, [startTime, endTime]);

  const estimatedCost = useMemo(() => {
    if (!resource?.isPaid || !startTime || !endTime) return 0;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const hours = Math.max(0, (end - start) / (1000 * 60 * 60));
    return hours * (resource.hourlyRate || 0);
  }, [resource, startTime, endTime]);

  const validate = () => {
    const newErrors = {};

    if (!startTime || !endTime) {
      newErrors.times = 'Please select a valid start and end time.';
    } else if (new Date(startTime) >= new Date(endTime)) {
      newErrors.times = 'End time must be after start time.';
    }

    if (!acknowledgedPolicy) {
      newErrors.policy = 'Acknowledge the approval requirement to continue.';
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      resourceId: resource.id,
      organisationId: resource.organisationId,
      startTime,
      endTime,
      purpose,
      totalAmount: estimatedCost,
      currency: resource.currency || 'USD',
      idempotencyKey,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {apiError && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Request not submitted</strong>
            {apiError}
          </div>
        </div>
      )}

      <section className="ticket" aria-label="Request summary">
        <div className="ticket-head">
          <h2>{resource?.name || 'Resource'}</h2>
          <span className="mono">hold pending approval</span>
        </div>

        <div className="ticket-body">
          <div>
            <span className="meta-label">Window</span>
            <span className="meta-value">
              {startTime ? formatDateTime(startTime) : 'Not selected'}
              {endTime ? ` → ${formatDateTime(endTime)}` : ''}
            </span>
          </div>

          <div>
            <span className="meta-label">Duration</span>
            <span className="meta-value">{durationText || '—'}</span>
          </div>

          <div>
            <span className="meta-label">Estimated total</span>
            <span className="ticket-total">
              {resource?.isPaid ? formatCurrency(estimatedCost, resource?.currency || 'USD') : 'No charge'}
            </span>
          </div>
        </div>
      </section>

      {errors.times && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>{errors.times}</div>
        </div>
      )}

      <section className="form-section">
        <div className="form-section-head">
          <h2>Reservation notes</h2>
          <p>Tell the operator what the space is for, expected attendance or setup needs.</p>
        </div>

        <div className="form-group">
          <label htmlFor="purpose" className="form-label">
            Purpose & special requirements
          </label>
          <textarea
            id="purpose"
            name="purpose"
            className="form-textarea"
            rows={3}
            placeholder="e.g. Design review with 8 attendees; needs HDMI and whiteboard markers."
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            disabled={loading}
          />
        </div>
      </section>

      <div className="notice notice--warning">
        <Icon name="shield" size={18} />
        <div>
          <strong className="notice-title">Approval and hold policy</strong>
          <ul>
            <li>
              <strong>Every request is reviewed.</strong> Submitting does not confirm the booking.
            </li>
            <li>
              The window is <strong>temporarily held</strong> until the organisation decides or the hold expires.
            </li>
            <li>
              {resource?.isPaid
                ? 'Payment is collected once the request is approved, under the organisation policy.'
                : 'This resource is complimentary and will not require payment.'}
            </li>
          </ul>
        </div>
      </div>

      <label className="checkbox-row" htmlFor="acknowledge">
        <input
          type="checkbox"
          id="acknowledge"
          checked={acknowledgedPolicy}
          onChange={(event) => setAcknowledgedPolicy(event.target.checked)}
          disabled={loading}
          aria-describedby={errors.policy ? 'policy-error' : undefined}
        />
        <span>I understand this request stays pending until the organisation approves it.</span>
      </label>

      {errors.policy && (
        <div id="policy-error" className="form-error" role="alert">
          {errors.policy}
        </div>
      )}

      <div className="form-actions">
        <Button
          type="submit"
          variant="primary"
          size="large"
          loading={loading}
          disabled={loading || !acknowledgedPolicy}
        >
          Submit request
        </Button>
      </div>
    </form>
  );
};

export default BookingRequestForm;
