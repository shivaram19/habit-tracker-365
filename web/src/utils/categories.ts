// Category definitions matching mobile app
export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  requiresSpending?: boolean;
}

export const categories: Category[] = [
  { id: 0, name: 'Empty', color: '#e5e5e5', icon: '⚪' },
  { id: 1, name: 'Work', color: '#4ade80', icon: '💼' },
  { id: 2, name: 'Sleep', color: '#3b82f6', icon: '😴' },
  { id: 3, name: 'Exercise', color: '#fb923c', icon: '💪' },
  { id: 4, name: 'Food', color: '#ef4444', icon: '🍔', requiresSpending: true },
  { id: 5, name: 'Shopping', color: '#a855f7', icon: '🛍️', requiresSpending: true },
  { id: 6, name: 'Social', color: '#ec4899', icon: '👥' },
  { id: 7, name: 'Entertainment', color: '#facc15', icon: '🎮', requiresSpending: true },
  { id: 8, name: 'Travel', color: '#14b8a6', icon: '✈️', requiresSpending: true },
  { id: 9, name: 'Learning', color: '#6366f1', icon: '📚' },
  { id: 10, name: 'Chores', color: '#94a3b8', icon: '🧹' },
  { id: 11, name: 'Health', color: '#06b6d4', icon: '🏥', requiresSpending: true },
  { id: 12, name: 'Other', color: '#71717a', icon: '📌' },
];

// Alias for backwards compatibility
export const CATEGORIES = categories;

export const getCategoryById = (id: number): Category => {
  return categories.find(cat => cat.id === id) || categories[0];
};

export const getCategoryColor = (id: number): string => {
  return getCategoryById(id).color;
};
