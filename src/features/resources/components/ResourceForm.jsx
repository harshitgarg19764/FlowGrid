import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';
import { RESOURCE_STATUS } from '../../../constants/bookingStatuses';

const RESOURCE_TYPES = [
  { value: 'MEETING_ROOM', label: 'Meeting room' },
  { value: 'LABORATORY', label: 'Laboratory / research station' },
  { value: 'EQUIPMENT', label: 'Hardware & equipment' },
  { value: 'PARKING', label: 'Parking space' },
  { value: 'EV_CHARGER', label: 'EV charger' },
  { value: 'DESK', label: 'Desk / workspace' },
  { value: 'OTHER', label: 'Other facility' },
];

const SLOT_DURATIONS = [30, 45, 60, 90, 120];

/**
 * ResourceForm
 * Reusable create/edit form, split into operating sections so operators
 * can scan the record the same way customers will.
 */
const ResourceForm = ({
  initialValues = {},
  onSubmit,
  loading = false,
  apiError = '',
  submitButtonText = 'Save resource',
}) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    type: initialValues.type || 'MEETING_ROOM',
    description: initialValues.description || '',
    location: initialValues.location || '',
    capacity: initialValues.capacity || 1,
    isPaid: initialValues.isPaid ?? false,
    hourlyRate: initialValues.hourlyRate || 0,
    currency: initialValues.currency || 'USD',
    status: initialValues.status || RESOURCE_STATUS.AVAILABLE,
    accessPolicy: initialValues.accessPolicy || 'PUBLIC_AUTHENTICATED',
    slotDurationMinutes: initialValues.slotDurationMinutes || 60,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Resource name is required';
    }

    if (!formData.capacity || Number(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (formData.isPaid && (!formData.hourlyRate || Number(formData.hourlyRate) <= 0)) {
      newErrors.hourlyRate = 'Please specify a valid rate for paid resources';
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
      ...formData,
      capacity: Number(formData.capacity),
      hourlyRate: formData.isPaid ? Number(formData.hourlyRate) : 0,
      slotDurationMinutes: Number(formData.slotDurationMinutes),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {apiError && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Could not save this resource</strong>
            {apiError}
          </div>
        </div>
      )}

      <section className="form-section">
        <div className="form-section-head">
          <h2>Identity</h2>
          <p>How the resource is named and grouped in the catalogue.</p>
        </div>

        <div className="form-row">
          <Input
            label="Resource name"
            name="name"
            placeholder="e.g. Conference Room A, 3D Printer 01"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            disabled={loading}
          />

          <div className="form-group">
            <label htmlFor="type" className="form-label form-label-required">
              Category
            </label>
            <select
              id="type"
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
            >
              {RESOURCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description & amenities
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            rows={3}
            placeholder="Features, included equipment, access instructions…"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-head">
          <h2>Place & capacity</h2>
          <p>Where the resource sits and how many people or units it holds.</p>
        </div>

        <div className="form-row">
          <Input
            label="Location / room / zone"
            name="location"
            placeholder="e.g. 3rd floor, west wing"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Capacity / units"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            error={errors.capacity}
            required
            disabled={loading}
          />
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-head">
          <h2>Pricing rule</h2>
          <p>Free resources skip payment entirely. Paid resources are charged per hour.</p>
        </div>

        <label className="checkbox-row checkbox-row--panel" htmlFor="isPaid">
          <input
            type="checkbox"
            id="isPaid"
            name="isPaid"
            checked={formData.isPaid}
            onChange={handleChange}
            disabled={loading}
          />
          <span>
            <strong>This is a paid resource</strong>
            Payment is collected according to the organisation policy once a request is approved.
          </span>
        </label>

        {formData.isPaid && (
          <div className="form-row form-row--spaced">
            <Input
              label="Hourly rate"
              name="hourlyRate"
              type="number"
              step="0.01"
              min="0"
              placeholder="25.00"
              value={formData.hourlyRate}
              onChange={handleChange}
              error={errors.hourlyRate}
              required
              disabled={loading}
            />

            <div className="form-group">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="form-select"
                value={formData.currency}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        )}
      </section>

      <section className="form-section">
        <div className="form-section-head">
          <h2>Operating conditions</h2>
          <p>Control who can request the resource and how its timetable is cut.</p>
        </div>

        <div className="form-row form-row--three">
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Operational status
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value={RESOURCE_STATUS.AVAILABLE}>Available for booking</option>
              <option value={RESOURCE_STATUS.UNAVAILABLE}>Temporarily unavailable</option>
              <option value={RESOURCE_STATUS.MAINTENANCE}>Under maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="accessPolicy" className="form-label">
              Eligibility
            </label>
            <select
              id="accessPolicy"
              name="accessPolicy"
              className="form-select"
              value={formData.accessPolicy}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="PUBLIC_AUTHENTICATED">All signed-in users</option>
              <option value="MEMBERS_ONLY">Organisation members only</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="slotDurationMinutes" className="form-label">
              Slot length
            </label>
            <select
              id="slotDurationMinutes"
              name="slotDurationMinutes"
              className="form-select"
              value={formData.slotDurationMinutes}
              onChange={handleChange}
              disabled={loading}
            >
              {SLOT_DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="form-actions">
        <Button type="submit" variant="primary" size="large" loading={loading} disabled={loading}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
