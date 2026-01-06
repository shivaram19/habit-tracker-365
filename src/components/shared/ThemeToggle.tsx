import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Sun, Moon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, colorScheme, toggleTheme } = useTheme();

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.full,
          padding: theme.spacing[2],
        },
      ]}
    >
      <MotiView
        animate={{
          rotate: colorScheme === 'dark' ? '180deg' : '0deg',
        }}
        transition={{ type: 'timing', duration: theme.animation.duration.normal }}
      >
        {colorScheme === 'dark' ? (
          <Moon size={20} color={theme.colors.text.primary} />
        ) : (
          <Sun size={20} color={theme.colors.text.primary} />
        )}
      </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
