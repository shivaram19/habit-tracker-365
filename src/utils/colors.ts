export const COLORS = {
  sleep: '#4C6EF5',
  work: '#F59F00',
  social: '#15B981',
  exercise: '#EC4899',
  food: '#8B5CF6',
  entertainment: '#06B6D4',
  travel: '#EF4444',
  learning: '#14B8A6',
  family: '#84CC16',
  shopping: '#F97316',
  health: '#06B6D4',
  empty: '#E5E7EB',

  primary: '#4C6EF5',
  secondary: '#F59F00',
  success: '#15B981',
  danger: '#EF4444',
  warning: '#F59F00',
  info: '#06B6D4',

  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
};

export const getCategoryColorById = (id: number): string => {
  const colorMap: Record<number, string> = {
    0: COLORS.sleep,
    1: COLORS.work,
    2: COLORS.social,
    3: COLORS.exercise,
    4: COLORS.food,
    5: COLORS.entertainment,
    6: COLORS.travel,
    7: COLORS.learning,
    8: COLORS.family,
    9: COLORS.shopping,
    10: COLORS.health,
    [-1]: COLORS.empty,
  };

  return colorMap[id] || COLORS.empty;
};
