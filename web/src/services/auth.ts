import { supabase, isSupabaseConfigured } from './supabase';

const TOKEN_KEY = 'chromalife_auth_token';
const USER_KEY = 'chromalife_user';

// Demo user for when Supabase is not configured
const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@chromalife.app',
  name: 'Demo User',
};

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthSession {
  access_token: string;
  user: AuthUser;
}

export const authService = {
  async signup(email: string, password: string, name?: string): Promise<{ user: AuthUser; session: AuthSession }> {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode - simulate signup
      const user = { id: crypto.randomUUID(), email, name: name || '' };
      const session = { access_token: 'demo-token', user };
      localStorage.setItem(TOKEN_KEY, session.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { user, session };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || '' },
      },
    });

    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Signup failed');

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email: data.user.email!,
      name: name || null,
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name: name || '',
    };

    return {
      user,
      session: { access_token: data.session.access_token, user },
    };
  },

  async login(email: string, password: string): Promise<{ user: AuthUser; session: AuthSession }> {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode - simulate login
      const user = { ...DEMO_USER, email };
      const session = { access_token: 'demo-token', user };
      localStorage.setItem(TOKEN_KEY, session.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { user, session };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Login failed');

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || '',
    };

    return {
      user,
      session: { access_token: data.session.access_token, user },
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    // Check localStorage first (for demo mode)
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || '',
    };
  },

  async getSession(): Promise<AuthSession | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (token && storedUser) {
      return { access_token: token, user: JSON.parse(storedUser) };
    }

    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    return {
      access_token: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name || '',
      },
    };
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
