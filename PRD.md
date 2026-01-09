# Product Requirements Document (PRD)
## ChromaLife - Day Tracker Mobile Application

**Document Version:** 1.0
**Last Updated:** January 9, 2026
**Project Status:** Migration to Backend API Architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [What We Built](#what-we-built)
4. [Current Tech Stack](#current-tech-stack)
5. [Proposed Tech Stack](#proposed-tech-stack)
6. [Migration Strategy](#migration-strategy)
7. [Technical Requirements](#technical-requirements)
8. [API Specifications](#api-specifications)
9. [Database Schema](#database-schema)
10. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Executive Summary

**ChromaLife (Day Tracker)** is a mobile time-tracking application that enables users to log their hourly activities, visualize time usage patterns, track spending, and gain insights through comprehensive analytics.

### What Happened Till Now

1. **Initial Development** (Current Phase)
   - Built complete React Native/Expo frontend with 4 main screens
   - Implemented Supabase as direct backend (PostgreSQL + Auth + API)
   - Developed hourly logging system with gesture-based "painter grid"
   - Created GitHub-style heatmap for historical data visualization
   - Built analytics dashboard ("Wrapped") with charts and statistics
   - Integrated authentication with email/password
   - Deployed database with Row Level Security (RLS)
   - Implemented data export functionality

2. **Current Challenge**
   - Frontend directly communicates with Supabase (serverless)
   - Need to migrate to traditional backend API architecture
   - Desire for more control over business logic
   - Requirement for custom API endpoints and middleware
   - Need for better separation of concerns

### Project Vision

Maintain the existing high-quality React Native frontend while building a robust, scalable backend API using Node.js, Express.js, Prisma ORM, and PostgreSQL to enable:
- Custom business logic middleware
- Enhanced API flexibility
- Better error handling and logging
- Microservice architecture readiness
- Third-party integrations capability

---

## 2. Current State Analysis

### What's Working

- **Fully functional mobile app** with polished UI/UX
- **4 complete user flows:**
  1. Authentication (signup/login)
  2. Hourly activity logging with drag-to-paint
  3. Historical data visualization (heatmap)
  4. Annual analytics and statistics
- **Real-time data persistence** via Supabase
- **Secure authentication** with JWT tokens
- **Optimized performance** using TanStack Query caching
- **Cross-platform compatibility** (iOS, Android, Web)

### Current Limitations

1. **Architecture Constraints**
   - Frontend tightly coupled to Supabase SDK
   - Limited middleware capabilities
   - Cannot add custom business logic layer
   - Difficult to implement complex queries
   - Third-party API integrations challenging

2. **Development Workflow**
   - Direct database queries from frontend
   - RLS policies manage security (limited flexibility)
   - No centralized error handling
   - Limited logging and monitoring

3. **Scalability Concerns**
   - Cannot easily add background jobs
   - No request rate limiting control
   - Difficult to implement caching strategies
   - Limited control over database connection pooling

---

## 3. What We Built

### Core Features Implemented

#### 3.1 Authentication System
- Email/password registration and login
- Secure JWT token management
- Automatic session persistence
- Profile creation on signup
- Logout with token cleanup

**Screens:**
- Login screen with form validation
- Signup screen with name, email, password
- Auto-redirect based on auth state

#### 3.2 Hourly Activity Logging ("Log" Tab)

**Key Functionality:**
- 24-hour interactive grid (00:00 - 23:00)
- Drag-to-paint gesture for batch hour assignment
- 12 predefined activity categories with unique colors:
  - Sleep (Blue)
  - Work (Green)
  - Exercise (Orange)
  - Food (Red)
  - Shopping (Purple)
  - Social (Pink)
  - Entertainment (Yellow)
  - Travel (Teal)
  - Learning (Indigo)
  - Chores (Gray)
  - Health (Cyan)
  - Other (Neutral)

**Advanced Features:**
- Date navigation (past, present, future)
- "Today" quick navigation button
- Overwrite warning when changing logged hours
- Daily spending amount input
- Optional "highlight" text field for memorable moments
- List items management for Food and Shopping categories
  - Item name and price tracking
  - Automatic daily total calculation

**UI Features:**
- Draggable divider between categories and grid
- Persistent divider position per user
- Smooth gesture animations with haptic feedback
- Responsive layout for all screen sizes

#### 3.3 Historical Data Visualization ("History" Tab)

**Heatmap View:**
- GitHub contribution-style heatmap
- 364-day historical view (52 weeks × 7 days)
- Color intensity based on hours logged per day
- Organized by month sections
- Scrollable timeline with current date indicator

**Day Detail Modal:**
- Opens when tapping any heatmap cell
- Displays 24-hour breakdown with category colors
- Shows daily spending and highlight text
- Lists all items logged that day

**Filtering System:**
- Search by highlight text
- Filter by specific category
- Filter by spending range (min/max)
- Combined filters for precise queries

**Navigation:**
- Month selector dropdown
- Scrollable vertical list
- Performance-optimized with FlashList

#### 3.4 Analytics Dashboard ("Wrapped" Tab)

**Annual Statistics:**
- Total hours logged in the year
- Most frequent activity category
- Busiest month
- Total spending across all categories

**Streak Tracking:**
- Longest work streak (consecutive days)
- Longest exercise streak

**Visualizations:**

1. **Category Distribution Donut Chart**
   - Percentage breakdown by category
   - Color-coded segments
   - Interactive legend

2. **Monthly Spending Line Chart**
   - Spending trends over 12 months
   - Category-specific breakdown
   - Visual trend identification

3. **Top Items Lists**
   - Top 10 Food items (by frequency)
   - Top 10 Shopping items (by spending)
   - Item name, count, and total amount

**Features:**
- Multi-year support with year selector
- Automatic calculation engine
- Empty state handling for new users

#### 3.5 Profile Management ("Profile" Tab)

**Account Settings:**
- Display current email
- Editable display name
- Theme toggle (light/dark mode)
- Data export to JSON
- Sign out button

**Data Export:**
- Exports profile, all days, and all list items
- JSON format for portability
- Cross-platform sharing (native share sheet)

### Technical Accomplishments

1. **Performance Optimization**
   - FlashList for 365+ day rendering
   - TanStack Query with smart caching (5-min stale time)
   - Gesture handler for smooth drag interactions
   - Lazy loading for charts and large datasets

2. **User Experience**
   - Smooth animations throughout
   - Haptic feedback on interactions
   - Toast notifications for user feedback
   - Loading states and error handling
   - Responsive design for all screen sizes

3. **Code Quality**
   - TypeScript for type safety
   - Modular component architecture
   - Reusable custom hooks
   - Separation of concerns (services, hooks, components)
   - Error boundaries for graceful error handling

4. **Security**
   - Row Level Security (RLS) on all tables
   - JWT token secure storage
   - Email/password authentication
   - User data isolation

---

## 4. Current Tech Stack

### Frontend (React Native/Expo)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.81.4 | Core framework |
| **Expo** | 54.0.10 | Development platform |
| **Expo Router** | 6.0.8 | File-based navigation |
| **TypeScript** | 5.9.2 | Type safety |
| **NativeWind** | 4.2.1 | Styling (Tailwind CSS) |
| **TanStack Query** | 5.90.16 | Data fetching & caching |
| **React Hook Form** | 7.69.0 | Form management |
| **Victory Native** | 41.20.2 | Charts & visualizations |
| **Lucide React Native** | 0.544.0 | Icon library |
| **React Native Reanimated** | 4.1.1 | Animations |
| **React Native Gesture Handler** | 2.28.0 | Touch gestures |
| **Expo Haptics** | 15.0.7 | Haptic feedback |
| **Expo Secure Store** | 15.0.8 | Token storage |
| **Expo File System** | 19.0.21 | File operations |
| **Expo Sharing** | 14.0.8 | Share functionality |

### Backend (Current - Supabase)

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (BaaS) |
| **PostgreSQL** | Database (managed by Supabase) |
| **Supabase Auth** | User authentication |
| **Supabase Client SDK** | Direct database queries |
| **PostgREST** | Auto-generated REST API |
| **Row Level Security** | Data access control |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Babel** | JavaScript transpilation |
| **Metro Bundler** | JavaScript bundling |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

---

## 5. Proposed Tech Stack

### Frontend (No Changes)

**Keep existing React Native/Expo stack** - Already optimized and production-ready

### Backend (New Architecture)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x LTS | JavaScript runtime |
| **Express.js** | 4.x | Web framework |
| **Prisma ORM** | 5.x | Database ORM |
| **PostgreSQL** | 15.x | Relational database |
| **TypeScript** | 5.x | Type safety |
| **JWT (jsonwebtoken)** | 9.x | Authentication tokens |
| **bcrypt** | 5.x | Password hashing |
| **Zod** | 3.x | Request validation |
| **Winston** | 3.x | Logging |
| **cors** | 2.x | CORS middleware |
| **helmet** | 7.x | Security headers |
| **express-rate-limit** | 7.x | Rate limiting |
| **dotenv** | 16.x | Environment variables |

### Additional Backend Tools

| Tool | Purpose |
|------|---------|
| **Prisma Studio** | Database GUI |
| **Nodemon** | Development auto-reload |
| **Jest** | Testing framework |
| **Supertest** | API testing |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

### Infrastructure (Optional)

| Service | Purpose |
|---------|---------|
| **Docker** | Containerization |
| **PM2** | Process management |
| **Nginx** | Reverse proxy |
| **PostgreSQL** | Self-hosted or managed (AWS RDS, DigitalOcean, etc.) |

---

## 6. Migration Strategy

### Phase 1: Backend Setup (Week 1)

**Objective:** Set up new Node.js/Express backend with Prisma

#### Tasks:
1. Initialize Node.js project with TypeScript
2. Set up Express.js server with middleware
3. Install and configure Prisma ORM
4. Create PostgreSQL database (new or migrate from Supabase)
5. Define Prisma schema from existing Supabase schema
6. Set up environment variables and configuration
7. Implement error handling middleware
8. Add logging with Winston
9. Configure CORS for mobile app

**Deliverables:**
- Running Express server on port 3000
- Prisma connected to PostgreSQL
- Basic health check endpoint
- Environment configuration

### Phase 2: Database Migration (Week 1-2)

**Objective:** Migrate database schema and data

#### Tasks:
1. Create Prisma schema matching Supabase schema
2. Generate Prisma migrations
3. Export data from Supabase (if needed)
4. Run migrations on new PostgreSQL database
5. Import data (if exporting from Supabase)
6. Verify data integrity
7. Set up database connection pooling

**Deliverables:**
- Complete database schema in PostgreSQL
- All existing data migrated (if applicable)
- Prisma Client generated and functional

### Phase 3: Authentication API (Week 2)

**Objective:** Build auth endpoints and JWT system

#### Tasks:
1. Implement user registration endpoint
2. Implement login endpoint with JWT generation
3. Add password hashing with bcrypt
4. Create JWT middleware for protected routes
5. Add refresh token endpoint
6. Implement logout endpoint
7. Add profile creation on signup
8. Test all auth flows

**Endpoints:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Phase 4: Core API Development (Week 3)

**Objective:** Build all CRUD endpoints for logs, items, profile

#### Tasks:
1. Implement day logs endpoints
2. Implement list items endpoints
3. Implement profile endpoints
4. Add input validation with Zod
5. Add error handling for all routes
6. Implement pagination where needed
7. Add request logging
8. Test all endpoints

**Endpoints:**
- Days: `GET/POST/PUT /api/days`
- Items: `GET/POST/DELETE /api/items`
- Profile: `GET/PUT /api/profile`

### Phase 5: Analytics API (Week 3-4)

**Objective:** Build statistics and analytics endpoints

#### Tasks:
1. Implement wrapped stats endpoint
2. Implement monthly spending endpoint
3. Optimize queries with Prisma aggregations
4. Add caching for expensive queries
5. Test with large datasets
6. Optimize performance

**Endpoints:**
- `GET /api/stats/wrapped/:year`
- `GET /api/stats/monthly-spending`
- `GET /api/stats/available-years`

### Phase 6: Frontend Migration (Week 4-5)

**Objective:** Update React Native app to use new API

#### Tasks:
1. Create new API service layer (replace Supabase SDK)
2. Update authentication service to use new endpoints
3. Update logs service to use REST API
4. Update stats service to use new endpoints
5. Update profile service
6. Remove Supabase dependencies
7. Test all app flows
8. Handle API errors gracefully
9. Update environment variables

**Changes:**
- Replace `@supabase/supabase-js` with `axios` or `fetch`
- Update all service files in `/src/services/`
- Modify token storage and retrieval
- Update API base URL configuration

### Phase 7: Testing & Optimization (Week 5-6)

**Objective:** Comprehensive testing and performance optimization

#### Tasks:
1. Write unit tests for all API endpoints
2. Write integration tests
3. Load testing with large datasets
4. Optimize database queries
5. Add database indexes
6. Implement caching strategy
7. Set up monitoring and logging
8. Security audit

### Phase 8: Deployment (Week 6)

**Objective:** Deploy backend to production

#### Tasks:
1. Choose hosting provider (AWS, DigitalOcean, Railway, etc.)
2. Set up production PostgreSQL database
3. Configure environment variables
4. Deploy backend application
5. Set up SSL/HTTPS
6. Configure domain/subdomain
7. Set up monitoring and alerts
8. Update mobile app with production API URL
9. Perform smoke tests

---

## 7. Technical Requirements

### 7.1 Backend Architecture

**Project Structure:**
```
/backend
├── /src
│   ├── /config
│   │   ├── database.ts       # Prisma client
│   │   ├── env.ts            # Environment variables
│   │   └── logger.ts         # Winston config
│   ├── /controllers
│   │   ├── auth.controller.ts
│   │   ├── days.controller.ts
│   │   ├── items.controller.ts
│   │   ├── profile.controller.ts
│   │   └── stats.controller.ts
│   ├── /middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validator.middleware.ts
│   │   └── logger.middleware.ts
│   ├── /routes
│   │   ├── auth.routes.ts
│   │   ├── days.routes.ts
│   │   ├── items.routes.ts
│   │   ├── profile.routes.ts
│   │   └── stats.routes.ts
│   ├── /services
│   │   ├── auth.service.ts
│   │   ├── days.service.ts
│   │   ├── items.service.ts
│   │   ├── profile.service.ts
│   │   └── stats.service.ts
│   ├── /utils
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   └── date.util.ts
│   ├── /types
│   │   └── index.ts
│   └── index.ts              # Express app
├── /prisma
│   ├── schema.prisma
│   └── /migrations
├── /tests
│   ├── /integration
│   └── /unit
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

### 7.2 API Design Principles

1. **RESTful Architecture**
   - Use standard HTTP methods (GET, POST, PUT, DELETE)
   - Resource-based URLs
   - Proper status codes

2. **Consistent Response Format**
```typescript
// Success Response
{
  success: true,
  data: {...},
  message?: string
}

// Error Response
{
  success: false,
  error: {
    message: string,
    code: string,
    details?: any
  }
}
```

3. **Authentication**
   - JWT Bearer tokens in Authorization header
   - Refresh token mechanism
   - Token expiration: 24 hours (access), 7 days (refresh)

4. **Validation**
   - Zod schemas for all inputs
   - Sanitize user inputs
   - Type-safe request/response

5. **Error Handling**
   - Centralized error middleware
   - Structured error responses
   - Logging all errors

6. **Security**
   - Helmet.js for security headers
   - CORS configuration
   - Rate limiting (100 requests/15 min per IP)
   - SQL injection prevention (Prisma parameterized queries)
   - XSS protection

### 7.3 Database Requirements

**Connection:**
- Connection pooling (max 20 connections)
- Timeout: 30 seconds
- Retry logic for transient failures

**Indexes:**
```sql
-- Critical indexes for performance
CREATE INDEX idx_days_user_date ON days(user_id, date);
CREATE INDEX idx_days_user_id ON days(user_id);
CREATE INDEX idx_list_items_day_id ON list_items(day_id);
CREATE INDEX idx_list_items_user_date ON list_items(user_id, date);
CREATE INDEX idx_profiles_id ON profiles(id);
```

**Migrations:**
- Use Prisma Migrate for version control
- Always test migrations on dev/staging first
- Keep rollback scripts for critical migrations

---

## 8. API Specifications

### 8.1 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

Request:
{
  "refreshToken": "refresh_token"
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 8.2 Days/Logs Endpoints

#### Create or Update Day
```http
POST /api/days
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "date": "2026-01-09",
  "hourlyLogs": [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3, 1, 1, 1, 1, 4, 4, 5, 6, 0, 0, 0],
  "totalSpend": 45.50,
  "highlight": "Great productive day!"
}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "date": "2026-01-09",
    "hourlyLogs": [0, 0, ...],
    "totalSpend": 45.50,
    "highlight": "Great productive day!",
    "createdAt": "2026-01-09T12:00:00Z",
    "updatedAt": "2026-01-09T12:00:00Z"
  }
}
```

#### Get Single Day
```http
GET /api/days/2026-01-09
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "date": "2026-01-09",
    "hourlyLogs": [0, 0, ...],
    "totalSpend": 45.50,
    "highlight": "Great productive day!",
    "items": [
      {
        "id": "uuid",
        "name": "Lunch",
        "category": 3,
        "price": 15.50
      }
    ]
  }
}
```

#### Get Date Range
```http
GET /api/days/range?start=2026-01-01&end=2026-01-31
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "date": "2026-01-09",
      "hourlyLogs": [0, 0, ...],
      "totalSpend": 45.50,
      "highlight": "Great productive day!"
    }
    // ... more days
  ]
}
```

### 8.3 List Items Endpoints

#### Create Item
```http
POST /api/items
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "dayId": "uuid",
  "date": "2026-01-09",
  "category": 3,
  "name": "Lunch at cafe",
  "price": 15.50
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "dayId": "uuid",
    "userId": "uuid",
    "date": "2026-01-09",
    "category": 3,
    "name": "Lunch at cafe",
    "price": 15.50,
    "createdAt": "2026-01-09T12:00:00Z"
  }
}
```

#### Get Items
```http
GET /api/items?date=2026-01-09&category=3&search=lunch
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "date": "2026-01-09",
      "category": 3,
      "name": "Lunch at cafe",
      "price": 15.50
    }
  ]
}
```

#### Delete Item
```http
DELETE /api/items/{itemId}
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "message": "Item deleted successfully"
}
```

### 8.4 Profile Endpoints

#### Get Profile
```http
GET /api/profile
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "dividerPosition": 50,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-09T12:00:00Z"
  }
}
```

#### Update Profile
```http
PUT /api/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "name": "John Updated",
  "dividerPosition": 60
}

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Updated",
    "dividerPosition": 60,
    "updatedAt": "2026-01-09T13:00:00Z"
  }
}
```

### 8.5 Statistics Endpoints

#### Get Wrapped Stats
```http
GET /api/stats/wrapped/2026
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "year": 2026,
    "totalHours": 2450,
    "topCategory": {
      "id": 1,
      "name": "Work",
      "hours": 1200
    },
    "busiestMonth": {
      "month": 3,
      "hours": 250
    },
    "totalSpending": 15430.50,
    "streaks": {
      "longestWork": 45,
      "longestExercise": 30
    },
    "categoryDistribution": [
      {
        "category": 1,
        "name": "Work",
        "hours": 1200,
        "percentage": 48.9
      }
      // ... other categories
    ],
    "topFoodItems": [
      {
        "name": "Coffee",
        "count": 156,
        "totalSpent": 780.00
      }
      // ... top 10
    ],
    "topShoppingItems": [
      {
        "name": "Groceries",
        "count": 52,
        "totalSpent": 3250.00
      }
      // ... top 10
    ]
  }
}
```

#### Get Monthly Spending
```http
GET /api/stats/monthly-spending
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": [
    {
      "month": 1,
      "year": 2026,
      "categories": {
        "3": 450.00,  // Food
        "4": 320.00   // Shopping
      },
      "total": 770.00
    }
    // ... 12 months
  ]
}
```

#### Get Available Years
```http
GET /api/stats/available-years
Authorization: Bearer {accessToken}

Response (200):
{
  "success": true,
  "data": {
    "years": [2024, 2025, 2026]
  }
}
```

---

## 9. Database Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  profile   Profile?
  days      Day[]
  listItems ListItem[]

  @@map("users")
}

model Profile {
  id              String   @id @default(uuid())
  userId          String   @unique @map("user_id")
  dividerPosition Int      @default(50) @map("divider_position")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Day {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  date       String   // YYYY-MM-DD format
  hourlyLogs Int[]    @map("hourly_logs") // Array of 24 integers
  totalSpend Decimal  @default(0) @map("total_spend") @db.Decimal(10, 2)
  highlight  String?
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  listItems ListItem[]

  @@unique([userId, date])
  @@index([userId, date])
  @@index([userId])
  @@map("days")
}

model ListItem {
  id        String   @id @default(uuid())
  dayId     String   @map("day_id")
  userId    String   @map("user_id")
  date      String   // YYYY-MM-DD
  category  Int
  name      String
  price     Decimal  @db.Decimal(10, 2)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  day  Day  @relation(fields: [dayId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([dayId])
  @@index([userId, date])
  @@map("list_items")
}

// Refresh Tokens for JWT
model RefreshToken {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([token])
  @@map("refresh_tokens")
}
```

### Migration from Supabase

**Option 1: Start Fresh**
- Create new PostgreSQL database
- Run Prisma migrations
- Users re-register (clean start)

**Option 2: Data Migration**
1. Export data from Supabase:
   ```sql
   COPY (SELECT * FROM profiles) TO '/tmp/profiles.csv' CSV HEADER;
   COPY (SELECT * FROM days) TO '/tmp/days.csv' CSV HEADER;
   COPY (SELECT * FROM list_items) TO '/tmp/list_items.csv' CSV HEADER;
   ```

2. Import to new PostgreSQL:
   ```sql
   COPY profiles FROM '/tmp/profiles.csv' CSV HEADER;
   COPY days FROM '/tmp/days.csv' CSV HEADER;
   COPY list_items FROM '/tmp/list_items.csv' CSV HEADER;
   ```

3. Handle passwords:
   - Users will need to reset passwords (Supabase uses different hashing)
   - OR implement password migration endpoint

---

## 10. Implementation Roadmap

### Sprint 1: Backend Foundation (Week 1)
- [ ] Initialize Node.js/Express project
- [ ] Set up TypeScript configuration
- [ ] Install Prisma and configure database
- [ ] Create Prisma schema
- [ ] Set up middleware (CORS, Helmet, logging)
- [ ] Implement health check endpoint
- [ ] Set up environment configuration

**Success Criteria:**
- Server runs on localhost:3000
- `/health` endpoint returns 200 OK
- Prisma connects to PostgreSQL successfully

### Sprint 2: Authentication System (Week 2)
- [ ] Implement JWT utilities (sign, verify)
- [ ] Create password hashing utilities (bcrypt)
- [ ] Build authentication middleware
- [ ] Implement registration endpoint
- [ ] Implement login endpoint
- [ ] Implement refresh token logic
- [ ] Add logout endpoint
- [ ] Write authentication tests

**Success Criteria:**
- Users can register with email/password
- Users can login and receive JWT
- Protected routes verify JWT correctly
- Refresh tokens work properly

### Sprint 3: Core API (Week 3)
- [ ] Implement Days CRUD endpoints
- [ ] Implement List Items CRUD endpoints
- [ ] Implement Profile endpoints
- [ ] Add input validation with Zod
- [ ] Implement error handling
- [ ] Add request logging
- [ ] Write integration tests

**Success Criteria:**
- All CRUD operations work for days
- List items can be created/deleted
- Profile updates persist correctly
- All endpoints validate input

### Sprint 4: Analytics & Stats (Week 3-4)
- [ ] Implement wrapped stats calculation
- [ ] Implement monthly spending aggregation
- [ ] Optimize database queries
- [ ] Add caching for expensive queries
- [ ] Calculate streaks correctly
- [ ] Write stats calculation tests

**Success Criteria:**
- Wrapped endpoint returns correct annual stats
- Monthly spending calculated accurately
- Queries perform well with large datasets (10k+ days)

### Sprint 5: Frontend Integration (Week 4-5)
- [ ] Create new API service layer in React Native app
- [ ] Replace Supabase SDK with Axios/Fetch
- [ ] Update auth service to use new API
- [ ] Update logs service
- [ ] Update stats service
- [ ] Update profile service
- [ ] Remove Supabase dependencies
- [ ] Test all app flows end-to-end

**Success Criteria:**
- App connects to new backend API
- All features work identically to before
- No Supabase code remains
- Token storage works correctly

### Sprint 6: Testing & Polish (Week 5-6)
- [ ] Write comprehensive unit tests
- [ ] Write integration tests for all endpoints
- [ ] Perform load testing
- [ ] Add database indexes
- [ ] Optimize slow queries
- [ ] Set up error monitoring
- [ ] Security audit
- [ ] Documentation complete

**Success Criteria:**
- 80%+ test coverage
- API handles 100+ concurrent requests
- All queries under 100ms
- No security vulnerabilities

### Sprint 7: Deployment (Week 6)
- [ ] Choose hosting provider
- [ ] Set up production database
- [ ] Deploy backend application
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring and logging
- [ ] Update mobile app with production API
- [ ] Perform smoke tests
- [ ] Create runbook for operations

**Success Criteria:**
- Backend deployed and accessible
- Mobile app connects to production
- Monitoring and alerts active
- All production tests passing

---

## Success Metrics

### Technical Metrics
- API response time < 100ms (95th percentile)
- 99.9% uptime
- Zero data loss during migration
- 100% feature parity with current app

### User Experience
- No disruption to existing users
- Seamless authentication flow
- All data accessible post-migration
- App performance matches or exceeds current

### Development
- Complete API documentation
- 80%+ test coverage
- CI/CD pipeline operational
- Monitoring and logging in place

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Data loss during migration | High | Backup all data, test migration in staging first |
| Performance degradation | Medium | Load testing, indexing, query optimization |
| Authentication issues | High | Comprehensive testing, gradual rollout |
| Mobile app breaking changes | High | Maintain backward compatibility, version API |
| Deployment challenges | Medium | Use proven hosting platforms, Docker for consistency |
| Timeline overruns | Medium | Build in buffer time, prioritize MVP features |

---

## Conclusion

This migration from Supabase to a custom Node.js/Express/Prisma/PostgreSQL backend will provide:

1. **Greater Control** - Full control over business logic and data access
2. **Scalability** - Better prepared for future growth and feature additions
3. **Flexibility** - Easier to implement complex features and integrations
4. **Separation of Concerns** - Clean architecture with distinct layers
5. **Industry Standard** - Using widely adopted technologies with strong communities

The existing React Native frontend is production-ready and will require minimal changes. The focus is entirely on building a robust, well-architected backend that can support the app's current features and future growth.

**Estimated Timeline:** 6 weeks
**Team Required:** 1-2 backend developers, 1 mobile developer
**Budget Consideration:** Hosting costs ($20-100/month depending on provider)

---

## Appendix

### A. Environment Variables

**Backend (.env):**
```env
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chromalife

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8081

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Mobile App (.env):**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### B. Useful Commands

**Backend:**
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

**Mobile App:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for iOS
npm run build:ios

# Build for Android
npm run build:android
```

---

**Document End**
