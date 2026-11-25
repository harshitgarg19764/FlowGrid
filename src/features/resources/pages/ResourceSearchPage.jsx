import { useState, useEffect, useMemo } from 'react';
import resourceService from '../resourceService';
import ResourceCard from '../components/ResourceCard';
import ResourceFilters from '../components/ResourceFilters';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import useDebounce from '../../../hooks/useDebounce';

/**
 * ResourceSearchPage
 * Main discovery catalog for authenticated customers
 */
const ResourceSearchPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    pricing: '',
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        const data = await resourceService.getResources();
        if (isMounted) setResources(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Unable to connect to resource catalogue.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter resources based on current filter state
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      // Search term
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesLoc = item.location?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesLoc) return false;
      }

      // Type
      if (filters.type && item.type !== filters.type) {
        return false;
      }

      // Pricing
      if (filters.pricing === 'free' && item.isPaid) return false;
      if (filters.pricing === 'paid' && !item.isPaid) return false;

      return true;
    });
  }, [resources, debouncedSearch, filters.type, filters.pricing]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      pricing: '',
    });
  };

  const hasFilters = Boolean(debouncedSearch || filters.type || filters.pricing);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Catalogue</h1>
          <p className="page-lede">
            Rooms, labs, kit, parking and chargers from every organisation on the grid.
            Check live capacity, then request the window you need.
          </p>
        </div>

        <div className="page-head-aside">
          <span className="page-head-figure">
            {loading ? '—' : filteredResources.length}
          </span>
          <span className="page-head-caption">
            {hasFilters ? 'matching resources' : 'resources listed'}
          </span>
        </div>
      </header>

      <ResourceFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-block">
          <Loader size="large" text="Loading catalogue" />
        </div>
      ) : filteredResources.length === 0 ? (
        <EmptyState
          icon="search"
          title={hasFilters ? 'No resources match those filters' : 'No resources published yet'}
          description={
            hasFilters
              ? 'Try a broader category, a different price rule, or clear the filters to see everything.'
              : 'Once an organisation publishes a bookable resource it will appear here.'
          }
          action={
            hasFilters && (
              <button type="button" className="btn btn-outline" onClick={handleResetFilters}>
                Clear filters
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="resource-grid-head">
            <span className="mono">
              {hasFilters ? 'FILTERED VIEW' : 'ALL RESOURCES'}
            </span>
            <span className="resource-grid-note">
              Prices shown per hour · approval required on request
            </span>
          </div>
          <div className="resource-grid">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceSearchPage;
