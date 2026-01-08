import { supabase } from '../config/supabase';

export interface Day {
  id: string;
  user_id: string;
  date: string;
  hourly_logs: number[];
  total_spend: number;
  highlight: string | null;
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

export const logsService = {
  async createDay(userId: string, date: string, hourlyLogs: number[]): Promise<Day> {
    const { data, error } = await supabase
      .from('days')
      .insert({
        user_id: userId,
        date: date,
        hourly_logs: hourlyLogs,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getDay(userId: string, date: string): Promise<Day | null> {
    const { data, error } = await supabase
      .from('days')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getDays(userId: string, startDate?: string, endDate?: string): Promise<Day[]> {
    let query = supabase
      .from('days')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateDay(dayId: string, userId: string, updates: Partial<Day>): Promise<Day> {
    const updateData: any = {};

    if (updates.hourly_logs !== undefined) {
      updateData.hourly_logs = updates.hourly_logs;
    }

    if (updates.highlight !== undefined) {
      updateData.highlight = updates.highlight;
    }

    const { data, error } = await supabase
      .from('days')
      .update(updateData)
      .eq('id', dayId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Day not found');
    }

    return data;
  },

  async deleteDay(dayId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('days')
      .delete()
      .eq('id', dayId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  },

  async createListItem(dayId: string, userId: string, item: {
    category: number;
    name: string;
    price: number;
    date: string;
  }): Promise<ListItem> {
    const { data, error } = await supabase
      .from('list_items')
      .insert({
        day_id: dayId,
        user_id: userId,
        ...item,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async getListItems(dayId: string, userId: string): Promise<ListItem[]> {
    const { data, error } = await supabase
      .from('list_items')
      .select('*')
      .eq('day_id', dayId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateListItem(itemId: string, userId: string, updates: Partial<ListItem>): Promise<ListItem> {
    const updateData: any = {};

    if (updates.category !== undefined) {
      updateData.category = updates.category;
    }

    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }

    if (updates.price !== undefined) {
      updateData.price = updates.price;
    }

    const { data, error } = await supabase
      .from('list_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('List item not found');
    }

    return data;
  },

  async deleteListItem(itemId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
