import Icon from '../../../components/ui/Icon';

const RESOURCE_TYPES = [
  { value: '', label: 'All categories' },
  { value: 'MEETING_ROOM', label: 'Meeting rooms' },
  { value: 'LABORATORY', label: 'Laboratories' },
  { value: 'EQUIPMENT', label: 'Hardware & equipment' },
  { value: 'PARKING', label: 'Parking spaces' },
  { value: 'EV_CHARGER', label: 'EV chargers' },
  { value: 'DESK', label: 'Desks / workspaces' },
];

/**
 * ResourceFilters
 * Search input and filter controls for resource catalogue
 */
const ResourceFilters = ({ filters, onChange, onReset }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-bar" role="search">
      <div className="field search-field">
        <label htmlFor="search" className="field-label">
          Search
        </label>
        <Icon name="search" size={17} />
        <input
          id="search"
          name="search"
          type="search"
          className="form-input"
          placeholder="Name, amenity or location"
          value={filters.search || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="field">
        <label htmlFor="type" className="field-label">
          Category
        </label>
        <select
          id="type"
          name="type"
          className="form-select"
          value={filters.type || ''}
          onChange={handleInputChange}
        >
          {RESOURCE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="pricing" className="field-label">
          Pricing
        </label>
        <select
          id="pricing"
          name="pricing"
          className="form-select"
          value={filters.pricing || ''}
          onChange={handleInputChange}
        >
          <option value="">Any pricing</option>
          <option value="free">Free only</option>
          <option value="paid">Paid only</option>
        </select>
      </div>

      <button type="button" className="btn btn-ghost filter-reset" onClick={onReset}>
        <Icon name="refresh" size={15} />
        Reset
      </button>
    </div>
  );
};

export default ResourceFilters;
