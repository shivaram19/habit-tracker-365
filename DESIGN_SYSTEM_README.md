# Design System Documentation

## Created Files

### Core Theme Files

1. **`src/theme/tokens.ts`** (296 lines)
   - Complete design tokens system
   - Light & dark color palettes (primary, success, error, warning, neutral)
   - Spacing scale (0-96px in 8px increments)
   - Border radius scale
   - Typography (font sizes, weights, line heights)
   - Platform-specific shadows (iOS & Android)
   - Animation timing constants

2. **`src/theme/theme.ts`** (30 lines)
   - Theme creation function
   - Combines tokens with current color scheme
   - Platform-aware shadow helper
   - TypeScript types for theme

3. **`src/theme/responsive.ts`** (36 lines)
   - Breakpoints (phone/tablet/desktop)
   - Responsive utilities
   - Platform detection helpers
   - Helper function for responsive values

4. **`src/theme/index.ts`** (5 lines)
   - Barrel exports for easy imports

### Context & Providers

5. **`src/context/ThemeContext.tsx`** (50 lines)
   - ThemeProvider component
   - useTheme hook
   - Automatic system theme detection
   - Manual theme toggle support
   - State management for current theme

### UI Components

6. **`src/components/shared/ThemeToggle.tsx`** (50 lines)
   - Toggle button for switching themes
   - Animated sun/moon icon
   - Haptic feedback
   - Fully theme-aware

### Example

7. **`DESIGN_SYSTEM_EXAMPLE.tsx`** (148 lines)
   - Complete example of enhanced Button component
   - Shows how to use theme in components
   - Demonstrates all design system features

## How to Use

### 1. Wrap your app with ThemeProvider

```tsx
// app/_layout.tsx
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Use the theme in components

```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { theme, colorScheme, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSizes.lg,
        marginBottom: theme.spacing[4]
      }}>
        Current theme: {colorScheme}
      </Text>
    </View>
  );
}
```

### 3. Add ThemeToggle to Profile or Settings

```tsx
import { ThemeToggle } from '@/components/shared/ThemeToggle';

function ProfileScreen() {
  return (
    <View>
      <ThemeToggle />
      {/* Rest of profile */}
    </View>
  );
}
```

## Design Tokens Structure

### Colors
- **Primary**: Blue shades (50-900)
- **Success**: Green shades (50-900)
- **Error**: Red shades (50-900)
- **Warning**: Yellow/Orange shades (50-900)
- **Neutral**: Gray shades (50-900)
- **Semantic**: background, text, border

### Spacing Scale
```
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### Typography
```
Font Sizes: xs(12) sm(14) base(16) lg(18) xl(20) 2xl(24) 3xl(30) 4xl(36) 5xl(48)
Font Weights: regular(400) medium(500) semibold(600) bold(700)
Line Heights: tight(1.2) normal(1.5) relaxed(1.75)
```

### Border Radius
```
none: 0
sm: 4px
md: 8px
lg: 12px
xl: 16px
2xl: 20px
3xl: 24px
full: 9999px (circle)
```

## Features

- **Dark Mode**: Automatic system detection + manual toggle
- **Type Safe**: Full TypeScript support with IntelliSense
- **Platform Aware**: Different shadows for iOS/Android
- **Responsive**: Breakpoints and helpers for different screen sizes
- **Animated**: Smooth transitions using Moti
- **Accessible**: Proper contrast ratios in both themes
- **Consistent**: Single source of truth for all design values

## Benefits

1. **Consistency**: All components use the same design tokens
2. **Maintainability**: Change once, update everywhere
3. **Dark Mode**: Built-in with proper color inversions
4. **Performance**: Optimized with React context
5. **Developer Experience**: Easy to use with useTheme hook
6. **Scalability**: Easy to add new tokens and themes

## Next Steps

To integrate this into your existing components:

1. Import `useTheme` hook
2. Replace hardcoded values with theme values
3. Add theme-aware styling
4. Test in both light and dark modes

Example transformation:
```tsx
// Before
<View style={{ backgroundColor: '#FFFFFF', padding: 16 }}>

// After
const { theme } = useTheme();
<View style={{
  backgroundColor: theme.colors.background.primary,
  padding: theme.spacing[4]
}}>
```
