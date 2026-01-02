import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Category } from '@/types';
import * as Icons from 'lucide-react-native';

interface CategoryBubbleProps {
  category: Category;
  selected: boolean;
  onPress: () => void;
}

export const CategoryBubble: React.FC<CategoryBubbleProps> = ({
  category,
  selected,
  onPress,
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
        className="items-center mx-2"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View
          className={`w-16 h-16 rounded-full justify-center items-center mb-2 ${
            selected ? 'border-4 border-white shadow-lg' : 'border-2 border-gray-200'
          }`}
          style={{ backgroundColor: category.color }}
        >
          {getIconComponent()}
        </View>
        <Text
          className={`text-xs font-semibold ${
            selected ? 'text-gray-900' : 'text-gray-600'
          }`}
        >
          {category.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
