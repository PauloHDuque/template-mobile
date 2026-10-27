import { api } from './api';
import { AuthResponse, LoginCredentials, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);

    let token = response.data?.access_token || response.data?.token;

    // Check Set-Cookie headers for cookie-based backends (e.g. template-backend-nest)
    if (!token && response.headers) {
      const setCookie = response.headers['set-cookie'];
      if (Array.isArray(setCookie)) {
        for (const cookieStr of setCookie) {
          const match = /access_token=([^;]+)/.exec(cookieStr);
          if (match) {
            token = match[1];
            break;
          }
        }
      } else if (typeof setCookie === 'string') {
        const match = /access_token=([^;]+)/.exec(setCookie);
        if (match) {
          token = match[1];
        }
      }
    }

    return {
      access_token: token,
      token,
      message: response.data?.message || 'Authentication successful',
      user: response.data?.user,
    };
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network / endpoint 404 errors during logout
    }
  },
};
