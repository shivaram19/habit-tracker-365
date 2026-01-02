import { format, parseISO, startOfDay, endOfDay, differenceInDays, addDays, subDays } from 'date-fns';

export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatDisplayDate = (date: Date | string): string => {
  return formatDate(date, 'MMM dd, yyyy');
};

export const formatMonthYear = (date: Date | string): string => {
  return formatDate(date, 'MMMM yyyy');
};

export const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatHours = (hours: number): string => {
  if (hours === 1) return '1 hour';
  return `${hours} hours`;
};

export const getTodayDate = (): string => {
  return formatDate(new Date(), 'yyyy-MM-dd');
};

export const getDateRange = (days: number): { startDate: string; endDate: string } => {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);

  return {
    startDate: formatDate(startDate, 'yyyy-MM-dd'),
    endDate: formatDate(endDate, 'yyyy-MM-dd'),
  };
};

export const get365DaysRange = () => getDateRange(365);

export const isToday = (date: string): boolean => {
  return date === getTodayDate();
};

export const isFutureDate = (date: string): boolean => {
  const today = startOfDay(new Date());
  const compareDate = startOfDay(parseISO(date));
  return compareDate > today;
};

export const isPastDate = (date: string): boolean => {
  const today = startOfDay(new Date());
  const compareDate = startOfDay(parseISO(date));
  return compareDate < today;
};
