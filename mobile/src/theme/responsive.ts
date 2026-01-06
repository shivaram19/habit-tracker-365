import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
};

export const isPhone = width < breakpoints.tablet;
export const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
export const isDesktop = width >= breakpoints.desktop;

export const responsive = {
  width,
  height,
  isPhone,
  isTablet,
  isDesktop,
  isWeb: Platform.OS === 'web',
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

export const getResponsiveValue = <T,>(values: {
  phone: T;
  tablet?: T;
  desktop?: T;
}): T => {
  if (isDesktop && values.desktop) return values.desktop;
  if (isTablet && values.tablet) return values.tablet;
  return values.phone;
};
