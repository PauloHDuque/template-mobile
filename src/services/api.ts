import axios from 'axios';
import { Platform } from 'react-native';
import { tokenStorage } from '../storage/token.storage';

export const getBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android emulator maps 10.0.2.2 to host machine's localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers = config.headers || {};
      // Support standard Bearer tokens
      config.headers.Authorization = `Bearer ${token}`;
      // Support backend cookie strategy (template-backend-nest)
      config.headers.Cookie = `access_token=${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenStorage.clearAll();
    }
    return Promise.reject(error);
  },
);
