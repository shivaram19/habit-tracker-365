import { Platform } from 'react-native';
import { tokens } from './tokens';

export type ColorScheme = 'light' | 'dark';

export const createTheme = (scheme: ColorScheme) => {
  const colors = tokens.colors[scheme];

  return {
    colors,
    spacing: tokens.spacing,
    borderRadius: tokens.borderRadius,
    typography: tokens.typography,
    shadows: tokens.shadows,
    animation: tokens.animation,
    scheme,

    getShadow: (size: 'sm' | 'md' | 'lg' | 'xl') => {
      if (Platform.OS === 'ios') {
        return tokens.shadows[size].ios;
      } else if (Platform.OS === 'android') {
        return tokens.shadows[size].android;
      }
      return {};
    },
  };
};

export type AppTheme = ReturnType<typeof createTheme>;
