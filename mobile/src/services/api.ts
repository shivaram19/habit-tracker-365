import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const TOKEN_KEY = 'chromalife_auth_token';

const getToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

const setToken = async (token: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

const removeToken = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers = {}, ...fetchOptions } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (requiresAuth) {
    const token = await getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, requiresAuth = false) =>
    apiRequest<T>(endpoint, { method: 'GET', requiresAuth }),

  post: <T>(endpoint: string, data?: any, requiresAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    }),

  put: <T>(endpoint: string, data?: any, requiresAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    }),

  delete: <T>(endpoint: string, requiresAuth = false) =>
    apiRequest<T>(endpoint, { method: 'DELETE', requiresAuth }),

  setToken,
  getToken,
  removeToken,
};
