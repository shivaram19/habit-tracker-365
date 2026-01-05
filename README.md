# Day Tracker

A beautiful mobile app for tracking your life by the hour. Log what you're doing each hour with categories and colors, visualize your time with stunning heatmaps, and get your yearly "Wrapped" stats.

## Features

### Hourly Logging
- Log activities for each hour of the day
- Choose from 9 predefined categories or create custom ones
- Rich color-coded system for visual organization
- Quick logging with a simple, intuitive interface

### History & Heatmap
- GitHub-style contribution heatmap showing your logged hours
- Visual overview of your entire month at a glance
- Detailed day view with all your logged activities
- Filter logs by category
- Color-coded visualization based on activity categories

### Wrapped Analytics
- Yearly stats showing your most tracked activities
- Top 10 most logged items
- Total hours tracked over the year
- Beautiful donut charts showing category distribution
- Line charts showing monthly tracking trends
- Streak tracking and consistency metrics

### Profile Management
- Edit your profile information
- Export your data as JSON or CSV
- Track your overall statistics
- Delete account option

## Tech Stack

- **Framework**: Expo + React Native
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password)
- **State Management**: React Context + TanStack Query
- **Charts**: Victory Native
- **Icons**: Lucide React Native
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app (for testing on mobile device)
- Supabase account (already configured)

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Variables

The project comes with a `.env` file that includes your Supabase configuration. These are already set up:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 3. Database Setup

The database is already configured with Supabase. The following tables are set up:

- **profiles** - User profile information
- **logs** - Hourly activity logs with categories and colors
- **list_items** - Custom tracking items (categories)

All tables have Row Level Security (RLS) enabled for data protection.

## Running the App

### Development Mode

Start the Expo development server:

```bash
npm run dev
```

This will start the Expo development server. You can then:

- Press `w` to open in web browser
- Scan the QR code with Expo Go app (iOS/Android) to run on your phone
- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator

### Web Build

To build for web deployment:

```bash
npm run build:web
```

The output will be in the `dist` folder.

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

### Linting

Run the linter:

```bash
npm run lint
```

## Project Structure

```
├── app/                      # Routes (Expo Router)
│   ├── (tabs)/              # Main tab navigation
│   │   ├── log.tsx          # Hourly logging screen
│   │   ├── history.tsx      # Heatmap & history view
│   │   ├── wrapped.tsx      # Yearly analytics
│   │   └── profile.tsx      # User profile
│   ├── auth/                # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── src/
│   ├── components/          # React components
│   │   ├── features/        # Feature-specific components
│   │   ├── screens/         # Screen components
│   │   └── shared/          # Reusable UI components
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ToastContext.tsx # Toast notifications
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API & Supabase services
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── assets/                  # Images and static files
└── supabase/               # Database migrations (if any)
```

## Key Features Explained

### Painter Grid

The hourly logging interface features a "painter grid" where you can:
- Tap any hour block to log an activity
- Select from your custom tracking items
- Each hour displays the activity name and category color
- Visual feedback shows which hours are logged

### Category System

9 predefined categories with distinct colors:
- Work (Blue)
- Exercise (Green)
- Social (Purple)
- Learning (Orange)
- Entertainment (Pink)
- Health (Teal)
- Chores (Gray)
- Creative (Indigo)
- Other (Slate)

Users can create custom items within these categories.

### Data Export

Export your entire tracking history:
- JSON format for backup/migration
- CSV format for spreadsheet analysis
- Includes all logs with timestamps and categories

## Authentication

The app uses Supabase authentication with email/password:

1. **Sign Up**: Create account with email, password, and name
2. **Login**: Secure authentication with session management
3. **Auto-login**: Sessions persist across app restarts
4. **Secure**: Row Level Security ensures users only access their own data

## Database Schema

### profiles
- User information (name, email, created date)
- Linked to Supabase auth.users

### logs
- Hourly activity logs
- Fields: date, hour, list_item_id, notes
- Timestamps for creation/updates

### list_items
- Custom tracking items
- Fields: name, category, color, user_id
- Used for categorizing activities

## Troubleshooting

### App won't start
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules && npm install`
- Clear Expo cache: `npx expo start -c`

### Database connection issues
- Check that `.env` file exists and contains valid Supabase credentials
- Verify Supabase project is active

### Build errors
- Run `npm run typecheck` to identify TypeScript errors
- Ensure all imports are correct
- Check that all required dependencies are installed

## Development Tips

- Use the web version for rapid development and debugging
- Test on physical devices for accurate performance testing
- Check React Native docs for platform-specific behavior
- Use the TypeScript compiler to catch errors early

## Contributing

This is a personal tracking app, but feel free to fork and customize for your own use!

## License

Private project - all rights reserved.
