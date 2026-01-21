import { supabase, isSupabaseConfigured } from './supabase';

export interface Profile {
  id: string;
  name: string;
  divider_position: number;
  created_at: string;
  updated_at: string;
}

const PROFILE_STORAGE_KEY = 'chromalife_profile';

// Local storage fallback for demo mode
const getLocalProfile = (): Profile | null => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const setLocalProfile = (profile: Profile) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalProfile();
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProfile(userId: string, name: string = ''): Promise<Profile> {
    if (!isSupabaseConfigured || !supabase) {
      const profile: Profile = {
        id: userId,
        name,
        divider_position: 0.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalProfile(profile);
      return profile;
    }

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

  async updateProfile(userId: string, updates: { name?: string; divider_position?: number }): Promise<Profile> {
    if (!isSupabaseConfigured || !supabase) {
      const profile = getLocalProfile();
      if (profile) {
        const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
        setLocalProfile(updated);
        return updated;
      }
      throw new Error('Profile not found');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDividerPosition(userId: string, position: number): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      const profile = getLocalProfile();
      if (profile) {
        setLocalProfile({ ...profile, divider_position: position, updated_at: new Date().toISOString() });
      }
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ divider_position: position })
      .eq('id', userId);

    if (error) throw error;
  },

  async ensureProfile(userId: string): Promise<Profile> {
    let profile = await this.getProfile(userId);

    if (!profile) {
      profile = await this.createProfile(userId);
    }

    return profile;
  },
};
