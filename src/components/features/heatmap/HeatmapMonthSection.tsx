import React from 'react';
import { View, Text } from 'react-native';
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
    <View className="mb-2">
      <View className="px-4 py-3 bg-gray-50">
        <Text className="text-base font-bold text-gray-900">{month}</Text>
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
