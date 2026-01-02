import { supabase } from './supabase';
import { Day, ListItem, DayLog } from '@/types';

export const logsService = {
  async upsertDay(userId: string, date: string, dayData: Partial<DayLog>) {
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

  async getDay(userId: string, date: string) {
    const { data, error } = await supabase
      .from('days')
      .select('*, list_items(*)')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getDaysInRange(userId: string, startDate: string, endDate: string) {
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

  async addListItem(userId: string, dayId: string, item: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>) {
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

  async deleteListItem(itemId: string) {
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  },

  async getListItems(userId: string, category?: number, startDate?: string, endDate?: string) {
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
