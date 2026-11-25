import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/ui/Icon';

/**
 * OrganisationForm
 * Editable organisation profile, grouped by identity, contact and
 * operating context.
 */
const OrganisationForm = ({
  initialValues = {},
  onSubmit,
  loading = false,
  apiError = '',
  submitButtonText = 'Save organisation',
}) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    slug: initialValues.slug || '',
    contactEmail: initialValues.contactEmail || '',
    contactPhone: initialValues.contactPhone || '',
    address: initialValues.address || '',
    description: initialValues.description || '',
    timezone: initialValues.timezone || 'UTC',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !initialValues.id
        ? { slug: value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') }
        : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organisation name is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'A valid contact email is required';
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {apiError && (
        <div className="notice notice--danger" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong className="notice-title">Could not register the workspace</strong>
            {apiError}
          </div>
        </div>
      )}

      <section className="form-section form-section--flush">
        <div className="form-section-head">
          <h2>Identity</h2>
          <p>The name customers see, and the short slug used in workspace URLs.</p>
        </div>

        <Input
          label="Organisation name"
          name="name"
          type="text"
          placeholder="e.g. Meridian Works, North Campus Labs"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          disabled={loading}
        />

        <Input
          label="URL identifier (slug)"
          name="slug"
          type="text"
          placeholder="meridian-works"
          value={formData.slug}
          onChange={handleChange}
          helpText="Lowercase, hyphenated and unique across FlowGrid."
          disabled={loading}
        />
      </section>

      <section className="form-section">
        <div className="form-section-head">
          <h2>Contact route</h2>
          <p>Where booking questions and decision notices should land.</p>
        </div>

        <div className="form-row">
          <Input
            label="Contact email"
            name="contactEmail"
            type="email"
            placeholder="operations@meridian.works"
            value={formData.contactEmail}
            onChange={handleChange}
            error={errors.contactEmail}
            required
            disabled={loading}
          />

          <Input
            label="Contact phone"
            name="contactPhone"
            type="tel"
            placeholder="+1 555 0199"
            value={formData.contactPhone}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-head">
          <h2>Place & profile</h2>
          <p>Help customers recognise the site and what it offers.</p>
        </div>

        <Input
          label="Physical address"
          name="address"
          type="text"
          placeholder="123 Campus Blvd, Building B"
          value={formData.address}
          onChange={handleChange}
          disabled={loading}
        />

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            rows={3}
            placeholder="Brief summary of the site, facilities and who it serves…"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </section>

      <section className="form-section">
        <div className="form-section-head">
          <h2>Operating context</h2>
          <p>Timezone used for opening hours, holds and decision deadlines.</p>
        </div>

        <div className="form-group">
          <label htmlFor="timezone" className="form-label">
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            className="form-select"
            value={formData.timezone}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="UTC">UTC — Coordinated Universal Time</option>
            <option value="America/New_York">Eastern Time (US &amp; Canada)</option>
            <option value="America/Chicago">Central Time (US &amp; Canada)</option>
            <option value="America/Denver">Mountain Time (US &amp; Canada)</option>
            <option value="America/Los_Angeles">Pacific Time (US &amp; Canada)</option>
            <option value="Europe/London">London (GMT/BST)</option>
            <option value="Europe/Paris">Paris, Berlin, Rome</option>
            <option value="Asia/Kolkata">India Standard Time (IST)</option>
            <option value="Asia/Tokyo">Tokyo, Seoul</option>
            <option value="Australia/Sydney">Sydney, Melbourne</option>
          </select>
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

export default OrganisationForm;
