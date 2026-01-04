import React from 'react';
import { View, Text, Platform } from 'react-native';
import { MotiView } from 'moti';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color = '#3B82F6',
  delay = 0,
}) => {
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {},
  });

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay }}
      className="flex-1 bg-white rounded-2xl p-4 items-center min-w-[150px]"
      style={[
        shadowStyle,
        Platform.OS === 'android' && { elevation: 3 },
      ]}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} color={color} />
      </View>
      <Text className="text-xs font-semibold text-gray-600 text-center mb-1">
        {label}
      </Text>
      <Text className="text-2xl font-bold text-center" style={{ color }}>
        {value}
      </Text>
    </MotiView>
  );
};
