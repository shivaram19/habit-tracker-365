import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logsService } from '../services/logs';
import type { Day, ListItem, DayLog } from '../services/logs';
import { useAuth } from '../context/AuthContext';

export const useLogs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const useDay = (date: string) => {
    return useQuery({
      queryKey: ['day', user?.id, date],
      queryFn: () => user ? logsService.getDay(user.id, date) : Promise.resolve(null),
      enabled: !!user && !!date,
    });
  };

  const useDaysInRange = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ['days', user?.id, startDate, endDate],
      queryFn: () => user ? logsService.getDaysInRange(user.id, startDate, endDate) : Promise.resolve([]),
      enabled: !!user && !!startDate && !!endDate,
    });
  };

  const upsertDayMutation = useMutation({
    mutationFn: ({ date, dayData }: { date: string; dayData: Partial<DayLog> }) => {
      if (!user) throw new Error('Not authenticated');
      return logsService.upsertDay(user.id, date, dayData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['day', user?.id, variables.date] });
      queryClient.invalidateQueries({ queryKey: ['days', user?.id] });
    },
  });

  const addListItemMutation = useMutation({
    mutationFn: ({ 
      dayId, 
      item 
    }: { 
      dayId: string; 
      item: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'> 
    }) => {
      if (!user) throw new Error('Not authenticated');
      return logsService.addListItem(user.id, dayId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['day', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['listItems', user?.id] });
    },
  });

  const deleteListItemMutation = useMutation({
    mutationFn: (itemId: string) => {
      return logsService.deleteListItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['day', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['listItems', user?.id] });
    },
  });

  const useListItems = (category?: number, startDate?: string, endDate?: string) => {
    return useQuery({
      queryKey: ['listItems', user?.id, category, startDate, endDate],
      queryFn: () => user ? logsService.getListItems(user.id, category, startDate, endDate) : Promise.resolve([]),
      enabled: !!user,
    });
  };

  return {
    useDay,
    useDaysInRange,
    useListItems,
    upsertDay: upsertDayMutation.mutateAsync,
    isUpserting: upsertDayMutation.isPending,
    addListItem: addListItemMutation.mutateAsync,
    isAddingItem: addListItemMutation.isPending,
    deleteListItem: deleteListItemMutation.mutateAsync,
    isDeletingItem: deleteListItemMutation.isPending,
  };
};

export type { Day, ListItem, DayLog };
