import pool from '../config/database';

export interface Stats {
  total_logs: number;
  categories_breakdown: Record<string, number>;
  logs_by_month: Array<{ month: string; count: number }>;
  top_items: Array<{ item_id: string; category: string; count: number }>;
}

export const statsService = {
  async getStats(userId: string, year?: number): Promise<Stats> {
    let yearFilter = '';
    const params: any[] = [userId];

    if (year) {
      params.push(year);
      yearFilter = `AND EXTRACT(YEAR FROM logged_at) = $${params.length}`;
    }

    const totalLogsResult = await pool.query(
      `SELECT COUNT(*) as count FROM logs WHERE user_id = $1 ${yearFilter}`,
      params
    );

    const categoriesResult = await pool.query(
      `SELECT category, COUNT(*) as count FROM logs WHERE user_id = $1 ${yearFilter} GROUP BY category`,
      params
    );

    const monthsResult = await pool.query(
      `SELECT TO_CHAR(logged_at, 'YYYY-MM') as month, COUNT(*) as count
       FROM logs
       WHERE user_id = $1 ${yearFilter}
       GROUP BY month
       ORDER BY month`,
      params
    );

    const topItemsResult = await pool.query(
      `SELECT item_id, category, COUNT(*) as count
       FROM logs
       WHERE user_id = $1 ${yearFilter}
       GROUP BY item_id, category
       ORDER BY count DESC
       LIMIT 10`,
      params
    );

    const categoriesBreakdown: Record<string, number> = {};
    categoriesResult.rows.forEach(row => {
      categoriesBreakdown[row.category] = parseInt(row.count);
    });

    return {
      total_logs: parseInt(totalLogsResult.rows[0].count),
      categories_breakdown: categoriesBreakdown,
      logs_by_month: monthsResult.rows.map(row => ({
        month: row.month,
        count: parseInt(row.count),
      })),
      top_items: topItemsResult.rows.map(row => ({
        item_id: row.item_id,
        category: row.category,
        count: parseInt(row.count),
      })),
    };
  },
};
