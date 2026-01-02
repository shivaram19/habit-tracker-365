import { supabase } from './supabase';
import { WrappedStats, CategoryStats, TopItem, MonthlySpending } from '@/types';
import { CATEGORIES } from '@/utils/categories';
import { format, startOfYear, endOfYear } from 'date-fns';

export const statsService = {
  async getAvailableYears(userId: string): Promise<number[]> {
    const { data: days } = await supabase
      .from('days')
      .select('date')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!days || days.length === 0) {
      return [new Date().getFullYear()];
    }

    const years = new Set<number>();
    days.forEach(day => {
      const year = new Date(day.date).getFullYear();
      years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a);
  },

  async getWrappedStats(userId: string, year: number): Promise<WrappedStats> {
    const startDate = format(startOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');
    const endDate = format(endOfYear(new Date(year, 0, 1)), 'yyyy-MM-dd');

    const { data: days } = await supabase
      .from('days')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    const { data: items } = await supabase
      .from('list_items')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    const categoryCounts: Record<number, number> = {};
    let totalHours = 0;

    CATEGORIES.forEach(cat => {
      categoryCounts[cat.id] = 0;
    });
    categoryCounts[-1] = 0;

    days?.forEach(day => {
      const hourlyLogs = day.hourly_logs || [];
      hourlyLogs.forEach((categoryId: number) => {
        if (categoryId !== -1) {
          categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
          totalHours++;
        }
      });
    });

    const categoryStats: CategoryStats[] = CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      hours: categoryCounts[cat.id] || 0,
      percentage: totalHours > 0 ? (categoryCounts[cat.id] / totalHours) * 100 : 0,
    })).sort((a, b) => b.hours - a.hours);

    const foodItems: Record<string, TopItem> = {};
    const shoppingItems: Record<string, TopItem> = {};

    items?.forEach(item => {
      if (item.category === 4) {
        if (!foodItems[item.name]) {
          foodItems[item.name] = { name: item.name, count: 0, totalSpend: 0 };
        }
        foodItems[item.name].count++;
        foodItems[item.name].totalSpend += Number(item.price);
      } else if (item.category === 9) {
        if (!shoppingItems[item.name]) {
          shoppingItems[item.name] = { name: item.name, count: 0, totalSpend: 0 };
        }
        shoppingItems[item.name].count++;
        shoppingItems[item.name].totalSpend += Number(item.price);
      }
    });

    const topFood = Object.values(foodItems)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topShopping = Object.values(shoppingItems)
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 10);

    const monthlySpending: MonthlySpending[] = [];
    for (let month = 0; month < 12; month++) {
      const monthStr = format(new Date(year, month, 1), 'yyyy-MM');
      const monthTotal = days
        ?.filter(day => day.date.startsWith(monthStr))
        .reduce((sum, day) => sum + Number(day.total_spend || 0), 0) || 0;

      monthlySpending.push({ month: monthStr, total: monthTotal });
    }

    const workStreak = calculateStreak(days || [], 1);
    const exerciseStreak = calculateStreak(days || [], 3);

    return {
      year,
      totalHours,
      categories: categoryStats,
      topItems: {
        food: topFood,
        shopping: topShopping,
      },
      streaks: {
        longestWorkStreak: workStreak,
        longestExerciseStreak: exerciseStreak,
      },
      monthlySpending,
    };
  },

  async getMonthlySpending(userId: string, month: string) {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const { data: days } = await supabase
      .from('days')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    const total = days?.reduce((sum, day) => sum + Number(day.total_spend || 0), 0) || 0;

    const categorySpending: Record<number, number> = {};
    days?.forEach(day => {
      const hourlyLogs = day.hourly_logs || [];
      const dailySpend = Number(day.total_spend || 0);
      const hoursPerCategory: Record<number, number> = {};

      hourlyLogs.forEach((catId: number) => {
        if (catId !== -1) {
          hoursPerCategory[catId] = (hoursPerCategory[catId] || 0) + 1;
        }
      });

      const totalHours = Object.values(hoursPerCategory).reduce((a, b) => a + b, 0);

      Object.entries(hoursPerCategory).forEach(([catId, hours]) => {
        const proportion = hours / totalHours;
        categorySpending[Number(catId)] = (categorySpending[Number(catId)] || 0) + (dailySpend * proportion);
      });
    });

    const byCategory = CATEGORIES
      .filter(cat => cat.requiresSpending)
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        total: categorySpending[cat.id] || 0,
        percentage: total > 0 ? ((categorySpending[cat.id] || 0) / total) * 100 : 0,
      }))
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total);

    return {
      month,
      total,
      byCategory,
    };
  },
};

function calculateStreak(days: any[], categoryId: number): number {
  const sortedDays = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let maxStreak = 0;
  let currentStreak = 0;

  sortedDays.forEach(day => {
    const hasCategory = (day.hourly_logs || []).includes(categoryId);

    if (hasCategory) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return maxStreak;
}
