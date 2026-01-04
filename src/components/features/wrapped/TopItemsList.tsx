import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { TopItem } from '@/types';

interface TopItemsListProps {
  title: string;
  items: TopItem[];
  showSpend?: boolean;
}

export const TopItemsList: React.FC<TopItemsListProps> = ({
  title,
  items,
  showSpend = false,
}) => {
  if (items.length === 0) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">{title}</Text>
        <View className="p-8 items-center">
          <Text className="text-base text-gray-400">No items yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-900 mb-4">{title}</Text>
      <ScrollView className="max-h-[400px]">
        {items.map((item, index) => (
          <MotiView
            key={`${item.name}-${index}`}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300, delay: index * 50 }}
            className="flex-row items-center py-3 px-4 bg-gray-50 rounded-xl mb-2"
          >
            <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center mr-3">
              <Text className="text-sm font-bold text-white">#{index + 1}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 mb-1">
                {item.name}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-semibold text-gray-600">
                  {item.count}x
                </Text>
                {showSpend && (
                  <>
                    <Text className="text-sm text-gray-400">•</Text>
                    <Text className="text-sm font-semibold text-green-600">
                      ${item.totalSpend.toFixed(2)}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </View>
  );
};
