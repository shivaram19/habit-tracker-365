import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCategoryColor } from '@/utils/categories';
import { format } from 'date-fns';

interface HeatmapDayRowProps {
  date: string;
  hourlyLogs: number[];
  onPress: () => void;
}

export const HeatmapDayRow: React.FC<HeatmapDayRowProps> = ({
  date,
  hourlyLogs,
  onPress,
}) => {
  const dateObj = new Date(date + 'T00:00:00');
  const dayOfWeek = format(dateObj, 'EEE');
  const dayOfMonth = format(dateObj, 'd');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
      <View style={styles.dateLabel}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.dayOfMonth}>{dayOfMonth}</Text>
      </View>
      <View style={styles.hoursContainer}>
        {hourlyLogs.map((categoryId, index) => (
          <View
            key={index}
            style={[
              styles.hourBlock,
              { backgroundColor: getCategoryColor(categoryId) },
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  dateLabel: {
    width: 50,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  dayOfWeek: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayOfMonth: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  hoursContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 1,
  },
  hourBlock: {
    flex: 1,
    height: 20,
    borderRadius: 2,
  },
});
