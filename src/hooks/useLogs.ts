import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logsService } from '@/services/logs';
import { useAuth } from '@/context/AuthContext';
import { DayLog } from '@/types';

export const useDayLog = (date: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['day', user?.id, date],
    queryFn: () => logsService.getDay(user!.id, date),
    enabled: !!user,
  });
};

export const useDaysRange = (startDate: string, endDate: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['days', user?.id, startDate, endDate],
    queryFn: () => logsService.getDaysInRange(user!.id, startDate, endDate),
    enabled: !!user,
  });
};

export const useUpsertDay = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { date: string; dayData: Partial<DayLog> }) =>
      logsService.upsertDay(user!.id, variables.date, variables.dayData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['day', user?.id, variables.date] });
      queryClient.invalidateQueries({ queryKey: ['days', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wrapped'] });
    },
  });
};

export const useAddListItem = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { dayId: string; item: any }) =>
      logsService.addListItem(user!.id, variables.dayId, variables.item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['day', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['list-items', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wrapped'] });
    },
  });
};

export const useListItems = (category?: number, startDate?: string, endDate?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['list-items', user?.id, category, startDate, endDate],
    queryFn: () => logsService.getListItems(user!.id, category, startDate, endDate),
    enabled: !!user,
  });
};
