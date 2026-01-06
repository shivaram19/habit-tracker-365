import React from 'react';
import { View, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing[4],
        },
        theme.getShadow('md'),
      ]}
    >
      {children}
    </View>
  );
};
