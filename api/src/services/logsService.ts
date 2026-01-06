import pool from '../config/database';

export interface Log {
  id: string;
  user_id: string;
  item_id: string;
  category: string;
  logged_at: Date;
  notes?: string;
}

export const logsService = {
  async createLog(userId: string, itemId: string, category: string, loggedAt: Date, notes?: string): Promise<Log> {
    const result = await pool.query(
      'INSERT INTO logs (user_id, item_id, category, logged_at, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, itemId, category, loggedAt, notes]
    );
    return result.rows[0];
  },

  async getLogs(userId: string, startDate?: Date, endDate?: Date): Promise<Log[]> {
    let query = 'SELECT * FROM logs WHERE user_id = $1';
    const params: any[] = [userId];

    if (startDate) {
      params.push(startDate);
      query += ` AND logged_at >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      query += ` AND logged_at <= $${params.length}`;
    }

    query += ' ORDER BY logged_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async updateLog(logId: string, userId: string, updates: Partial<Log>): Promise<Log> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.category) {
      fields.push(`category = $${paramIndex++}`);
      values.push(updates.category);
    }

    if (updates.logged_at) {
      fields.push(`logged_at = $${paramIndex++}`);
      values.push(updates.logged_at);
    }

    if (updates.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      values.push(updates.notes);
    }

    values.push(logId, userId);

    const result = await pool.query(
      `UPDATE logs SET ${fields.join(', ')} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Log not found');
    }

    return result.rows[0];
  },

  async deleteLog(logId: string, userId: string): Promise<void> {
    const result = await pool.query(
      'DELETE FROM logs WHERE id = $1 AND user_id = $2',
      [logId, userId]
    );

    if (result.rowCount === 0) {
      throw new Error('Log not found');
    }
  },
};
