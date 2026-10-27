import { authService } from '../../src/services/auth.service';
import { api } from '../../src/services/api';

describe('authService (unit)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should extract access_token from response body', async () => {
    jest.spyOn(api, 'post').mockResolvedValueOnce({
      data: { access_token: 'body-jwt-token-123' },
      headers: {},
    });

    const result = await authService.login({
      email: 'test@example.com',
      password: 'secretpassword',
    });

    expect(result.access_token).toBe('body-jwt-token-123');
  });

  it('should extract token from Set-Cookie header if not in response body (template-backend-nest support)', async () => {
    jest.spyOn(api, 'post').mockResolvedValueOnce({
      data: { message: 'Authentication successful' },
      headers: {
        'set-cookie': ['access_token=cookie-jwt-token-xyz; Path=/; HttpOnly; SameSite=Lax'],
      },
    });

    const result = await authService.login({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(result.access_token).toBe('cookie-jwt-token-xyz');
    expect(result.message).toBe('Authentication successful');
  });

  it('should call api.post on logout', async () => {
    const postSpy = jest.spyOn(api, 'post').mockResolvedValueOnce({ data: {} });

    await authService.logout();

    expect(postSpy).toHaveBeenCalledWith('/auth/logout');
  });
});
