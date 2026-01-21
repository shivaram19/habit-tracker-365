import { supabase, isSupabaseConfigured } from './supabase';

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

export interface DayLog {
  date: string;
  hourlyLogs: number[];
  totalSpend: number;
  highlight?: string;
  items?: ListItem[];
}

const DAYS_STORAGE_KEY = 'chromalife-days';
const ITEMS_STORAGE_KEY = 'chromalife_items';

// Local storage helpers
const getLocalDays = (): Record<string, DayLog> => {
  const stored = localStorage.getItem(DAYS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

const setLocalDays = (days: Record<string, DayLog>) => {
  localStorage.setItem(DAYS_STORAGE_KEY, JSON.stringify(days));
};

const getLocalItems = (): ListItem[] => {
  const stored = localStorage.getItem(ITEMS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setLocalItems = (items: ListItem[]) => {
  localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
};

export const logsService = {
  async upsertDay(userId: string, date: string, dayData: Partial<DayLog>): Promise<Day> {
    if (!isSupabaseConfigured || !supabase) {
      const days = getLocalDays();
      const existing = days[date] || { date, hourlyLogs: Array(24).fill(-1), totalSpend: 0 };
      const updated = {
        ...existing,
        ...dayData,
        date,
      };
      days[date] = updated;
      setLocalDays(days);
      return {
        id: date,
        user_id: userId,
        date,
        hourly_logs: updated.hourlyLogs || Array(24).fill(-1),
        total_spend: updated.totalSpend || 0,
        highlight: updated.highlight,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const { data: existingDay } = await supabase
      .from('days')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();

    if (existingDay) {
      const { data, error } = await supabase
        .from('days')
        .update({
          hourly_logs: dayData.hourlyLogs || existingDay.hourly_logs,
          total_spend: dayData.totalSpend !== undefined ? dayData.totalSpend : existingDay.total_spend,
          highlight: dayData.highlight !== undefined ? dayData.highlight : existingDay.highlight,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingDay.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('days')
        .insert({
          user_id: userId,
          date,
          hourly_logs: dayData.hourlyLogs || Array(24).fill(-1),
          total_spend: dayData.totalSpend || 0,
          highlight: dayData.highlight || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async getDay(userId: string, date: string): Promise<(Day & { list_items?: ListItem[] }) | null> {
    if (!isSupabaseConfigured || !supabase) {
      const days = getLocalDays();
      const dayLog = days[date];
      if (!dayLog) return null;
      
      const items = getLocalItems().filter(item => item.date === date);
      return {
        id: date,
        user_id: userId,
        date,
        hourly_logs: dayLog.hourlyLogs || Array(24).fill(-1),
        total_spend: dayLog.totalSpend || 0,
        highlight: dayLog.highlight,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        list_items: items,
      };
    }

    const { data, error } = await supabase
      .from('days')
      .select('*, list_items(*)')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getDaysInRange(userId: string, startDate: string, endDate: string): Promise<Day[]> {
    if (!isSupabaseConfigured || !supabase) {
      const days = getLocalDays();
      return Object.entries(days)
        .filter(([date]) => date >= startDate && date <= endDate)
        .map(([date, dayLog]) => ({
          id: date,
          user_id: userId,
          date,
          hourly_logs: dayLog.hourlyLogs || Array(24).fill(-1),
          total_spend: dayLog.totalSpend || 0,
          highlight: dayLog.highlight,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    const { data, error } = await supabase
      .from('days')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addListItem(
    userId: string, 
    dayId: string, 
    item: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>
  ): Promise<ListItem> {
    if (!isSupabaseConfigured || !supabase) {
      const items = getLocalItems();
      const newItem: ListItem = {
        id: crypto.randomUUID(),
        user_id: userId,
        day_id: dayId,
        category: item.category,
        name: item.name,
        price: item.price,
        date: item.date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      items.push(newItem);
      setLocalItems(items);
      return newItem;
    }

    const { data, error } = await supabase
      .from('list_items')
      .insert({
        user_id: userId,
        day_id: dayId,
        category: item.category,
        name: item.name,
        price: item.price,
        date: item.date,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteListItem(itemId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      const items = getLocalItems();
      setLocalItems(items.filter(item => item.id !== itemId));
      return;
    }

    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  },

  async getListItems(
    userId: string, 
    category?: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<ListItem[]> {
    if (!isSupabaseConfigured || !supabase) {
      let items = getLocalItems().filter(item => item.user_id === userId);
      
      if (category !== undefined) {
        items = items.filter(item => item.category === category);
      }
      if (startDate) {
        items = items.filter(item => item.date >= startDate);
      }
      if (endDate) {
        items = items.filter(item => item.date <= endDate);
      }
      
      return items.sort((a, b) => b.date.localeCompare(a.date));
    }

    let query = supabase
      .from('list_items')
      .select('*')
      .eq('user_id', userId);

    if (category !== undefined) {
      query = query.eq('category', category);
    }

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
