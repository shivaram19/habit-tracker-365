import React from 'react';
import { View, Platform } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
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
    <View
      className={`bg-white rounded-2xl p-4 ${className}`}
      style={[
        shadowStyle,
        Platform.OS === 'android' && { elevation: 3 },
      ]}
    >
      {children}
    </View>
  );
};
