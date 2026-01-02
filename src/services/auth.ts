import { supabase } from './supabase';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'chromalife_auth_token';

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
      await SecureStore.setItemAsync(TOKEN_KEY, data.session.access_token);

      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email!,
        name: name || null,
      });
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
      await SecureStore.setItemAsync(TOKEN_KEY, data.session.access_token);
    }

    return { user: data.user, session: data.session };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    await SecureStore.deleteItemAsync(TOKEN_KEY);

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
      await SecureStore.setItemAsync(TOKEN_KEY, session.access_token);
    }

    return session;
  },

  async getStoredToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },
};
