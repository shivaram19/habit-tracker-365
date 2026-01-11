import { useState, useEffect } from 'react';

// Breakpoints matching Tailwind CSS defaults
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;      // < 640px (below sm)
  isTablet: boolean;      // 640px - 1023px (sm to below lg)
  isDesktop: boolean;     // >= 1024px (lg and above)
  isSmall: boolean;       // >= 640px
  isMedium: boolean;      // >= 768px
  isLarge: boolean;       // >= 1024px
  isXLarge: boolean;      // >= 1280px
  is2XLarge: boolean;     // >= 1536px
  breakpoint: 'xs' | Breakpoint;
}

/**
 * Hook for responsive design that mirrors Tailwind breakpoints
 * Use this when you need JS-based responsive logic (e.g., conditional rendering)
 * For styling, prefer Tailwind responsive classes (sm:, md:, lg:, etc.)
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => getResponsiveState());

  useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState());
    };

    // Use ResizeObserver for better performance
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      
      // Initial call
      handleResize();
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return state;
}

function getResponsiveState(): ResponsiveState {
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isSmall: true,
      isMedium: true,
      isLarge: true,
      isXLarge: false,
      is2XLarge: false,
      breakpoint: 'lg',
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  const isSmall = width >= breakpoints.sm;
  const isMedium = width >= breakpoints.md;
  const isLarge = width >= breakpoints.lg;
  const isXLarge = width >= breakpoints.xl;
  const is2XLarge = width >= breakpoints['2xl'];

  // Semantic breakpoints
  const isMobile = width < breakpoints.sm;
  const isTablet = width >= breakpoints.sm && width < breakpoints.lg;
  const isDesktop = width >= breakpoints.lg;

  // Current breakpoint
  let breakpoint: 'xs' | Breakpoint = 'xs';
  if (is2XLarge) breakpoint = '2xl';
  else if (isXLarge) breakpoint = 'xl';
  else if (isLarge) breakpoint = 'lg';
  else if (isMedium) breakpoint = 'md';
  else if (isSmall) breakpoint = 'sm';

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    is2XLarge,
    breakpoint,
  };
}

/**
 * Get a value based on current breakpoint
 * Similar to React Native's responsive utility
 */
export function useResponsiveValue<T>(values: {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T {
  const { breakpoint } = useResponsive();

  // Find the appropriate value by checking from largest to smallest
  const breakpointOrder: (Breakpoint | 'xs')[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (bp === 'xs') return values.base;
    if (values[bp] !== undefined) return values[bp]!;
  }

  return values.base;
}

/**
 * Media query hook for specific breakpoint checks
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Convenience hooks for common breakpoints
 */
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
