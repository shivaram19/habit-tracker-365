import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/stats';
import { useAuth } from '@/context/AuthContext';

export const useAvailableYears = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-years', user?.id],
    queryFn: () => statsService.getAvailableYears(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

export const useWrappedStats = (year: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wrapped', user?.id, year],
    queryFn: () => statsService.getWrappedStats(user!.id, year),
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
  });
};

export const useMonthlySpending = (month: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['monthly-spending', user?.id, month],
    queryFn: () => statsService.getMonthlySpending(user!.id, month),
    enabled: !!user,
  });
};
