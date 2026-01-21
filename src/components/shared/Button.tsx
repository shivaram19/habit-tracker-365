import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';

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
  const { theme } = useTheme();

  // Fallback values for safety
  const spacing = theme?.spacing || { 4: 16, 6: 24 };
  const colors = theme?.colors || {
    primary: { 600: '#2563EB' },
    neutral: { 200: '#E5E7EB' },
    error: { 600: '#DC2626' },
    text: { primary: '#111827', inverse: '#FFFFFF' },
  };
  const typography = theme?.typography || {
    fontSizes: { base: 16 },
    fontWeights: { semibold: '600' as const },
  };
  const borderRadius = theme?.borderRadius || { lg: 8 };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary[600],
        };
      case 'secondary':
        return {
          backgroundColor: colors.neutral[200],
        };
      case 'danger':
        return {
          backgroundColor: colors.error[600],
        };
      default:
        return {
          backgroundColor: colors.primary[600],
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return colors.text.inverse;
      case 'secondary':
        return colors.text.primary;
      default:
        return colors.text.inverse;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        {
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[6],
          borderRadius: borderRadius.lg,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        getVariantStyles(),
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            {
              fontSize: typography.fontSizes.base,
              fontWeight: typography.fontWeights.semibold,
              color: getTextColor(),
            },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
