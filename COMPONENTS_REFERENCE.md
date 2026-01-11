# Component Reference Guide

This is a comprehensive guide to all components in the Habit Tracker 365 application. Perfect for building a website version!

---

## Table of Contents

1. [Shared Components](#shared-components)
2. [Feature Components](#feature-components)
3. [Screen Components](#screen-components)
4. [Heatmap Components](#heatmap-components)
5. [Wrapped/Analytics Components](#wrappedanalytics-components)

---

## Shared Components

These are reusable UI components used throughout the application.

### Button

**File:** [src/components/shared/Button.tsx](src/components/shared/Button.tsx)

**Purpose:** A customizable button component with multiple variants and states.

**Props:**
- `title: string` - Button label
- `onPress: () => void` - Callback function when pressed
- `variant?: 'primary' | 'secondary' | 'danger'` - Visual style (default: 'primary')
- `loading?: boolean` - Shows loading spinner (default: false)
- `disabled?: boolean` - Disables interaction (default: false)
- `fullWidth?: boolean` - Spans full width (default: false)

**Features:**
- Haptic feedback on press
- Theme-aware colors
- Loading spinner support
- Multiple variants with different colors

**Usage:**
```tsx
import { Button } from '@/components/shared/Button';

<Button 
  title="Submit" 
  onPress={handleSubmit}
  variant="primary"
  loading={isLoading}
/>
```

**Used In:** 
- Login/Signup screens
- List item forms
- Modal confirmations
- Painter grid confirmations

---

### Input

**File:** [src/components/shared/Input.tsx](src/components/shared/Input.tsx)

**Purpose:** Text input field with validation, labels, and password visibility toggle.

**Props:**
- `label?: string` - Field label
- `value: string` - Current input value
- `onChangeText: (text: string) => void` - Change callback
- `placeholder?: string` - Placeholder text
- `secureTextEntry?: boolean` - Hides input (for passwords)
- `error?: string` - Error message display
- `autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'` - Capitalization behavior
- `keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'` - Keyboard type
- `editable?: boolean` - Enable/disable editing (default: true)

**Features:**
- Password visibility toggle
- Error message display
- Theme-aware styling
- Custom keyboard types
- Label support

**Usage:**
```tsx
import { Input } from '@/components/shared/Input';

<Input 
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  keyboardType="email-address"
  error={emailError}
/>
```

**Used In:**
- Login screen
- Signup screen
- List item form
- Profile screen

---

### Modal

**File:** [src/components/shared/Modal.tsx](src/components/shared/Modal.tsx)

**Purpose:** Bottom-sheet modal with blur overlay and smooth animations.

**Props:**
- `visible: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `children: React.ReactNode` - Modal content

**Features:**
- Blur overlay background
- Smooth slide-up animation
- Backdrop tap to close
- Responsive height (up to 90% of screen)
- Theme-aware styling

**Usage:**
```tsx
import { Modal } from '@/components/shared/Modal';

<Modal visible={showModal} onClose={() => setShowModal(false)}>
  {/* Modal content goes here */}
</Modal>
```

**Used In:**
- List item form
- Day detail view
- Filtering modals

---

### Card

**File:** [src/components/shared/Card.tsx](src/components/shared/Card.tsx)

**Purpose:** Container component with rounded corners and shadow styling.

**Props:**
- `children: React.ReactNode` - Card content

**Features:**
- Theme-aware background
- Rounded corners (xl)
- Subtle shadow
- Consistent padding

**Usage:**
```tsx
import { Card } from '@/components/shared/Card';

<Card>
  {/* Card content */}
</Card>
```

**Used In:**
- Wrapped/analytics screens
- Statistics display

---

### DraggableHandle

**File:** [src/components/shared/DraggableHandle.tsx](src/components/shared/DraggableHandle.tsx)

**Purpose:** Draggable UI element used to resize panels or drag modals.

**Props:**
- `onDrag: (deltaY: number) => void` - Drag position change callback
- `onDragEnd: () => void` - Callback when drag finishes

**Features:**
- Pan gesture detection
- Haptic feedback
- Animated scale on drag
- Visual grip icon
- React Native Reanimated support

**Usage:**
```tsx
import { DraggableHandle } from '@/components/shared/DraggableHandle';

<DraggableHandle 
  onDrag={handleDrag}
  onDragEnd={handleDragEnd}
/>
```

**Used In:**
- Log screen (to resize category selector)

---

### LoadingSpinner

**File:** [src/components/shared/LoadingSpinner.tsx](src/components/shared/LoadingSpinner.tsx)

**Purpose:** Loading indicator component.

**Props:**
- `size?: 'small' | 'large'` - Spinner size (default: 'large')
- `color?: string` - Spinner color (default: '#3B82F6')

**Features:**
- Centered layout
- Customizable size and color
- Theme-aware default color

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

<LoadingSpinner size="large" color="#3B82F6" />
```

**Used In:**
- Wrapped screen
- When loading data

---

### EmptyState

**File:** [src/components/shared/EmptyState.tsx](src/components/shared/EmptyState.tsx)

**Purpose:** Displays an empty state message with optional icon.

**Props:**
- `icon?: typeof LucideIcon` - Icon component to display
- `title: string` - Empty state title
- `description?: string` - Empty state description
- `message?: string` - Alternative to description

**Features:**
- Icon support from lucide-react-native
- Centered layout
- Customizable messaging

**Usage:**
```tsx
import { EmptyState } from '@/components/shared/EmptyState';
import { Calendar } from 'lucide-react-native';

<EmptyState 
  icon={Calendar}
  title="No data"
  description="Start logging to see your habits here"
/>
```

**Used In:**
- Log screen (when no items)
- Wrapped screen (when no data)

---

### ThemeToggle

**File:** [src/components/shared/ThemeToggle.tsx](src/components/shared/ThemeToggle.tsx)

**Purpose:** Dark/light theme toggle button.

**Props:** None

**Features:**
- Automatic theme switching
- Sun/Moon icons
- Animated rotation
- Haptic feedback
- Theme-aware styling

**Usage:**
```tsx
import { ThemeToggle } from '@/components/shared/ThemeToggle';

<ThemeToggle />
```

**Used In:**
- Profile screen header

---

### ErrorBoundary

**File:** [src/components/shared/ErrorBoundary.tsx](src/components/shared/ErrorBoundary.tsx)

**Purpose:** Class component that catches JavaScript errors in component tree.

**Props:**
- `children: React.ReactNode` - Child components to wrap

**Features:**
- Error catching
- Error display
- Reset button
- Console logging

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Used In:**
- Root layout wrapper

---

## Feature Components

Feature-specific components for core functionality.

### CategoryBubble

**File:** [src/components/features/CategoryBubble.tsx](src/components/features/CategoryBubble.tsx)

**Purpose:** Circular category selector with label and animation.

**Props:**
- `category: Category` - Category object
- `selected: boolean` - Selection state
- `onPress: () => void` - Selection callback
- `labelPosition?: 'top' | 'bottom'` - Label placement (default: 'bottom')

**Features:**
- Animated scale on selection
- Category icon display
- Color-coded based on category
- Haptic feedback
- Flexible label positioning

**Usage:**
```tsx
import { CategoryBubble } from '@/components/features/CategoryBubble';

<CategoryBubble 
  category={category}
  selected={selectedCategory === category.id}
  onPress={() => selectCategory(category.id)}
/>
```

**Used In:**
- Log screen (category selection)

---

### HourBlock

**File:** [src/components/features/HourBlock.tsx](src/components/features/HourBlock.tsx)

**Purpose:** Visual block representing a single hour with category color.

**Props:**
- `hour: number` - Hour number (0-23)
- `categoryId: number` - Associated category ID
- `onPress: () => void` - Click callback
- `size?: 'small' | 'medium' | 'large'` - Block size (default: 'large')

**Features:**
- Multiple size options
- Category color coding
- Hour text display (large size only)
- Rounded corners
- Border styling

**Usage:**
```tsx
import { HourBlock } from '@/components/features/HourBlock';

<HourBlock 
  hour={9}
  categoryId={selectedCategory}
  onPress={() => handleHourClick(9)}
  size="large"
/>
```

**Used In:**
- Painter grid
- Heatmap display

---

### PainterGrid

**File:** [src/components/features/PainterGrid.tsx](src/components/features/PainterGrid.tsx)

**Purpose:** Interactive 24-hour grid for painting/logging activities.

**Props:**
- `hourlyLogs: number[]` - Array of 24 hour category assignments
- `selectedCategory: number` - Currently selected category
- `onHourChange: (hour: number, categoryId: number) => void` - Single hour change
- `onBatchChange: (hours: number[], categoryId: number) => void` - Multiple hours change

**Features:**
- Pan gesture for batch selection
- Overwrite confirmation dialog
- Visual hour blocks
- Haptic feedback
- Undo/batch editing support

**Usage:**
```tsx
import { PainterGrid } from '@/components/features/PainterGrid';

<PainterGrid 
  hourlyLogs={todayLogs}
  selectedCategory={selected}
  onHourChange={updateHour}
  onBatchChange={updateHours}
/>
```

**Used In:**
- Log screen (main activity)

---

### ListItemCard

**File:** [src/components/features/ListItemCard.tsx](src/components/features/ListItemCard.tsx)

**Purpose:** Card displaying a single list item with edit/delete actions.

**Props:**
- `item: ListItem` - The list item to display
- `onEdit?: (item: ListItem) => void` - Edit callback
- `onDelete?: (itemId: string) => void` - Delete callback

**Features:**
- Category color bar
- Item name and price
- Category and date display
- Edit/delete action buttons
- Smooth animations
- Android shadow support

**Usage:**
```tsx
import { ListItemCard } from '@/components/features/ListItemCard';

<ListItemCard 
  item={item}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Used In:**
- List items manager
- Day detail modal

---

### ListItemForm

**File:** [src/components/features/ListItemForm.tsx](src/components/features/ListItemForm.tsx)

**Purpose:** Modal form for adding/editing list items.

**Props:**
- `visible: boolean` - Form visibility
- `onClose: () => void` - Close callback
- `onSubmit: (item) => Promise<void>` - Submit callback
- `initialData?: ListItem` - For editing mode
- `defaultDate: string` - Default date for new items

**Features:**
- Item name input
- Price input with validation
- Category dropdown
- Date picker
- Error handling
- Loading state

**Usage:**
```tsx
import { ListItemForm } from '@/components/features/ListItemForm';

<ListItemForm 
  visible={showForm}
  onClose={() => setShowForm(false)}
  onSubmit={handleSubmit}
  defaultDate={date}
/>
```

**Used In:**
- List items manager

---

### ListItemsManager

**File:** [src/components/features/ListItemsManager.tsx](src/components/features/ListItemsManager.tsx)

**Purpose:** Container component managing list items for a day.

**Props:**
- `userId: string` - User ID
- `dayId: string` - Day ID
- `date: string` - Date string
- `onItemsChange?: () => void` - Change callback

**Features:**
- List item CRUD operations
- Category filtering
- Add/edit/delete functionality
- Empty state handling
- Loading state
- Error handling

**Usage:**
```tsx
import { ListItemsManager } from '@/components/features/ListItemsManager';

<ListItemsManager 
  userId={user.id}
  dayId={dayId}
  date={date}
  onItemsChange={() => refetch()}
/>
```

**Used In:**
- Log screen

---

## Screen Components

Full-screen components used as page layouts.

### LoginScreen

**File:** [src/components/screens/LoginScreen.tsx](src/components/screens/LoginScreen.tsx)

**Purpose:** Authentication screen for user login.

**Features:**
- Email input
- Password input
- Login button
- Sign up link
- Form validation
- Error handling
- Smooth animations
- Loading state
- Theme support

**Usage:**
```tsx
import { LoginScreen } from '@/components/screens/LoginScreen';

export default function Login() {
  return <LoginScreen />;
}
```

**Used In:**
- `/app/auth/login`

---

### SignupScreen

**File:** [src/components/screens/SignupScreen.tsx](src/components/screens/SignupScreen.tsx)

**Purpose:** Authentication screen for user registration.

**Features:**
- Name input
- Email input
- Password input
- Confirm password input
- Password strength indicator
- Form validation
- Sign up button
- Login link
- Smooth animations
- Theme support

**Usage:**
```tsx
import { SignupScreen } from '@/components/screens/SignupScreen';

export default function Signup() {
  return <SignupScreen />;
}
```

**Used In:**
- `/app/auth/signup`

---

## Heatmap Components

Components for displaying historical activity heatmap.

### CategoryLegend

**File:** [src/components/features/heatmap/CategoryLegend.tsx](src/components/features/heatmap/CategoryLegend.tsx)

**Purpose:** Legend showing all category colors.

**Features:**
- Horizontal scrollable layout
- Color dot and category name
- All categories plus empty state

**Usage:**
```tsx
import { CategoryLegend } from '@/components/features/heatmap/CategoryLegend';

<CategoryLegend />
```

**Used In:**
- History screen

---

### HeatmapDayRow

**File:** [src/components/features/heatmap/HeatmapDayRow.tsx](src/components/features/heatmap/HeatmapDayRow.tsx)

**Purpose:** Single day row in heatmap showing 24 hours.

**Props:**
- `date: string` - Date string
- `hourlyLogs: number[]` - Array of 24 hour categories
- `onPress: () => void` - Click callback

**Features:**
- Day of week and date display
- 24 hour blocks with colors
- Smooth animation
- Tap to expand detail

**Usage:**
```tsx
import { HeatmapDayRow } from '@/components/features/heatmap/HeatmapDayRow';

<HeatmapDayRow 
  date="2026-01-11"
  hourlyLogs={logs}
  onPress={handlePress}
/>
```

**Used In:**
- Heatmap month section

---

### HeatmapMonthSection

**File:** [src/components/features/heatmap/HeatmapMonthSection.tsx](src/components/features/heatmap/HeatmapMonthSection.tsx)

**Purpose:** Month section containing multiple day rows.

**Props:**
- `month: string` - Month name
- `days: Day[]` - Days in month
- `onDayPress: (day: Day) => void` - Day click callback

**Features:**
- Month title header
- Multiple day rows
- Organized by month

**Usage:**
```tsx
import { HeatmapMonthSection } from '@/components/features/heatmap/HeatmapMonthSection';

<HeatmapMonthSection 
  month="January"
  days={daysInMonth}
  onDayPress={handleDayPress}
/>
```

**Used In:**
- History screen

---

### DayDetailModal

**File:** [src/components/features/heatmap/DayDetailModal.tsx](src/components/features/heatmap/DayDetailModal.tsx)

**Purpose:** Modal showing detailed breakdown of a single day.

**Props:**
- `visible: boolean` - Modal visibility
- `day: Day | null` - Day data to display
- `onClose: () => void` - Close callback

**Features:**
- Date and highlight display
- 24-hour breakdown
- Category summaries with hour counts
- List items for the day
- Category color coding
- Smooth scrolling

**Usage:**
```tsx
import { DayDetailModal } from '@/components/features/heatmap/DayDetailModal';

<DayDetailModal 
  visible={showDetail}
  day={selectedDay}
  onClose={() => setShowDetail(false)}
/>
```

**Used In:**
- History screen

---

### HistoryFilter

**File:** [src/components/features/heatmap/HistoryFilter.tsx](src/components/features/heatmap/HistoryFilter.tsx)

**Purpose:** Filter modal for searching and filtering history data.

**Props:**
- `filters: FilterOptions` - Current filter state
- `onFiltersChange: (filters) => void` - Filter change callback
- `onClearFilters: () => void` - Clear filters callback

**Features:**
- Search query input
- Category filter dropdown
- Min/max spend range
- Apply/clear buttons
- Active filter indicator

**Usage:**
```tsx
import { HistoryFilter } from '@/components/features/heatmap/HistoryFilter';

<HistoryFilter 
  filters={filters}
  onFiltersChange={setFilters}
  onClearFilters={handleClear}
/>
```

**Used In:**
- History screen

---

### MonthSelector

**File:** [src/components/features/heatmap/MonthSelector.tsx](src/components/features/heatmap/MonthSelector.tsx)

**Purpose:** Month selector tabs for navigation.

**Props:**
- `selectedMonth: number` - Current month (0-11)
- `year: number` - Year
- `onMonthSelect: (month: number) => void` - Selection callback
- `onTodayPress: () => void` - Today button callback

**Features:**
- All 12 months as selectable chips
- Animation on selection
- Current month indicator
- Today navigation

**Usage:**
```tsx
import { MonthSelector } from '@/components/features/heatmap/MonthSelector';

<MonthSelector 
  selectedMonth={month}
  year={2026}
  onMonthSelect={setMonth}
  onTodayPress={goToToday}
/>
```

**Used In:**
- History screen

---

## Wrapped/Analytics Components

Components for yearly analytics and statistics.

### YearSelector

**File:** [src/components/features/wrapped/YearSelector.tsx](src/components/features/wrapped/YearSelector.tsx)

**Purpose:** Year selector for viewing different years' analytics.

**Props:**
- `years: number[]` - Available years
- `selectedYear: number` - Current year
- `onYearSelect: (year: number) => void` - Selection callback

**Features:**
- Horizontal scrollable year chips
- Current year indicator
- Animated selection

**Usage:**
```tsx
import { YearSelector } from '@/components/features/wrapped/YearSelector';

<YearSelector 
  years={[2024, 2025, 2026]}
  selectedYear={2026}
  onYearSelect={setYear}
/>
```

**Used In:**
- Wrapped screen

---

### StatCard

**File:** [src/components/features/wrapped/StatCard.tsx](src/components/features/wrapped/StatCard.tsx)

**Purpose:** Card displaying a single statistic.

**Props:**
- `icon: LucideIcon` - Icon component
- `label: string` - Stat label
- `value: string | number` - Stat value
- `color?: string` - Theme color (default: '#3B82F6')
- `delay?: number` - Animation delay in ms

**Features:**
- Icon display with colored background
- Customizable color
- Animated entrance
- Responsive sizing
- Android shadow support

**Usage:**
```tsx
import { StatCard } from '@/components/features/wrapped/StatCard';
import { Flame } from 'lucide-react-native';

<StatCard 
  icon={Flame}
  label="Streak"
  value={7}
  color="#FF6B35"
  delay={0}
/>
```

**Used In:**
- Wrapped screen

---

### DonutChart

**File:** [src/components/features/wrapped/DonutChart.tsx](src/components/features/wrapped/DonutChart.tsx)

**Purpose:** Donut/pie chart showing category distribution.

**Props:**
- `data: CategoryStats[]` - Category statistics
- `totalHours: number` - Total hours tracked

**Features:**
- Top 6 categories display
- Percentage calculations
- Animated bar fills
- Color-coded by category
- Hours and percentage labels
- Smooth staggered animations

**Usage:**
```tsx
import { DonutChart } from '@/components/features/wrapped/DonutChart';

<DonutChart 
  data={categoryStats}
  totalHours={totalTrackedHours}
/>
```

**Used In:**
- Wrapped screen

---

### LineChart

**File:** [src/components/features/wrapped/LineChart.tsx](src/components/features/wrapped/LineChart.tsx)

**Purpose:** Line chart showing monthly spending trend.

**Props:**
- `data: MonthlySpending[]` - Monthly spending data

**Features:**
- Line visualization
- Point markers
- Animated line drawing
- Month labels
- Responsive sizing
- Total spending display

**Usage:**
```tsx
import { LineChart } from '@/components/features/wrapped/LineChart';

<LineChart data={monthlySpending} />
```

**Used In:**
- Wrapped screen

---

### TopItemsList

**File:** [src/components/features/wrapped/TopItemsList.tsx](src/components/features/wrapped/TopItemsList.tsx)

**Purpose:** List of top items by count or spending.

**Props:**
- `title: string` - Section title
- `items: TopItem[]` - Items to display
- `showSpend?: boolean` - Show spending column (default: false)

**Features:**
- Ranked badge (1, 2, 3...)
- Item name display
- Count display
- Optional spending display
- Smooth staggered animations
- Empty state handling

**Usage:**
```tsx
import { TopItemsList } from '@/components/features/wrapped/TopItemsList';

<TopItemsList 
  title="Top Categories"
  items={topCategories}
  showSpend={true}
/>
```

**Used In:**
- Wrapped screen

---

## Component Architecture Diagram

```
Root (ErrorBoundary, Providers)
├── Shared Components (Button, Input, Modal, etc.)
├── Auth Screens
│   ├── LoginScreen
│   └── SignupScreen
├── Tab Navigation
│   ├── Log Screen
│   │   ├── CategoryBubble
│   │   ├── PainterGrid
│   │   │   └── HourBlock
│   │   └── ListItemsManager
│   │       ├── ListItemCard
│   │       └── ListItemForm
│   ├── History Screen
│   │   ├── CategoryLegend
│   │   ├── MonthSelector
│   │   ├── HeatmapMonthSection
│   │   │   └── HeatmapDayRow
│   │   ├── DayDetailModal
│   │   └── HistoryFilter
│   ├── Wrapped Screen
│   │   ├── YearSelector
│   │   ├── StatCard
│   │   ├── DonutChart
│   │   ├── LineChart
│   │   └── TopItemsList
│   └── Profile Screen
└── Error Boundary
```

---

## Key Props Interface

### Category

```tsx
interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  type?: string;
  requiresSpending?: boolean;
}
```

### ListItem

```tsx
interface ListItem {
  id: string;
  user_id: string;
  day_id: string;
  name: string;
  price: number;
  category: number;
  date: string;
  created_at: string;
  updated_at: string;
}
```

### Day

```tsx
interface Day {
  id: string;
  date: string;
  hourly_logs: number[];
  highlight?: string;
  items?: ListItem[];
}
```

### CategoryStats

```tsx
interface CategoryStats {
  id: number;
  name: string;
  color: string;
  hours: number;
  percentage: number;
}
```

---

## Theming

All components are theme-aware and respect light/dark mode through the ThemeContext:

- **Colors:** Primary, secondary, neutral, error, success, warning
- **Typography:** Font sizes, weights, families
- **Spacing:** Consistent spacing scale
- **Border Radius:** Multiple radius sizes
- **Shadows:** Elevation levels for depth

---

## Common Patterns

### Loading States
Most data-fetching components support loading indicators via `LoadingSpinner` or `ActivityIndicator`.

### Error Handling
Form components display errors inline. Screens handle errors with toast notifications.

### Animations
Components use `moti` for smooth animations and `react-native-reanimated` for complex gestures.

### Theme Support
All components access theme via `useTheme()` hook.

### Haptic Feedback
Interactive elements provide haptic feedback on iOS devices.

---

## Best Practices for Web Version

When converting to web:

1. **Replace React Native components** with web equivalents
2. **Adapt gesture handlers** (pan/swipe) to mouse events
3. **Use web-friendly animations** (CSS or Framer Motion)
4. **Adjust sizing** for larger screens (responsive design)
5. **Theme system** translates well, consider CSS-in-JS or Tailwind
6. **Modal behavior** can use HTML dialog or similar
7. **Icons** (lucide-react) work identically on web
8. **Touch interactions** → Click/hover interactions

---

Last Updated: January 11, 2026
