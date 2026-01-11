/**
 * Responsive CSS utilities
 * Use these alongside Tailwind classes for complex responsive patterns
 */

// Container widths matching Tailwind defaults
export const containerWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Spacing scale (matching Tailwind)
export const spacing = {
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// Font size scale
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  '5xl': ['3rem', { lineHeight: '1' }],
  '6xl': ['3.75rem', { lineHeight: '1' }],
  '7xl': ['4.5rem', { lineHeight: '1' }],
  '8xl': ['6rem', { lineHeight: '1' }],
  '9xl': ['8rem', { lineHeight: '1' }],
} as const;

/**
 * Common responsive class patterns
 * Copy these into your components for consistent responsive behavior
 */
export const responsivePatterns = {
  // Container with responsive padding
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  
  // Section spacing
  section: 'py-8 sm:py-12 lg:py-16',
  
  // Card grid layouts
  cardGrid: {
    two: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
    three: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
    four: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6',
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  },
  
  // Typography scales
  heading: {
    h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading',
    h2: 'text-2xl sm:text-3xl md:text-4xl font-heading',
    h3: 'text-xl sm:text-2xl md:text-3xl font-heading',
    h4: 'text-lg sm:text-xl md:text-2xl font-heading',
  },
  
  // Body text
  body: {
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
  },
  
  // Flex layouts
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexColReverse: 'flex flex-col-reverse sm:flex-row',
  
  // Stack spacing (vertical)
  stack: {
    sm: 'space-y-2 sm:space-y-3',
    md: 'space-y-4 sm:space-y-6',
    lg: 'space-y-6 sm:space-y-8 lg:space-y-12',
  },
  
  // Inline spacing (horizontal)
  inline: {
    sm: 'space-x-2 sm:space-x-3',
    md: 'space-x-4 sm:space-x-6',
    lg: 'space-x-6 sm:space-x-8',
  },
  
  // Hide/show at breakpoints
  hideOnMobile: 'hidden sm:block',
  hideOnDesktop: 'sm:hidden',
  showOnMobile: 'block sm:hidden',
  showOnDesktop: 'hidden sm:block',
  
  // Button sizes
  button: {
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
  },
  
  // Input sizes
  input: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-4 py-3 text-base sm:text-lg',
  },
  
  // Modal widths
  modal: {
    sm: 'max-w-sm w-full mx-4',
    md: 'max-w-md w-full mx-4',
    lg: 'max-w-lg w-full mx-4',
    xl: 'max-w-xl w-full mx-4',
    full: 'max-w-4xl w-full mx-4',
  },
} as const;

/**
 * CSS-in-JS responsive values helper
 * Use this when you need inline styles that respond to breakpoints
 */
export function responsiveStyle<T extends Record<string, string | number>>(
  styles: {
    base: T;
    sm?: Partial<T>;
    md?: Partial<T>;
    lg?: Partial<T>;
    xl?: Partial<T>;
  },
  currentBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
): T {
  const breakpointOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  let result = { ...styles.base };
  
  const applyBreakpoint = (bp: 'sm' | 'md' | 'lg' | 'xl') => {
    if (styles[bp] && breakpointOrder.indexOf(bp) <= currentIndex) {
      result = { ...result, ...styles[bp] };
    }
  };
  
  applyBreakpoint('sm');
  applyBreakpoint('md');
  applyBreakpoint('lg');
  applyBreakpoint('xl');
  
  return result;
}

/**
 * Clamp utility for fluid typography/spacing
 * Creates CSS clamp() values for smooth responsive scaling
 */
export function fluidValue(
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1280,
  unit: 'rem' | 'px' = 'rem'
): string {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minSize;
  
  return `clamp(${minSize}${unit}, ${yAxisIntersection.toFixed(4)}${unit} + ${(slope * 100).toFixed(4)}vw, ${maxSize}${unit})`;
}

/**
 * Truncate text with ellipsis
 */
export const truncate = {
  single: 'truncate', // Single line
  multiLine: (lines: number) => `line-clamp-${lines}`, // Multi-line (Tailwind plugin)
};
