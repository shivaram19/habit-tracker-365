import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MotiView } from 'moti';

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearSelect: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  years,
  selectedYear,
  onYearSelect,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <View className="py-4 px-4 bg-white border-b border-gray-200">
      <Text className="text-xs font-semibold text-gray-600 mb-3">View Year</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {years.map((year) => {
          const isSelected = selectedYear === year;
          const isCurrent = year === currentYear;

          return (
            <TouchableOpacity
              key={year}
              onPress={() => onYearSelect(year)}
              activeOpacity={0.7}
            >
              <MotiView
                animate={{
                  backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                  scale: isSelected ? 1.05 : 1,
                }}
                transition={{ type: 'timing', duration: 200 }}
                className="px-5 py-3 rounded-xl relative"
              >
                <Text
                  className={`text-base font-bold ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {year}
                </Text>
                {isCurrent && (
                  <View className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-600" />
                )}
              </MotiView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
