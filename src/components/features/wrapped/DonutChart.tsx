import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CategoryStats } from '@/types';

interface DonutChartProps {
  data: CategoryStats[];
  totalHours: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, totalHours }) => {
  const topCategories = data
    .filter(cat => cat.hours > 0)
    .slice(0, 6);

  if (topCategories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.totalHours}>{totalHours}</Text>
        <Text style={styles.hoursText}>hours tracked</Text>
      </View>

      <View style={styles.categoriesContainer}>
        {topCategories.map((cat, index) => (
          <View key={cat.id} style={styles.categoryRow}>
            <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: cat.color,
                      width: `${cat.percentage}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.hoursValue}>{cat.hours}h</Text>
              <Text style={styles.percentage}>{cat.percentage.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  totalHours: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
  },
  hoursText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  barContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  hoursValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
