import { api } from './api';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  divider_position: number;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(userId: string) {
    const response = await api.get<Profile>('/profile', true);
    return response;
  },

  async createProfile(userId: string, name: string = '') {
    const response = await api.post<Profile>('/profile', { name }, true);
    return response;
  },

  async updateProfile(userId: string, updates: { name?: string; divider_position?: number }) {
    const response = await api.put<Profile>('/profile', updates, true);
    return response;
  },

  async updateDividerPosition(userId: string, position: number) {
    await api.put('/profile', { divider_position: position }, true);
  },

  async ensureProfile(userId: string) {
    try {
      const profile = await this.getProfile(userId);
      return profile;
    } catch (error) {
      return await this.createProfile(userId);
    }
  },
};
