import { supabase } from './supabase';

export interface Profile {
  id: string;
  name: string;
  divider_position: number;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProfile(userId: string, name: string = '') {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: { name?: string; divider_position?: number }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDividerPosition(userId: string, position: number) {
    const { error } = await supabase
      .from('profiles')
      .update({ divider_position: position })
      .eq('id', userId);

    if (error) throw error;
  },

  async ensureProfile(userId: string) {
    let profile = await this.getProfile(userId);

    if (!profile) {
      profile = await this.createProfile(userId);
    }

    return profile;
  },
};
