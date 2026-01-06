import { api } from './api';
import { WrappedStats } from '@/types';

export const statsService = {
  async getAvailableYears(userId: string): Promise<number[]> {
    const response = await api.get<{ years: number[] }>('/stats/years', true);
    return response.years || [new Date().getFullYear()];
  },

  async getWrappedStats(userId: string, year: number): Promise<WrappedStats> {
    const response = await api.get<WrappedStats>(`/stats/wrapped?year=${year}`, true);
    return response;
  },

  async getMonthlySpending(userId: string, month: string) {
    const response = await api.get<any>(`/stats/monthly?month=${month}`, true);
    return response;
  },
};
