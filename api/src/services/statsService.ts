import { supabase } from '../config/supabase';

export interface Stats {
  total_days: number;
  total_items: number;
  total_spend: number;
  categories_breakdown: Record<number, { count: number; total: number }>;
  spending_by_month: Array<{ month: string; total: number; count: number }>;
  top_items: Array<{ name: string; category: number; count: number; total: number }>;
}

export const statsService = {
  async getStats(userId: string, year?: number): Promise<Stats> {
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (year) {
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    }

    let daysQuery = supabase
      .from('days')
      .select('id, date, total_spend')
      .eq('user_id', userId);

    if (startDate && endDate) {
      daysQuery = daysQuery.gte('date', startDate).lte('date', endDate);
    }

    const { data: days, error: daysError } = await daysQuery;

    if (daysError) {
      throw new Error(daysError.message);
    }

    let itemsQuery = supabase
      .from('list_items')
      .select('name, category, price, date')
      .eq('user_id', userId);

    if (startDate && endDate) {
      itemsQuery = itemsQuery.gte('date', startDate).lte('date', endDate);
    }

    const { data: items, error: itemsError } = await itemsQuery;

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    const totalSpend = days.reduce((sum, day) => sum + Number(day.total_spend), 0);

    const categoriesBreakdown: Record<number, { count: number; total: number }> = {};
    items.forEach(item => {
      if (!categoriesBreakdown[item.category]) {
        categoriesBreakdown[item.category] = { count: 0, total: 0 };
      }
      categoriesBreakdown[item.category].count++;
      categoriesBreakdown[item.category].total += Number(item.price);
    });

    const spendingByMonth: Record<string, { total: number; count: number }> = {};
    items.forEach(item => {
      const month = item.date.substring(0, 7);
      if (!spendingByMonth[month]) {
        spendingByMonth[month] = { total: 0, count: 0 };
      }
      spendingByMonth[month].total += Number(item.price);
      spendingByMonth[month].count++;
    });

    const itemCounts: Record<string, { name: string; category: number; count: number; total: number }> = {};
    items.forEach(item => {
      const key = `${item.name}-${item.category}`;
      if (!itemCounts[key]) {
        itemCounts[key] = { name: item.name, category: item.category, count: 0, total: 0 };
      }
      itemCounts[key].count++;
      itemCounts[key].total += Number(item.price);
    });

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total_days: days.length,
      total_items: items.length,
      total_spend: totalSpend,
      categories_breakdown: categoriesBreakdown,
      spending_by_month: Object.entries(spendingByMonth)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      top_items: topItems,
    };
  },
};
