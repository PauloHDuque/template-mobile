import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { AuthContextData, LoginCredentials, User } from '../types/auth';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../storage/token.storage';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadStoredSession = async () => {
      try {
        const storedToken = await tokenStorage.getToken();
        const storedUserData = await tokenStorage.getUserData();

        if (!isMounted) return;

        if (storedToken) {
          setToken(storedToken);
          if (storedUserData) {
            try {
              setUser(JSON.parse(storedUserData));
            } catch {
              // Ignore invalid cached user JSON
            }
          }
        }
      } catch (error) {
        console.error('Error loading auth session:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStoredSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      const receivedToken = data.access_token || data.token || '';

      if (receivedToken) {
        await tokenStorage.saveToken(receivedToken);
        setToken(receivedToken);
      }

      const loggedUser: User = data.user || {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
      };

      await tokenStorage.saveUserData(JSON.stringify(loggedUser));
      setUser(loggedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      await tokenStorage.clearAll();
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token || !!user,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
