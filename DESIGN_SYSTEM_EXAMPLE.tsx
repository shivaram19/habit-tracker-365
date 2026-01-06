import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';

interface ExampleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const ExampleButton: React.FC<ExampleButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
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
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border.primary,
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
      case 'ghost':
        return theme.colors.text.primary;
      default:
        return theme.colors.text.inverse;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
        };
      case 'md':
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[6],
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[8],
        };
    }
  };

  const isDisabled = disabled || loading;

  return (
    <MotiView
      from={{ scale: 1 }}
      animate={{ scale: isDisabled ? 1 : 1 }}
      transition={{ type: 'timing', duration: theme.animation.duration.fast }}
    >
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        style={[
          styles.button,
          {
            borderRadius: theme.borderRadius.lg,
          },
          getVariantStyles(),
          getSizeStyles(),
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <Text
            style={[
              styles.text,
              {
                fontSize: theme.typography.fontSizes.base,
                fontWeight: theme.typography.fontWeights.semibold,
                color: getTextColor(),
              }
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
});
