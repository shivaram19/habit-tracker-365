import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { CalendarDays } from 'lucide-react-native';
import { useDaysRange } from '@/hooks/useLogs';
import { MonthSelector } from '@/components/features/heatmap/MonthSelector';
import { CategoryLegend } from '@/components/features/heatmap/CategoryLegend';
import { HeatmapMonthSection } from '@/components/features/heatmap/HeatmapMonthSection';
import { DayDetailModal } from '@/components/features/heatmap/DayDetailModal';
import { HistoryFilter, FilterOptions } from '@/components/features/heatmap/HistoryFilter';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Day } from '@/types';

interface MonthGroup {
  month: string;
  days: Day[];
}

export default function HistoryScreen() {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    categoryFilter: null,
    minSpend: null,
    maxSpend: null,
  });
  const flashListRef = useRef<any>(null);

  const today = new Date();
  const startDate = format(subDays(today, 364), 'yyyy-MM-dd');
  const endDate = format(today, 'yyyy-MM-dd');

  const { data: daysData, isLoading, error, refetch } = useDaysRange(startDate, endDate);

  const applyFilters = (days: Day[]): Day[] => {
    return days.filter(day => {
      if (filters.searchQuery) {
        if (!day.highlight) return false;
        const matchesSearch = day.highlight
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());
        if (!matchesSearch) return false;
      }

      if (filters.categoryFilter !== null) {
        const hasCategory = day.hourly_logs.some(
          log => log === filters.categoryFilter
        );
        if (!hasCategory) return false;
      }

      if (filters.minSpend !== null && day.total_spend < filters.minSpend) {
        return false;
      }

      if (filters.maxSpend !== null && day.total_spend > filters.maxSpend) {
        return false;
      }

      return true;
    });
  };

  const monthGroups: MonthGroup[] = useMemo(() => {
    if (!daysData) return [];

    const filteredData = applyFilters(daysData);

    const allDates = [];
    for (let i = 364; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      allDates.push(date);
    }

    const dayMap = new Map(filteredData.map(day => [day.date, day]));

    const daysWithPlaceholders = allDates.map(date => {
      return dayMap.get(date) || {
        id: date,
        user_id: '',
        date,
        hourly_logs: Array(24).fill(-1),
        total_spend: 0,
        created_at: '',
        updated_at: '',
      };
    });

    const reversedDays = [...daysWithPlaceholders].reverse();

    const groups: Record<string, Day[]> = {};
    reversedDays.forEach(day => {
      const monthKey = format(new Date(day.date + 'T00:00:00'), 'MMMM yyyy');
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(day);
    });

    return Object.entries(groups).map(([month, days]) => ({
      month,
      days,
    }));
  }, [daysData, today, filters]);

  const handleDayPress = (day: Day) => {
    setSelectedDay(day);
    setModalVisible(true);
  };

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    const monthIndex = monthGroups.findIndex(group => {
      const groupDate = new Date(group.days[0]?.date + 'T00:00:00');
      return groupDate.getMonth() === month;
    });

    if (monthIndex !== -1) {
      flashListRef.current?.scrollToIndex({
        index: monthIndex,
        animated: true,
      });
    }
  };

  const handleTodayPress = () => {
    flashListRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
    setSelectedMonth(new Date().getMonth());
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      categoryFilter: null,
      minSpend: null,
      maxSpend: null,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error || !daysData) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={CalendarDays}
          title="Unable to Load History"
          description="There was an error loading your history. Pull down to try again."
        />
      </SafeAreaView>
    );
  }

  if (monthGroups.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon={CalendarDays}
          title="No History Yet"
          description="Start logging your days to see your activity heatmap here."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MonthSelector
        selectedMonth={selectedMonth}
        year={today.getFullYear()}
        onMonthSelect={handleMonthSelect}
        onTodayPress={handleTodayPress}
      />
      <HistoryFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />
      <CategoryLegend />

      <FlashList
        ref={flashListRef}
        data={monthGroups}
        renderItem={({ item }) => (
          <HeatmapMonthSection
            month={item.month}
            days={item.days}
            onDayPress={handleDayPress}
          />
        )}
        keyExtractor={(item) => item.month}
      />

      <DayDetailModal
        visible={modalVisible}
        day={selectedDay}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
