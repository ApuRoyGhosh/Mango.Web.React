import React, { createContext, useState, useCallback, useEffect } from 'react';
import { SD } from '../utils/SD';

const normalizeRoles = (roles) => {
  if (!roles) return [];
  if (Array.isArray(roles)) return roles;
  if (typeof roles === 'string') {
    try {
      const parsed = JSON.parse(roles);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore invalid JSON
    }
    return roles.split(',').map((r) => r.trim()).filter(Boolean);
  }
  return [];
};

const parseRolesFromToken = (token) => {
  if (!token) return [];
  try {
    const payload = token.split('.')[1];
    if (!payload) return [];
    const decoded = JSON.parse(atob(payload));
    const claim = decoded.roles || decoded.role || decoded.Roles || decoded.Role;
    if (!claim) return [];
    return normalizeRoles(claim);
  } catch {
    return [];
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(SD.StorageKeys.Token);
    const storedUser = localStorage.getItem(SD.StorageKeys.User);

    if (storedToken) {
      setToken(storedToken);
      let parsedUser = null;
      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch {
          parsedUser = null;
        }
      }

      if (parsedUser) {
        parsedUser.roles = normalizeRoles(parsedUser.roles);
      }

      if (!parsedUser?.roles?.length) {
        parsedUser = parsedUser || {};
        parsedUser.roles = parseRolesFromToken(storedToken);
      }

      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
    const normalizedRoles = normalizeRoles(userData?.roles);
    const roles = normalizedRoles.length ? normalizedRoles : parseRolesFromToken(authToken);
    const userWithRoles = { ...userData, roles };

    setUser(userWithRoles);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem(SD.StorageKeys.Token, authToken);
    localStorage.setItem(SD.StorageKeys.User, JSON.stringify(userWithRoles));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(SD.StorageKeys.Token);
    localStorage.removeItem(SD.StorageKeys.User);
  }, []);

  const isAdmin = useCallback(() => {
    const roles = normalizeRoles(user?.roles);
    return roles.some((role) => String(role).toLowerCase() === SD.Roles.Admin.toLowerCase());
  }, [user]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
