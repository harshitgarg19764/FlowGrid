import apiClient from '../../services/api';

/**
 * Authentication service.
 * Handles user registration, login, logout, and password management.
 */
const authService = {
  /**
   * Registers a new user account.
   * @param {Object} data - Registration data
   * @param {string} data.name - User's full name
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's chosen password
   * @returns {Promise} Axios response with user data and token
   */
  register: (data) => apiClient.post('/auth/register', data),

  /**
   * Authenticates a user with their credentials.
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise} Axios response with auth token and user data
   */
  login: (credentials) => apiClient.post('/auth/login', credentials),

  /**
   * Logs the current user out, invalidating their session.
   * @returns {Promise} Axios response
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Retrieves the currently authenticated user's profile.
   * @returns {Promise} Axios response with user profile data
   */
  getMe: () => apiClient.get('/auth/me'),

  /**
   * Initiates a password reset flow by sending a reset email.
   * @param {string} email - The email address to send the reset link to
   * @returns {Promise} Axios response
   */
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),

  /**
   * Resets the user's password using a reset token.
   * @param {Object} data - Password reset data
   * @param {string} data.token - The password reset token
   * @param {string} data.password - The new password
   * @returns {Promise} Axios response
   */
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
};

export default authService;
