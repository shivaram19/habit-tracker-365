import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeatmapDayRow } from './HeatmapDayRow';
import { Day } from '@/types';

interface HeatmapMonthSectionProps {
  month: string;
  days: Day[];
  onDayPress: (day: Day) => void;
}

export const HeatmapMonthSection: React.FC<HeatmapMonthSectionProps> = ({
  month,
  days,
  onDayPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthText}>{month}</Text>
      </View>
      {days.map((day) => (
        <HeatmapDayRow
          key={day.id}
          date={day.date}
          hourlyLogs={day.hourly_logs || Array(24).fill(-1)}
          onPress={() => onDayPress(day)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});
