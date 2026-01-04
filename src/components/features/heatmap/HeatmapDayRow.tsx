import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center py-1 px-4">
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        className="w-[50px] mr-3 items-start"
      >
        <Text className="text-[11px] font-semibold text-gray-600">{dayOfWeek}</Text>
        <Text className="text-base font-bold text-gray-900">{dayOfMonth}</Text>
      </MotiView>
      <View className="flex-1 flex-row gap-[1px]">
        {hourlyLogs.map((categoryId, index) => (
          <View
            key={index}
            className="flex-1 h-5 rounded-[2px]"
            style={{ backgroundColor: getCategoryColor(categoryId) }}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};
