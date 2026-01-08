import { supabase } from '../config/supabase';

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  timezone: string | null;
  divider_position: number;
  theme_preference: string;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async createProfile(userId: string, email: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        theme_preference: 'system',
        divider_position: 50,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const updateData: any = {};

    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }

    if (updates.timezone !== undefined) {
      updateData.timezone = updates.timezone;
    }

    if (updates.theme_preference !== undefined) {
      updateData.theme_preference = updates.theme_preference;
    }

    if (updates.divider_position !== undefined) {
      updateData.divider_position = updates.divider_position;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Profile not found');
    }

    return data;
  },
};
