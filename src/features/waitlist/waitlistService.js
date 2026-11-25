import apiClient from '../../services/api';

/**
 * Waitlist Service
 * Handles joining waitlists, viewing position, and accepting offers
 */

export const waitlistService = {
  /**
   * Join a waitlist for a resource
   */
  joinWaitlist: async (waitlistData) => {
    const response = await apiClient.post('/waitlists', waitlistData);
    return response.data;
  },

  /**
   * Get current user's waitlist entries
   */
  getMyWaitlists: async () => {
    const response = await apiClient.get('/waitlists/me');
    return response.data;
  },

  /**
   * Get waitlist position for a specific entry
   */
  getWaitlistPosition: async (waitlistId) => {
    const response = await apiClient.get(`/waitlists/${waitlistId}`);
    return response.data;
  },

  /**
   * Leave a waitlist
   */
  leaveWaitlist: async (waitlistId) => {
    const response = await apiClient.delete(`/waitlists/${waitlistId}`);
    return response.data;
  },

  /**
   * Accept a slot offer from waitlist
   */
  acceptOffer: async (waitlistId, offerId) => {
    const response = await apiClient.post(
      `/waitlists/${waitlistId}/offers/${offerId}/accept`
    );
    return response.data;
  },

  /**
   * Get organisation waitlist settings
   */
  getWaitlistSettings: async (organisationId) => {
    const response = await apiClient.get(
      `/organisations/${organisationId}/waitlist/settings`
    );
    return response.data;
  },

  /**
   * Update organisation waitlist settings
   */
  updateWaitlistSettings: async (organisationId, settings) => {
    const response = await apiClient.patch(
      `/organisations/${organisationId}/waitlist/settings`,
      settings
    );
    return response.data;
  },
};

export default waitlistService;
