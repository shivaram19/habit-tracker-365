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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary[600],
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.neutral[200],
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error[600],
        };
      default:
        return {
          backgroundColor: theme.colors.primary[600],
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return theme.colors.text.inverse;
      case 'secondary':
        return theme.colors.text.primary;
      default:
        return theme.colors.text.inverse;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        {
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[6],
          borderRadius: theme.borderRadius.lg,
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
              fontSize: theme.typography.fontSizes.base,
              fontWeight: theme.typography.fontWeights.semibold,
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
