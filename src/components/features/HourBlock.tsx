import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { getCategoryById } from '@/utils/categories';

interface HourBlockProps {
  hour: number;
  categoryId: number;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const HourBlock: React.FC<HourBlockProps> = ({
  hour,
  categoryId,
  onPress,
  size = 'large',
}) => {
  const category = getCategoryById(categoryId);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-2 h-6';
      case 'medium':
        return 'w-8 h-12';
      case 'large':
        return 'w-12 h-12';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        className={`${getSizeClasses()} rounded-lg border-2 border-gray-200 justify-center items-center`}
        style={{ backgroundColor: category.color }}
      >
        {size === 'large' && (
          <Text className="text-xs font-semibold text-white">{hour}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
