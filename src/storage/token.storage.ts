import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// expo-secure-store enforces key regex: ^[a-zA-Z0-9_.-]+$
// Do NOT use characters like '@' or ':' to prevent native platform exceptions
export const TOKEN_KEY = 'template_auth_token';
export const USER_KEY = 'template_user_data';

const memoryFallback = new Map<string, string>();

export const tokenStorage = {
  async saveToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        return;
      }
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch {
      memoryFallback.set(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return memoryFallback.get(TOKEN_KEY) ?? null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        return;
      }
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      memoryFallback.delete(TOKEN_KEY);
    }
  },

  async saveUserData(userData: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem(USER_KEY, userData);
        return;
      }
      await SecureStore.setItemAsync(USER_KEY, userData);
    } catch {
      memoryFallback.set(USER_KEY, userData);
    }
  },

  async getUserData(): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(USER_KEY);
      }
      return await SecureStore.getItemAsync(USER_KEY);
    } catch {
      return memoryFallback.get(USER_KEY) ?? null;
    }
  },

  async clearAll(): Promise<void> {
    await this.removeToken();
    try {
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(USER_KEY);
      } else {
        await SecureStore.deleteItemAsync(USER_KEY);
      }
    } catch {
      memoryFallback.delete(USER_KEY);
    }
    memoryFallback.clear();
  },
};
