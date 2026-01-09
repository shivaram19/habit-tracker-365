import { useState, useEffect } from 'react';
import { logsService } from '@/services/logs';
import { ListItem } from '@/types';

interface UseListItemsOptions {
  userId: string;
  dayId?: string;
  category?: number;
  startDate?: string;
  endDate?: string;
  autoFetch?: boolean;
}

export const useListItems = ({
  userId,
  dayId,
  category,
  startDate,
  endDate,
  autoFetch = true,
}: UseListItemsOptions) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await logsService.getListItems(userId, category, startDate, endDate);
      const filteredData = dayId ? data.filter(item => item.day_id === dayId) : data;
      setItems(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>, itemDayId: string) => {
    setError(null);
    try {
      const newItem = await logsService.addListItem(userId, itemDayId, item);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteItem = async (itemId: string) => {
    setError(null);
    try {
      await logsService.deleteListItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateItem = async (itemId: string, updates: Partial<Omit<ListItem, 'id' | 'user_id' | 'day_id' | 'created_at' | 'updated_at'>>) => {
    setError(null);
    try {
      const itemToUpdate = items.find(item => item.id === itemId);
      if (!itemToUpdate) {
        throw new Error('Item not found');
      }

      await logsService.deleteListItem(itemId);
      const updatedItem = await logsService.addListItem(userId, itemToUpdate.day_id, {
        ...itemToUpdate,
        ...updates,
      });

      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  useEffect(() => {
    if (autoFetch && userId) {
      fetchItems();
    }
  }, [userId, category, startDate, endDate, autoFetch]);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    deleteItem,
    updateItem,
  };
};
