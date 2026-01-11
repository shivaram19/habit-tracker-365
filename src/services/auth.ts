import { supabase } from './supabase';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'chromalife_auth_token';

// Cross-platform storage helper functions
async function saveToken(token: string) {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
}

async function getToken() {
  try {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

async function deleteToken() {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error deleting token:', error);
    throw error;
  }
}

export const authService = {
  async signup(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    if (error) throw error;

    if (data.user && data.session) {
      await saveToken(data.session.access_token);

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        name: name || null,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }
    }

    return { user: data.user, session: data.session };
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      await saveToken(data.session.access_token);
    }

    return { user: data.user, session: data.session };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();

    try {
      await deleteToken();
    } catch (err) {
      console.error('Failed to delete stored token:', err);
    }

    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async refreshSession() {
    const { data: { session }, error } = await supabase.auth.refreshSession();

    if (error) throw error;

    if (session) {
      await saveToken(session.access_token);
    }

    return session;
  },

  async getStoredToken() {
    return await getToken();
  },
};
