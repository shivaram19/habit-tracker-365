import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
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

  const getSizeDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 8, height: 24 };
      case 'medium':
        return { width: 32, height: 48 };
      case 'large':
        return { width: 48, height: 48 };
    }
  };

  const dimensions = getSizeDimensions();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.block,
          dimensions,
          { backgroundColor: category.color }
        ]}
      >
        {size === 'large' && (
          <Text style={styles.hourText}>{hour}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  block: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
