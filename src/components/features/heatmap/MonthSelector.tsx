import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MotiView } from 'moti';

interface MonthSelectorProps {
  selectedMonth: number;
  year: number;
  onMonthSelect: (month: number) => void;
  onTodayPress: () => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  year,
  onMonthSelect,
  onTodayPress,
}) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <View className="flex-row items-center py-3 pl-4 bg-white border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 pr-2"
      >
        {MONTHS.map((month, index) => {
          const isSelected = selectedMonth === index;
          const isCurrent = currentMonth === index && currentYear === year;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onMonthSelect(index)}
              activeOpacity={0.7}
            >
              <MotiView
                animate={{
                  backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                  scale: isSelected ? 1.05 : 1,
                }}
                transition={{ type: 'timing', duration: 200 }}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  className={`text-sm ${
                    isSelected ? 'text-white font-semibold' : 'text-gray-600 font-medium'
                  } ${isCurrent ? 'font-bold' : ''}`}
                >
                  {month}
                </Text>
              </MotiView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        onPress={onTodayPress}
        className="ml-2 mr-4 px-4 py-2 rounded-full bg-green-600"
        activeOpacity={0.7}
      >
        <Text className="text-sm font-semibold text-white">Today</Text>
      </TouchableOpacity>
    </View>
  );
};
