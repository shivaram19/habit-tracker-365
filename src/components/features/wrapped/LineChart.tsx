import React from 'react';
import { View, Text, Dimensions } from 'react-native';
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
      <View className="p-8 items-center">
        <Text className="text-base text-gray-400">No spending data for this year</Text>
      </View>
    );
  }

  const points = data.map((item, index) => {
    const x = (index / 11) * chartWidth;
    const y = chartHeight - (item.total / maxSpending) * chartHeight;
    return { x, y, month: format(new Date(item.month + '-01'), 'MMM'), total: item.total };
  });

  return (
    <View className="py-4">
      <Text className="text-base font-bold text-gray-900 mb-4">Monthly Spending Trend</Text>
      <View className="relative mb-4" style={{ width: chartWidth, height: chartHeight }}>
        {points.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = points[index - 1];
          return (
            <MotiView
              key={index}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 500, delay: index * 50 }}
              className="absolute h-0.5 bg-blue-500"
              style={{
                left: prevPoint.x,
                top: prevPoint.y,
                width: Math.sqrt(Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)),
                transform: [
                  { rotate: `${Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x)}rad` },
                ],
              }}
            />
          );
        })}
        {points.map((point, index) => (
          <MotiView
            key={`point-${index}`}
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: index * 50 + 100 }}
            className="absolute w-2 h-2 rounded-full bg-blue-500 border-2 border-white"
            style={{
              left: point.x - 4,
              top: point.y - 4,
            }}
          />
        ))}
      </View>
      <View className="flex-row justify-between px-2 mb-4">
        {points.filter((_, i) => i % 2 === 0).map((point, index) => (
          <Text key={index} className="text-[11px] font-semibold text-gray-600">
            {point.month}
          </Text>
        ))}
      </View>
      <View className="flex-row gap-4 pt-4 border-t border-gray-200">
        <View className="flex-1 items-center">
          <Text className="text-xs font-semibold text-gray-600 mb-1">Max</Text>
          <Text className="text-xl font-bold text-green-600">${maxSpending.toFixed(2)}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-xs font-semibold text-gray-600 mb-1">Avg</Text>
          <Text className="text-xl font-bold text-green-600">
            ${(data.reduce((sum, d) => sum + d.total, 0) / data.length).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};
