import { supabase } from '../config/supabase';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export const authService = {
  async signup(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Signup failed');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
      })
      .select()
      .single();

    if (profileError && profileError.code !== '23505') {
      console.error('Profile creation error:', profileError);
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      },
      token: data.session.access_token,
    };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('Invalid credentials');
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      },
      token: data.session.access_token,
    };
  },

  async getUser(userId: string): Promise<User> {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !data.user) {
      throw new Error('User not found');
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    };
  },

  async verifyToken(token: string): Promise<User> {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error('Invalid token');
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      created_at: data.user.created_at,
    };
  },
};
