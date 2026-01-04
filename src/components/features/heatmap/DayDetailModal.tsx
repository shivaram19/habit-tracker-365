import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Modal } from '@/components/shared/Modal';
import { Day } from '@/types';
import { getCategoryById, getCategoryColor, getCategoryName } from '@/utils/categories';
import { format } from 'date-fns';
import { X } from 'lucide-react-native';

interface DayDetailModalProps {
  visible: boolean;
  day: Day | null;
  onClose: () => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  visible,
  day,
  onClose,
}) => {
  if (!day) return null;

  const dateObj = new Date(day.date + 'T00:00:00');
  const formattedDate = format(dateObj, 'EEEE, MMMM d, yyyy');

  const hourlyLogs = day.hourly_logs || Array(24).fill(-1);

  const categoryCounts: Record<number, number> = {};
  hourlyLogs.forEach((categoryId) => {
    if (categoryId !== -1) {
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    }
  });

  const categoryEntries = Object.entries(categoryCounts)
    .map(([id, hours]) => ({
      category: getCategoryById(Number(id)),
      hours,
    }))
    .sort((a, b) => b.hours - a.hours);

  return (
    <Modal visible={visible} onClose={onClose}>
      <View className="max-h-[90%]">
        <View className="flex-row justify-between items-start p-5 border-b border-gray-200">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-bold text-gray-900 mb-1">{formattedDate}</Text>
            {day.highlight && (
              <Text className="text-sm italic text-gray-600">"{day.highlight}"</Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} className="p-1">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="p-5">
          <View className="mb-6">
            <Text className="text-base font-bold text-gray-900 mb-3">24-Hour Breakdown</Text>
            <View className="gap-2">
              {hourlyLogs.map((categoryId, hour) => {
                const category = getCategoryById(categoryId);
                return (
                  <View key={hour} className="flex-row items-center gap-3">
                    <Text className="w-[50px] text-xs font-semibold text-gray-600">
                      {hour.toString().padStart(2, '0')}:00
                    </Text>
                    <View
                      className="w-10 h-5 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <Text className="text-xs text-gray-700">{category.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-base font-bold text-gray-900 mb-3">Category Summary</Text>
            {categoryEntries.map(({ category, hours }) => (
              <View key={category.id} className="flex-row items-center py-2 gap-3">
                <View
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <Text className="flex-1 text-base font-medium text-gray-700">
                  {category.name}
                </Text>
                <Text className="text-sm font-semibold text-gray-600">
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </Text>
              </View>
            ))}
          </View>

          {day.total_spend > 0 && (
            <View className="mb-6">
              <Text className="text-base font-bold text-gray-900 mb-3">Total Spending</Text>
              <Text className="text-3xl font-bold text-green-600">
                ${Number(day.total_spend).toFixed(2)}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
