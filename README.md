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

### Mobile App
- **Framework**: Expo + React Native
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + TanStack Query
- **Charts**: Victory Native
- **Icons**: Lucide React Native
- **Language**: TypeScript

### Backend API
- **Framework**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Language**: TypeScript
- **File Storage**: Local filesystem

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (free tier recommended)
- Expo Go app (for testing on mobile device)

## Setup Instructions

### 1. Clone and Install

```bash
# Install all dependencies (root, mobile, and api)
npm run install:all
```

### 2. Database Setup

Create a PostgreSQL database (use any free tier provider like Supabase, ElephantSQL, Railway, or Neon).

Get your connection string in this format:
```
postgresql://username:password@host:5432/database_name
```

### 3. Configure API Environment

Create `api/.env` file:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

Run database migrations:

```bash
npm run api:migrate
```

### 4. Configure Mobile App Environment

Create `mobile/.env` file:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

For production, use your deployed API URL.

## Running the App

### Development Mode (Both Services)

Start both the API server and mobile app:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - API Server
npm run api:dev

# Terminal 2 - Mobile App
npm run mobile:dev
```

The mobile app can be accessed by:
- Press `w` to open in web browser
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` to open iOS simulator (macOS only)
- Press `a` to open Android emulator

### API Only

```bash
npm run api:dev
```

API will be available at `http://localhost:3000`

### Mobile App Only

```bash
npm run mobile:dev
```

### Type Checking

Run TypeScript type checking for both projects:

```bash
npm run typecheck
```

## Project Structure

```
/
├── api/                     # Express API Server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, error handling
│   │   ├── config/         # Database, JWT config
│   │   ├── scripts/        # Migration scripts
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── mobile/                  # Expo Mobile App
│   ├── app/                # Routes (Expo Router)
│   │   ├── (tabs)/        # Main tab navigation
│   │   │   ├── log.tsx    # Hourly logging
│   │   │   ├── history.tsx # Heatmap view
│   │   │   ├── wrapped.tsx # Analytics
│   │   │   └── profile.tsx # User profile
│   │   ├── auth/          # Auth screens
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utilities
│   ├── assets/            # Static files
│   ├── package.json
│   └── tsconfig.json
├── package.json            # Root workspace config
└── DEPLOYMENT.md          # Deployment guide
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
