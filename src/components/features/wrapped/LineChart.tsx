import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { MonthlySpending } from '@/types';
import { format } from 'date-fns';

interface LineChartProps {
  data: MonthlySpending[];
}

const { width } = Dimensions.get('window');
const chartWidth = width - 64;
const chartHeight = 200;

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const maxSpending = Math.max(...data.map(d => d.total), 1);

  if (maxSpending === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No spending data for this year</Text>
      </View>
    );
  }

  const points = data.map((item, index) => {
    const x = (index / 11) * chartWidth;
    const y = chartHeight - (item.total / maxSpending) * chartHeight;
    return { x, y, month: format(new Date(item.month + '-01'), 'MMM'), total: item.total };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Spending Trend</Text>
      <View style={[styles.chartContainer, { width: chartWidth, height: chartHeight }]}>
        {points.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = points[index - 1];
          return (
            <MotiView
              key={index}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 500, delay: index * 50 }}
              style={[
                styles.line,
                {
                  left: prevPoint.x,
                  top: prevPoint.y,
                  width: Math.sqrt(Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)),
                  transformOrigin: 'left center',
                  transform: [
                    { rotate: `${Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x)}rad` },
                  ],
                }
              ]}
            />
          );
        })}
        {points.map((point, index) => (
          <MotiView
            key={`point-${index}`}
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: index * 50 + 100 }}
            style={[
              styles.point,
              {
                left: point.x - 4,
                top: point.y - 4,
              }
            ]}
          />
        ))}
      </View>
      <View style={styles.labelsContainer}>
        {points.filter((_, i) => i % 2 === 0).map((point, index) => (
          <Text key={index} style={styles.labelText}>
            {point.month}
          </Text>
        ))}
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>${maxSpending.toFixed(2)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg</Text>
          <Text style={styles.statValue}>
            ${(data.reduce((sum, d) => sum + d.total, 0) / data.length).toFixed(2)}
          </Text>
        </View>
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
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  chartContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#3B82F6',
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
});
