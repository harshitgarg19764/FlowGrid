import apiClient from '../../services/api';

/**
 * Organisation Service
 * Handles organisation registration, management, and member operations
 */

export const organisationService = {
  /**
   * Register a new organisation
   */
  registerOrganisation: async (organisationData) => {
    const response = await apiClient.post('/organisations', organisationData);
    return response.data;
  },

  /**
   * Get organisation by ID
   */
  getOrganisationById: async (organisationId) => {
    const response = await apiClient.get(`/organisations/${organisationId}`);
    return response.data;
  },

  /**
   * Update organisation details
   */
  updateOrganisation: async (organisationId, organisationData) => {
    const response = await apiClient.patch(
      `/organisations/${organisationId}`,
      organisationData
    );
    return response.data;
  },

  /**
   * Get organisations the current user belongs to
   */
  getMyOrganisations: async () => {
    const response = await apiClient.get('/organisations/me');
    return response.data;
  },

  /**
   * Get organisation members
   */
  getMembers: async (organisationId) => {
    const response = await apiClient.get(`/organisations/${organisationId}/members`);
    return response.data;
  },

  /**
   * Invite a member to organisation
   */
  inviteMember: async (organisationId, inviteData) => {
    const response = await apiClient.post(
      `/organisations/${organisationId}/members/invite`,
      inviteData
    );
    return response.data;
  },

  /**
   * Remove a member from organisation
   */
  removeMember: async (organisationId, memberId) => {
    const response = await apiClient.delete(
      `/organisations/${organisationId}/members/${memberId}`
    );
    return response.data;
  },

  /**
   * Update member role
   */
  updateMemberRole: async (organisationId, memberId, role) => {
    const response = await apiClient.patch(
      `/organisations/${organisationId}/members/${memberId}`,
      { role }
    );
    return response.data;
  },

  /**
   * Get organisation settings
   */
  getSettings: async (organisationId) => {
    const response = await apiClient.get(`/organisations/${organisationId}/settings`);
    return response.data;
  },

  /**
   * Update organisation settings
   */
  updateSettings: async (organisationId, settings) => {
    const response = await apiClient.patch(
      `/organisations/${organisationId}/settings`,
      settings
    );
    return response.data;
  },
};

export default organisationService;
