import { api } from './api';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async signup(email: string, password: string, name?: string) {
    const response = await api.post<AuthResponse>('/auth/signup', {
      email,
      password,
    });

    await api.setToken(response.token);

    return {
      user: response.user,
      token: response.token,
    };
  },

  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    await api.setToken(response.token);

    return {
      user: response.user,
      token: response.token,
    };
  },

  async logout() {
    await api.removeToken();
  },

  async getCurrentUser() {
    const token = await api.getToken();
    if (!token) return null;

    try {
      const response = await api.get<{ user: User }>('/auth/me', true);
      return response.user;
    } catch (error) {
      await api.removeToken();
      return null;
    }
  },

  async getStoredToken() {
    return await api.getToken();
  },
};
