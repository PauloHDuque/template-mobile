import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../app/(auth)/login';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { authService } from '../../src/services/auth.service';

describe('Login Screen E2E User Flow (test/e2e)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login screen properly with inputs and submit button', async () => {
    const { getByTestId, getByText } = await render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>,
    );

    expect(getByText('Template Mobile')).toBeTruthy();
    expect(getByTestId('input-email')).toBeTruthy();
    expect(getByTestId('input-password')).toBeTruthy();
    expect(getByTestId('button-submit')).toBeTruthy();
  });

  it('displays validation message when fields are empty', async () => {
    const { getByTestId, getByText } = await render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>,
    );

    await fireEvent.press(getByTestId('button-submit'));

    await waitFor(() => {
      expect(getByText('Por favor, preencha todos os campos.')).toBeTruthy();
    });
  });

  it('authenticates user and handles backend response on valid credentials', async () => {
    jest.spyOn(authService, 'login').mockResolvedValueOnce({
      access_token: 'mocked-e2e-token',
      user: { id: 1, email: 'admin@template.com' },
      message: 'Authentication successful',
    });

    const { getByTestId, queryByTestId } = await render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>,
    );

    await fireEvent.changeText(getByTestId('input-email'), 'admin@template.com');
    await fireEvent.changeText(getByTestId('input-password'), 'password123');
    await fireEvent.press(getByTestId('button-submit'));

    await waitFor(() => {
      expect(queryByTestId('error-banner')).toBeNull();
    });
  });

  it('displays error banner when authentication fails', async () => {
    jest.spyOn(authService, 'login').mockRejectedValueOnce({
      response: {
        data: { message: 'Invalid email or password.' },
      },
    });

    const { getByTestId, getByText } = await render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>,
    );

    await fireEvent.changeText(getByTestId('input-email'), 'wrong@template.com');
    await fireEvent.changeText(getByTestId('input-password'), 'wrongpass');
    await fireEvent.press(getByTestId('button-submit'));

    await waitFor(() => {
      expect(getByTestId('error-banner')).toBeTruthy();
      expect(getByText('Invalid email or password.')).toBeTruthy();
    });
  });
});
