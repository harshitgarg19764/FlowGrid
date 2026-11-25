import { createContext, useState, useEffect, useCallback } from 'react';
import authService from './authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrganisation, setActiveOrganisation] = useState(null);

  // On mount, attempt to fetch current user (session/cookie or stored token)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await authService.getMe();
      setUser(response.data);
      // Restore active org from localStorage if the user has org memberships
      const savedOrgId = localStorage.getItem('activeOrganisationId');
      if (savedOrgId && response.data?.organisations?.length) {
        const org = response.data.organisations.find(o => String(o.id) === savedOrgId);
        if (org) setActiveOrganisation(org);
      }
    } catch {
      setUser(null);
      setActiveOrganisation(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    // If backend returns token in response body
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    // Fetch full user profile
    await checkAuth();
    return response;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    await checkAuth();
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Logout even if the API call fails
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('activeOrganisationId');
      setUser(null);
      setActiveOrganisation(null);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const switchOrganisation = useCallback((org) => {
    setActiveOrganisation(org);
    if (org) {
      localStorage.setItem('activeOrganisationId', String(org.id));
    } else {
      localStorage.removeItem('activeOrganisationId');
    }
  }, []);

  // Helper checks
  const isAuthenticated = !!user;

  const hasRole = useCallback((role) => {
    if (!user) return false;
    if (user.role === role) return true;
    if (user.roles && user.roles.includes(role)) return true;
    return false;
  }, [user]);

  const hasOrgRole = useCallback((orgId, role) => {
    if (!user?.organisations) return false;
    const membership = user.organisations.find(o => String(o.id) === String(orgId));
    if (!membership) return false;
    return membership.role === role;
  }, [user]);

  const isPlatformAdmin = useCallback(() => {
    return hasRole('PLATFORM_ADMIN');
  }, [hasRole]);

  const isOrgOwnerOrAdmin = useCallback((orgId) => {
    return hasOrgRole(orgId, 'ORG_OWNER') || hasOrgRole(orgId, 'ORG_ADMIN');
  }, [hasOrgRole]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    activeOrganisation,
    login,
    register,
    logout,
    refreshUser,
    switchOrganisation,
    hasRole,
    hasOrgRole,
    isPlatformAdmin,
    isOrgOwnerOrAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
