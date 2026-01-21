import { useQuery } from '@tanstack/react-query';
import { statsService, WrappedStats } from '../services/stats';
import { useAuth } from '../context/AuthContext';

export const useStats = () => {
  const { user } = useAuth();

  const useYearlyStats = (year: number) => {
    return useQuery({
      queryKey: ['stats', user?.id, year],
      queryFn: () => user ? statsService.getYearlyStats(user.id, year) : Promise.resolve(null),
      enabled: !!user,
    });
  };

  return {
    useYearlyStats,
  };
};

export type { WrappedStats };
