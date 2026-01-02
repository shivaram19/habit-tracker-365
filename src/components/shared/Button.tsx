import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600';
      case 'secondary':
        return 'bg-gray-200';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'secondary':
        return 'text-gray-800';
      case 'danger':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      className={`${getVariantStyles()} ${fullWidth ? 'w-full' : ''} ${
        isDisabled ? 'opacity-50' : ''
      } py-4 px-6 rounded-xl flex-row justify-center items-center`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#374151' : '#ffffff'} />
      ) : (
        <Text className={`${getTextColor()} font-semibold text-base`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
