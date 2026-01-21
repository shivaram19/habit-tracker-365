import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  autoCapitalize = 'none',
  keyboardType = 'default',
  editable = true,
}) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  // Fallback values for safety
  const spacing = theme?.spacing || { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24 };
  const colors = theme?.colors || {
    text: { primary: '#111827', secondary: '#6B7280', tertiary: '#9CA3AF' },
    background: { secondary: '#F3F4F6' },
    border: { primary: '#E5E7EB' },
    error: { 500: '#EF4444' },
  };
  const typography = theme?.typography || {
    fontSizes: { sm: 14, base: 16 },
    fontWeights: { medium: '500' as const },
  };
  const borderRadius = theme?.borderRadius || { lg: 8 };

  return (
    <View style={{ marginBottom: spacing[4] }}>
      {label && (
        <Text
          style={{
            color: colors.text.secondary,
            fontWeight: typography.fontWeights.medium,
            marginBottom: spacing[2],
            fontSize: typography.fontSizes.sm,
          }}
        >
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          editable={editable}
          style={[
            {
              backgroundColor: colors.background.secondary,
              borderWidth: 1,
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              fontSize: typography.fontSizes.base,
              color: colors.text.primary,
            },
            error
              ? { borderColor: colors.error[500] }
              : { borderColor: colors.border.primary },
            !editable && styles.inputDisabled,
          ]}
          placeholderTextColor={colors.text.tertiary}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.text.tertiary} />
            ) : (
              <Eye size={20} color={colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            color: colors.error[500],
            fontSize: typography.fontSizes.sm,
            marginTop: spacing[1],
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
  },
  inputDisabled: {
    opacity: 0.5,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
});
