import React from 'react';
import { View, Text } from 'react-native';
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
      <View className="p-8 items-center">
        <Text className="text-base text-gray-400">No data available</Text>
      </View>
    );
  }

  return (
    <View className="py-4">
      <View className="items-center mb-6">
        <Text className="text-5xl font-bold text-gray-900">{totalHours}</Text>
        <Text className="text-base font-semibold text-gray-600">hours tracked</Text>
      </View>

      <View className="gap-4">
        {topCategories.map((cat, index) => (
          <MotiView
            key={cat.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
            className="flex-row items-center gap-3"
          >
            <View
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                {cat.name}
              </Text>
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <MotiView
                  from={{ width: '0%' }}
                  animate={{ width: `${cat.percentage}%` }}
                  transition={{ type: 'timing', duration: 800, delay: index * 100 + 200 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </View>
            </View>
            <View className="items-end min-w-[60px]">
              <Text className="text-base font-bold text-gray-900">{cat.hours}h</Text>
              <Text className="text-xs font-semibold text-gray-600">
                {cat.percentage.toFixed(1)}%
              </Text>
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
};
