import { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 0, name: 'Sleep', color: '#4C6EF5', icon: 'moon', requiresSpending: false },
  { id: 1, name: 'Work', color: '#F59F00', icon: 'briefcase', requiresSpending: true },
  { id: 2, name: 'Social', color: '#15B981', icon: 'users', requiresSpending: false },
  { id: 3, name: 'Exercise', color: '#EC4899', icon: 'dumbbell', requiresSpending: false },
  { id: 4, name: 'Food', color: '#8B5CF6', icon: 'apple', requiresSpending: true },
  { id: 5, name: 'Entertainment', color: '#06B6D4', icon: 'tv', requiresSpending: true },
  { id: 6, name: 'Travel', color: '#EF4444', icon: 'map-pin', requiresSpending: true },
  { id: 7, name: 'Learning', color: '#14B8A6', icon: 'book-open', requiresSpending: false },
  { id: 8, name: 'Family', color: '#84CC16', icon: 'heart', requiresSpending: false },
  { id: 9, name: 'Shopping', color: '#F97316', icon: 'shopping-bag', requiresSpending: true },
  { id: 10, name: 'Health', color: '#06B6D4', icon: 'activity', requiresSpending: true },
];

export const EMPTY_CATEGORY = { id: -1, name: 'Empty', color: '#E5E7EB', icon: 'minus', requiresSpending: false };

export const getCategoryById = (id: number): Category => {
  if (id === -1) return EMPTY_CATEGORY;
  return CATEGORIES.find(cat => cat.id === id) || EMPTY_CATEGORY;
};

export const getCategoryColor = (id: number): string => {
  return getCategoryById(id).color;
};

export const getCategoryName = (id: number): string => {
  return getCategoryById(id).name;
};

export const categoryRequiresSpending = (id: number): boolean => {
  return getCategoryById(id).requiresSpending;
};
