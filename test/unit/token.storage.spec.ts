import { tokenStorage, TOKEN_KEY, USER_KEY } from '../../src/storage/token.storage';
import * as SecureStore from 'expo-secure-store';

describe('tokenStorage (unit)', () => {
  beforeEach(async () => {
    await tokenStorage.clearAll();
  });

  it('should conform to expo-secure-store key constraints (^[a-zA-Z0-9_.-]+$)', () => {
    const validKeyRegex = /^[a-zA-Z0-9_.-]+$/;
    expect(validKeyRegex.test(TOKEN_KEY)).toBe(true);
    expect(validKeyRegex.test(USER_KEY)).toBe(true);
    expect(TOKEN_KEY).not.toContain('@');
    expect(TOKEN_KEY).not.toContain(':');
    expect(USER_KEY).not.toContain('@');
    expect(USER_KEY).not.toContain(':');
  });

  it('should save and retrieve token correctly', async () => {
    await tokenStorage.saveToken('jwt-sample-token-123');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(TOKEN_KEY, 'jwt-sample-token-123');

    const retrieved = await tokenStorage.getToken();
    expect(retrieved).toBe('jwt-sample-token-123');
  });

  it('should remove token correctly', async () => {
    await tokenStorage.saveToken('jwt-sample-token-123');
    await tokenStorage.removeToken();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
    const retrieved = await tokenStorage.getToken();
    expect(retrieved).toBeNull();
  });

  it('should save and retrieve user data correctly', async () => {
    const userData = JSON.stringify({ id: 1, email: 'user@example.com' });
    await tokenStorage.saveUserData(userData);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(USER_KEY, userData);
    const retrieved = await tokenStorage.getUserData();
    expect(retrieved).toBe(userData);
  });

  it('should clear all data on clearAll()', async () => {
    await tokenStorage.saveToken('token-to-delete');
    await tokenStorage.saveUserData('user-to-delete');

    await tokenStorage.clearAll();

    const token = await tokenStorage.getToken();
    const user = await tokenStorage.getUserData();

    expect(token).toBeNull();
    expect(user).toBeNull();
  });
});
