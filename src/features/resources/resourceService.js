import apiClient from '../../services/api';

/**
 * Resource Service
 * Handles resource search, details, availability, and management
 */

export const resourceService = {
  /**
   * Get all resources with optional filters
   */
  getResources: async (filters = {}) => {
    const response = await apiClient.get('/resources', { params: filters });
    return response.data;
  },

  /**
   * Get resource by ID
   */
  getResourceById: async (resourceId) => {
    const response = await apiClient.get(`/resources/${resourceId}`);
    return response.data;
  },

  /**
   * Get resource availability for a date range
   */
  getAvailability: async (resourceId, params) => {
    const response = await apiClient.get(`/resources/${resourceId}/availability`, {
      params,
    });
    return response.data;
  },

  /**
   * Create a new resource (organisation context)
   */
  createResource: async (organisationId, resourceData) => {
    const response = await apiClient.post(
      `/organisations/${organisationId}/resources`,
      resourceData
    );
    return response.data;
  },

  /**
   * Update a resource (organisation context)
   */
  updateResource: async (organisationId, resourceId, resourceData) => {
    const response = await apiClient.patch(
      `/organisations/${organisationId}/resources/${resourceId}`,
      resourceData
    );
    return response.data;
  },

  /**
   * Delete a resource (organisation context)
   */
  deleteResource: async (organisationId, resourceId) => {
    const response = await apiClient.delete(
      `/organisations/${organisationId}/resources/${resourceId}`
    );
    return response.data;
  },

  /**
   * Get organisation resources
   */
  getOrganisationResources: async (organisationId, filters = {}) => {
    const response = await apiClient.get(`/organisations/${organisationId}/resources`, {
      params: filters,
    });
    return response.data;
  },
};

export default resourceService;
