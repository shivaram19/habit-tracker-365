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

  return (
    <View style={{ marginBottom: theme.spacing[4] }}>
      {label && (
        <Text
          style={{
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeights.medium,
            marginBottom: theme.spacing[2],
            fontSize: theme.typography.fontSizes.sm,
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
              backgroundColor: theme.colors.background.secondary,
              borderWidth: 1,
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing[4],
              paddingVertical: theme.spacing[3],
              fontSize: theme.typography.fontSizes.base,
              color: theme.colors.text.primary,
            },
            error
              ? { borderColor: theme.colors.error[500] }
              : { borderColor: theme.colors.border.primary },
            !editable && styles.inputDisabled,
          ]}
          placeholderTextColor={theme.colors.text.tertiary}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.text.tertiary} />
            ) : (
              <Eye size={20} color={theme.colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            color: theme.colors.error[500],
            fontSize: theme.typography.fontSizes.sm,
            marginTop: theme.spacing[1],
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
