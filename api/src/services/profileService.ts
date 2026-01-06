import pool from '../config/database';

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  theme: string;
  divider_position: number;
  created_at: Date;
  updated_at: Date;
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const result = await pool.query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async createProfile(userId: string): Promise<Profile> {
    const result = await pool.query(
      'INSERT INTO profiles (user_id, theme, divider_position) VALUES ($1, $2, $3) RETURNING *',
      [userId, 'system', 50]
    );
    return result.rows[0];
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.display_name !== undefined) {
      fields.push(`display_name = $${paramIndex++}`);
      values.push(updates.display_name);
    }

    if (updates.avatar_url !== undefined) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(updates.avatar_url);
    }

    if (updates.theme) {
      fields.push(`theme = $${paramIndex++}`);
      values.push(updates.theme);
    }

    if (updates.divider_position !== undefined) {
      fields.push(`divider_position = $${paramIndex++}`);
      values.push(updates.divider_position);
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await pool.query(
      `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Profile not found');
    }

    return result.rows[0];
  },
};
