import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  message,
}) => {
  const displayMessage = message || description;

  return (
    <View className="flex-1 justify-center items-center p-8">
      {Icon && (
        <View className="mb-4">
          <Icon size={48} color="#9CA3AF" />
        </View>
      )}
      <Text className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</Text>
      {displayMessage && (
        <Text className="text-base text-gray-600 text-center leading-6">
          {displayMessage}
        </Text>
      )}
    </View>
  );
};
