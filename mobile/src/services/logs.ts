import { api } from './api';
import { Day, ListItem, DayLog } from '@/types';

export const logsService = {
  async upsertDay(userId: string, date: string, dayData: Partial<DayLog>) {
    const response = await api.post<Day>('/days/upsert', {
      date,
      hourly_logs: dayData.hourlyLogs,
      total_spend: dayData.totalSpend,
      highlight: dayData.highlight,
    }, true);

    return response;
  },

  async getDay(userId: string, date: string) {
    const response = await api.get<Day>(`/days/${date}`, true);
    return response;
  },

  async getDaysInRange(userId: string, startDate: string, endDate: string) {
    const response = await api.get<Day[]>(
      `/days?start_date=${startDate}&end_date=${endDate}`,
      true
    );
    return response || [];
  },

  async addListItem(userId: string, dayId: string, item: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>) {
    const response = await api.post<ListItem>('/list-items', {
      day_id: dayId,
      category: item.category,
      name: item.name,
      price: item.price,
      date: item.date,
    }, true);

    return response;
  },

  async deleteListItem(itemId: string) {
    await api.delete(`/list-items/${itemId}`, true);
  },

  async getListItems(userId: string, category?: number, startDate?: string, endDate?: string) {
    let url = '/list-items?';
    if (category !== undefined) url += `category=${category}&`;
    if (startDate) url += `start_date=${startDate}&`;
    if (endDate) url += `end_date=${endDate}&`;

    const response = await api.get<ListItem[]>(url, true);
    return response || [];
  },
};
