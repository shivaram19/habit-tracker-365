import { logsService } from './logs';

export interface CategoryStats {
  id: number;
  name: string;
  color: string;
  hours: number;
  percentage: number;
}

export interface TopItem {
  name: string;
  count: number;
  totalSpend: number;
}

export interface MonthlySpending {
  month: string;
  total: number;
}

export interface WrappedStats {
  year: number;
  totalHours: number;
  categories: CategoryStats[];
  topItems: {
    food: TopItem[];
    shopping: TopItem[];
  };
  streaks: {
    longestWorkStreak: number;
    longestExerciseStreak: number;
  };
  monthlySpending: MonthlySpending[];
}

const CATEGORIES = [
  { id: 0, name: 'Sleep', color: '#6366f1' },
  { id: 1, name: 'Work', color: '#22c55e' },
  { id: 2, name: 'Exercise', color: '#f97316' },
  { id: 3, name: 'Food', color: '#eab308' },
  { id: 4, name: 'Shopping', color: '#ec4899' },
  { id: 5, name: 'Entertainment', color: '#8b5cf6' },
  { id: 6, name: 'Social', color: '#06b6d4' },
  { id: 7, name: 'Travel', color: '#14b8a6' },
  { id: 8, name: 'Other', color: '#64748b' },
];

export const statsService = {
  async getYearlyStats(userId: string, year: number): Promise<WrappedStats> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const days = await logsService.getDaysInRange(userId, startDate, endDate);
    const listItems = await logsService.getListItems(userId, undefined, startDate, endDate);

    // Calculate category hours
    const categoryHours: Record<number, number> = {};
    days.forEach(day => {
      day.hourly_logs.forEach(categoryId => {
        if (categoryId >= 0) {
          categoryHours[categoryId] = (categoryHours[categoryId] || 0) + 1;
        }
      });
    });

    const totalHours = Object.values(categoryHours).reduce((sum, h) => sum + h, 0);

    const categories: CategoryStats[] = CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      hours: categoryHours[cat.id] || 0,
      percentage: totalHours > 0 ? ((categoryHours[cat.id] || 0) / totalHours) * 100 : 0,
    })).filter(cat => cat.hours > 0);

    // Calculate top items for food (category 3) and shopping (category 4)
    const foodItems = listItems.filter(item => item.category === 3);
    const shoppingItems = listItems.filter(item => item.category === 4);

    const aggregateItems = (items: typeof listItems): TopItem[] => {
      const map: Record<string, { count: number; totalSpend: number }> = {};
      items.forEach(item => {
        const name = item.name.toLowerCase().trim();
        if (!map[name]) {
          map[name] = { count: 0, totalSpend: 0 };
        }
        map[name].count += 1;
        map[name].totalSpend += item.price || 0;
      });
      return Object.entries(map)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    };

    // Calculate streaks
    const calculateStreak = (categoryId: number): number => {
      let maxStreak = 0;
      let currentStreak = 0;
      
      days.forEach(day => {
        const hasCategory = day.hourly_logs.includes(categoryId);
        if (hasCategory) {
          currentStreak += 1;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      return maxStreak;
    };

    // Calculate monthly spending
    const monthlySpending: MonthlySpending[] = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const monthItems = listItems.filter(item => item.date.startsWith(`${year}-${monthStr}`));
      const total = monthItems.reduce((sum, item) => sum + (item.price || 0), 0);
      monthlySpending.push({
        month: new Date(year, month - 1).toLocaleString('default', { month: 'short' }),
        total,
      });
    }

    return {
      year,
      totalHours,
      categories,
      topItems: {
        food: aggregateItems(foodItems),
        shopping: aggregateItems(shoppingItems),
      },
      streaks: {
        longestWorkStreak: calculateStreak(1), // Work
        longestExerciseStreak: calculateStreak(2), // Exercise
      },
      monthlySpending,
    };
  },
};
