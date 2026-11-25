import axios from 'axios';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for HttpOnly cookies
});

/**
 * Request interceptor - Add auth token if using token-based auth
 * If backend uses HttpOnly cookies, tokens are sent automatically
 */
apiClient.interceptors.request.use(
  (config) => {
    // If backend uses token-based auth (not HttpOnly cookies):
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle common errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 Unauthorized - session expired or invalid
      if (status === 401) {
        // Clear any stored auth data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Redirect to login only when explicitly handling session expiry
        // (commented out to allow exploring pages without being kicked to login)
        // if (!window.location.pathname.startsWith('/login')) {
        //   window.location.href = '/login?expired=true';
        // }
      }
      
      // Handle 403 Forbidden - insufficient permissions
      if (status === 403) {
        // You might want to show a "Permission Denied" page
        console.error('Access forbidden:', error.response.data);
      }
      
      // Handle 409 Conflict - booking conflict or state transition error
      if (status === 409) {
        // These should be handled by the component showing user-friendly messages
        console.warn('Conflict:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
