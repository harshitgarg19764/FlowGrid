import apiClient from '../../services/api';

/**
 * Booking Service
 * Handles booking requests, approval, cancellation, and history
 */

export const bookingService = {
  /**
   * Create a new booking request
   */
  createBooking: async (bookingData, idempotencyKey) => {
    const headers = idempotencyKey
      ? { 'Idempotency-Key': idempotencyKey }
      : {};
    
    const response = await apiClient.post('/bookings', bookingData, { headers });
    return response.data;
  },

  /**
   * Get current user's bookings
   */
  getMyBookings: async (filters = {}) => {
    const response = await apiClient.get('/bookings/me', { params: filters });
    return response.data;
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (bookingId) => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Cancel a booking
   */
  cancelBooking: async (bookingId, reason) => {
    const response = await apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },

  /**
   * Get organisation bookings (for approval queue and management)
   */
  getOrganisationBookings: async (organisationId, filters = {}) => {
    const response = await apiClient.get(
      `/organisations/${organisationId}/bookings`,
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get pending approval requests for an organisation
   */
  getPendingApprovals: async (organisationId) => {
    const response = await apiClient.get(
      `/organisations/${organisationId}/bookings/pending`
    );
    return response.data;
  },

  /**
   * Approve a booking request
   */
  approveBooking: async (organisationId, bookingId) => {
    const response = await apiClient.post(
      `/organisations/${organisationId}/bookings/${bookingId}/approve`
    );
    return response.data;
  },

  /**
   * Decline a booking request
   */
  declineBooking: async (organisationId, bookingId, reason) => {
    const response = await apiClient.post(
      `/organisations/${organisationId}/bookings/${bookingId}/decline`,
      { reason }
    );
    return response.data;
  },
};

export default bookingService;
