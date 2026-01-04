import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { MotiView } from 'moti';
import { ListItem } from '@/types';
import { CATEGORIES } from '@/utils/categories';
import { Trash2, Edit } from 'lucide-react-native';

interface ListItemCardProps {
  item: ListItem;
  onEdit?: (item: ListItem) => void;
  onDelete?: (itemId: string) => void;
}

export const ListItemCard: React.FC<ListItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const category = CATEGORIES.find(c => c.id === item.category);
  const categoryColor = category?.color || '#6B7280';

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {},
  });

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 200 }}
      className="flex-row items-center bg-white rounded-xl p-4 mb-2"
      style={[
        shadowStyle,
        Platform.OS === 'android' && { elevation: 2 },
      ]}
    >
      <View
        className="w-1 h-12 rounded-sm mr-3"
        style={{ backgroundColor: categoryColor }}
      />

      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1.5">
          <Text className="text-base font-semibold text-gray-900 flex-1 mr-3" numberOfLines={1}>
            {item.name}
          </Text>
          <Text className="text-base font-bold text-green-600">
            ${item.price.toFixed(2)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs font-medium text-gray-600">
            {category?.name || 'Other'}
          </Text>
          <Text className="text-xs text-gray-400">
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 ml-2">
        {onEdit && (
          <TouchableOpacity
            className="p-2 rounded-lg bg-gray-50"
            onPress={() => onEdit(item)}
          >
            <Edit size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            className="p-2 rounded-lg bg-gray-50"
            onPress={() => onDelete(item.id)}
          >
            <Trash2 size={18} color="#DC2626" />
          </TouchableOpacity>
        )}
      </View>
    </MotiView>
  );
};
