import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { authService } from '../../src/services/auth.service';
import { tokenStorage } from '../../src/storage/token.storage';

describe('Auth Flow Integration (test/integration)', () => {
  beforeEach(async () => {
    await tokenStorage.clearAll();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should initialize unauthenticated and login successfully updating storage', async () => {
    jest.spyOn(authService, 'login').mockResolvedValueOnce({
      access_token: 'valid-jwt-token-xyz',
      user: { id: 'user-1', email: 'mobile@developer.com', name: 'Mobile Dev' },
      message: 'Authentication successful',
    });

    const { result } = await renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();

    await act(async () => {
      await result.current.login({
        email: 'mobile@developer.com',
        password: 'securepassword',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('valid-jwt-token-xyz');
    expect(result.current.user?.email).toBe('mobile@developer.com');

    // Verify token persisted in secure store wrapper
    const savedToken = await tokenStorage.getToken();
    expect(savedToken).toBe('valid-jwt-token-xyz');
  });

  it('should clear token and user on logout', async () => {
    await tokenStorage.saveToken('existing-token');
    await tokenStorage.saveUserData(JSON.stringify({ id: '2', email: 'logged@test.com' }));
    jest.spyOn(authService, 'logout').mockResolvedValueOnce();

    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();

    const tokenAfterLogout = await tokenStorage.getToken();
    expect(tokenAfterLogout).toBeNull();
  });
});
