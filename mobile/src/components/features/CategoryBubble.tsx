import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Category } from '@/types';
import * as Icons from 'lucide-react-native';

interface CategoryBubbleProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
  labelPosition?: 'top' | 'bottom';
}

export const CategoryBubble: React.FC<CategoryBubbleProps> = ({
  category,
  selected,
  onPress,
  labelPosition = 'bottom',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: selected ? 1.1 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [selected]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getIconComponent = () => {
    const iconMap: Record<string, any> = {
      moon: Icons.Moon,
      briefcase: Icons.Briefcase,
      users: Icons.Users,
      dumbbell: Icons.Dumbbell,
      apple: Icons.Apple,
      tv: Icons.Tv,
      'map-pin': Icons.MapPin,
      'book-open': Icons.BookOpen,
      heart: Icons.Heart,
      'shopping-bag': Icons.ShoppingBag,
      activity: Icons.Activity,
    };

    const IconComponent = iconMap[category.icon] || Icons.Circle;
    return <IconComponent size={20} color="#FFFFFF" />;
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          labelPosition === 'top' ? styles.containerReverse : undefined,
        ]}
      >
        {labelPosition === 'top' && (
          <Text style={[styles.label, styles.labelTop, selected ? styles.selectedLabel : styles.unselectedLabel]}>
            {category.name}
          </Text>
        )}
        <View
          style={[
            styles.bubble,
            { backgroundColor: category.color },
            selected ? styles.selectedBubble : styles.unselectedBubble
          ]}
        >
          {getIconComponent()}
        </View>
        {labelPosition === 'bottom' && (
          <Text style={[styles.label, styles.labelBottom, selected ? styles.selectedLabel : styles.unselectedLabel]}>
            {category.name}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    alignItems: 'center' as const,
    marginHorizontal: 8,
  },
  containerReverse: {
    flexDirection: 'column-reverse' as const,
  },
  bubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  selectedBubble: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  unselectedBubble: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  labelTop: {
    marginBottom: 8,
  },
  labelBottom: {
    marginTop: 8,
  },
  selectedLabel: {
    color: '#111827',
  },
  unselectedLabel: {
    color: '#6B7280',
  },
};
