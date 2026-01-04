import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CATEGORIES, EMPTY_CATEGORY } from '@/utils/categories';

export const CategoryLegend: React.FC = () => {
  const allCategories = [...CATEGORIES, EMPTY_CATEGORY];

  return (
    <View className="py-3 px-4 bg-gray-50 border-b border-gray-200">
      <Text className="text-xs font-semibold text-gray-600 mb-2">Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 pr-4"
      >
        {allCategories.map((category) => (
          <View key={category.id} className="flex-row items-center gap-1.5">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <Text className="text-xs font-medium text-gray-700">{category.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
