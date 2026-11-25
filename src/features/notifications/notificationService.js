import apiClient from '../../services/api';

/**
 * Notification Service
 * Handles in-app notifications
 */

export const notificationService = {
  /**
   * Get current user's notifications
   */
  getNotifications: async (filters = {}) => {
    const response = await apiClient.get('/notifications', { params: filters });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread/count');
    return response.data;
  },
};

export default notificationService;
