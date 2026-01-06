import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
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
      <View style={styles.totalContainer}>
        <Text style={styles.totalHours}>{totalHours}</Text>
        <Text style={styles.totalLabel}>hours tracked</Text>
      </View>

      <View style={styles.categoriesList}>
        {topCategories.map((cat, index) => (
          <MotiView
            key={cat.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
            style={styles.categoryRow}
          >
            <View
              style={[styles.colorDot, { backgroundColor: cat.color }]}
            />
            <View style={styles.categoryContent}>
              <Text style={styles.categoryName}>
                {cat.name}
              </Text>
              <View style={styles.barBackground}>
                <MotiView
                  from={{ width: '0%' }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ type: 'timing', duration: 800, delay: index * 100 + 200 }}
                  style={[styles.barFill, { backgroundColor: cat.color }]}
                />
              </View>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.hoursText}>{cat.hours}h</Text>
              <Text style={styles.percentageText}>
                {cat.percentage.toFixed(1)}%
              </Text>
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  container: {
    paddingVertical: 16,
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  totalHours: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoriesList: {
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
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  barBackground: {
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
  hoursText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
});
