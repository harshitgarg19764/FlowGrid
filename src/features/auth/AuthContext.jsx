import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from './authService';

export const AuthContext = createContext(null);

/**
 * Authentication Context Provider
 * Manages user authentication state and provides auth operations
 * 
 * Supports both HttpOnly cookie and token-based authentication
 * The actual mechanism depends on backend implementation
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeOrganisation, setActiveOrganisation] = useState(null);

  /**
   * Helper to resolve active organisation from user data
   */
  const resolveActiveOrganisation = (userData) => {
    if (!userData || !userData.organisationMemberships || userData.organisationMemberships.length === 0) {
      setActiveOrganisation(null);
      localStorage.removeItem('activeOrganisationId');
      return;
    }

    const savedOrgId = localStorage.getItem('activeOrganisationId');
    const matched = userData.organisationMemberships.find((m) => m.organisationId === savedOrgId);
    
    if (matched) {
      setActiveOrganisation(matched);
    } else {
      const defaultOrg = userData.organisationMemberships[0];
      setActiveOrganisation(defaultOrg);
      localStorage.setItem('activeOrganisationId', defaultOrg.organisationId);
    }
  };

  /**
   * Switch the currently active organisation context
   */
  const switchActiveOrganisation = (organisationId) => {
    if (!user || !user.organisationMemberships) return;
    const found = user.organisationMemberships.find((m) => m.organisationId === organisationId);
    if (found) {
      setActiveOrganisation(found);
      localStorage.setItem('activeOrganisationId', found.organisationId);
    }
  };

  /**
   * Initialize authentication state on mount
   * Check for existing session or stored credentials
   */
  const initializeAuth = useCallback(async () => {
    try {
      // Try to get current user from backend
      // This works with both HttpOnly cookies and token auth
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      resolveActiveOrganisation(userData);
    } catch {
      // Check if we have token or user in localStorage
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (token && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setIsAuthenticated(true);
          resolveActiveOrganisation(parsed);
        } catch {
          setUser(null);
          setIsAuthenticated(false);
          setActiveOrganisation(null);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setActiveOrganisation(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('activeOrganisationId');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Login with credentials
   */
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // Backend may return user data and/or access token
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        resolveActiveOrganisation(response.user);
      }
      
      // If using token-based auth, store the token
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  /**
   * Register new user account
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // Some backends auto-login after registration
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        resolveActiveOrganisation(response.user);
      }
      
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setActiveOrganisation(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('activeOrganisationId');
    }
  };

  /**
   * Refresh user data from backend
   * Useful after profile updates, organization registration or role changes
   */
  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      resolveActiveOrganisation(userData);
      return { success: true, data: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to refresh user data.',
      };
    }
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  /**
   * Check if user belongs to a specific organisation
   */
  const hasOrganisationRole = (organisationId, role) => {
    if (!user || !user.organisationMemberships) return false;
    
    const membership = user.organisationMemberships.find(
      (m) => m.organisationId === organisationId
    );
    
    return membership && membership.role === role;
  };

  const defaultDemoOrg = {
    organisationId: 'demo-org-1',
    organisationName: 'FlowGrid Demo Workspace',
    role: 'ORG_OWNER',
  };

  const currentActiveOrg = activeOrganisation || defaultDemoOrg;

  /**
   * Get all organisations the user belongs to
   */
  const getUserOrganisations = () => {
    return user?.organisationMemberships && user.organisationMemberships.length > 0
      ? user.organisationMemberships
      : [defaultDemoOrg];
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    activeOrganisation: currentActiveOrg,
    switchActiveOrganisation,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    hasOrganisationRole,
    getUserOrganisations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
