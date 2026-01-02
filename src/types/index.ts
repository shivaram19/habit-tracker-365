export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Day {
  id: string;
  user_id: string;
  date: string;
  hourly_logs: number[];
  total_spend: number;
  highlight?: string;
  created_at: string;
  updated_at: string;
}

export interface ListItem {
  id: string;
  day_id: string;
  user_id: string;
  category: number;
  name: string;
  price: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  requiresSpending: boolean;
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

export interface DayLog {
  date: string;
  hourlyLogs: number[];
  totalSpend: number;
  highlight?: string;
  items?: ListItem[];
}
