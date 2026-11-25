import apiClient from '../../services/api';

/**
 * Payment Service
 * Handles payment processing, status, and history
 * 
 * NOTE: Actual payment flows depend on backend integration with payment provider
 * This service assumes the backend handles sensitive payment operations
 */

export const paymentService = {
  /**
   * Create payment intent for a booking
   * Backend should handle payment provider integration
   */
  createPaymentIntent: async (bookingId) => {
    const response = await apiClient.post(`/payments/bookings/${bookingId}/intent`);
    return response.data;
  },

  /**
   * Get payment status for a booking
   */
  getPaymentStatus: async (bookingId) => {
    const response = await apiClient.get(`/payments/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Get payment history for current user
   */
  getPaymentHistory: async (filters = {}) => {
    const response = await apiClient.get('/payments/me', { params: filters });
    return response.data;
  },

  /**
   * Request refund for a cancelled booking
   * Backend determines refund eligibility based on cancellation policy
   */
  requestRefund: async (bookingId, reason) => {
    const response = await apiClient.post(`/payments/bookings/${bookingId}/refund`, {
      reason,
    });
    return response.data;
  },

  /**
   * Confirm payment completion (called after payment provider redirect)
   */
  confirmPayment: async (paymentId, providerData) => {
    const response = await apiClient.post(`/payments/${paymentId}/confirm`, providerData);
    return response.data;
  },
};

export default paymentService;
