import apiClient from '../../services/api';

/**
 * Admin Service
 * Platform administration operations - only accessible to PLATFORM_ADMIN role
 */

export const adminService = {
  /**
   * Get all organisations (platform admin view)
   */
  getAllOrganisations: async (filters = {}) => {
    const response = await apiClient.get('/admin/organisations', { params: filters });
    return response.data;
  },

  /**
   * Create organisation (platform admin)
   */
  createOrganisation: async (organisationData) => {
    const response = await apiClient.post('/admin/organisations', organisationData);
    return response.data;
  },

  /**
   * Update organisation (platform admin)
   */
  updateOrganisation: async (organisationId, organisationData) => {
    const response = await apiClient.patch(
      `/admin/organisations/${organisationId}`,
      organisationData
    );
    return response.data;
  },

  /**
   * Get all platform users
   */
  getAllUsers: async (filters = {}) => {
    const response = await apiClient.get('/admin/users', { params: filters });
    return response.data;
  },

  /**
   * Update user details (platform admin)
   */
  updateUser: async (userId, userData) => {
    const response = await apiClient.patch(`/admin/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Get platform statistics
   */
  getPlatformStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  /**
   * Get audit logs
   */
  getAuditLogs: async (filters = {}) => {
    const response = await apiClient.get('/admin/audit-logs', { params: filters });
    return response.data;
  },
};

export default adminService;
