# Prisma Integration & Security Implementation Plan

## Current Status

### ✅ Completed Steps

1. **Updated package.json**
   - Added Prisma dependencies: `@prisma/client`, `prisma`
   - Added security packages: `helmet`, `express-rate-limit`, `compression`, `morgan`
   - Updated scripts for Prisma commands

2. **Created Prisma Configuration**
   - `api/prisma/schema.prisma` - Database schema with User, Profile, Day, ListItem models
   - `api/prisma/seed.ts` - Seed script with demo account
   - `api/src/config/prisma.ts` - Prisma client singleton

3. **Created Security Middleware**
   - `api/src/middleware/security.ts` - Rate limiting, password validation, input sanitization

4. **Updated Services**
   - `authService.ts` - Now uses Prisma
   - `profileService.ts` - Now uses Prisma
   - `statsService.ts` - Now uses Prisma with new stats logic

### 🔄 Remaining Steps

5. **Install Dependencies**
   ```bash
   cd api
   npm install
   ```

6. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

7. **Update Routes** (if needed)
   - auth routes already use security middleware
   - Update statsRoutes to match new service methods

8. **Update Main Server**
   - Add Helmet security headers
   - Add compression
   - Add logging (Morgan)
   - Add input sanitization
   - Add rate limiting

9. **Database Setup**
   - Set DATABASE_URL in `.env`
   - Run migrations: `npm run migrate:dev`
   - Seed database: `npm run db:seed`

10. **Configure APK Build**
    - Update `mobile/app.json`
    - Create `mobile/eas.json`
    - Update `.env` files

## Next Steps for You

### 1. Install Dependencies

```bash
cd api
npm install
```

This installs all the new packages (Prisma, Helmet, etc.)

### 2. Set Up Environment Variables

Create `api/.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="<generate-strong-random-32-char-string>"
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Generate Prisma Client

```bash
cd api
npm run db:generate
```

This creates the typed Prisma client from your schema.

### 4. Run Database Migrations

```bash
npm run migrate:dev
```

This creates the database tables.

### 5. Seed Demo Data

```bash
npm run db:seed
```

Creates demo account:
- Email: demo@chromalife.app
- Password: Demo123!@#

### 6. Test the API

```bash
cd api
npm run dev
```

Test endpoints:
- GET `http://localhost:3000/health` - Should return 200
- POST `http://localhost:3000/api/auth/signup` - Create account
- POST `http://localhost:3000/api/auth/login` - Get token

### 7. Test Mobile App

```bash
cd mobile
npm install  # if needed
npm run dev
```

## Database Schema

Your new Prisma schema includes:

### User
- id (UUID)
- email (unique)
- passwordHash
- name (optional)
- timestamps

### Profile
- id (UUID)
- userId (unique, foreign key)
- name (optional)
- dividerPosition (default 50)
- timestamps

### Day
- id (UUID)
- userId (foreign key)
- date (Date, unique per user)
- hourlyLogs (Int array)
- totalSpend (Decimal)
- highlight (optional text)
- timestamps

### ListItem
- id (UUID)
- dayId (foreign key)
- userId (foreign key)
- category (Int)
- name (String)
- price (Decimal)
- date (Date)
- timestamps

## Security Features Added

1. **Rate Limiting**
   - Auth endpoints: 5 attempts/15min
   - API endpoints: 100 requests/15min
   - Upload endpoints: 10 uploads/hour

2. **Password Requirements**
   - Minimum 8 characters
   - Must have uppercase, lowercase, number, special char
   - Blocks common passwords

3. **Security Headers (Helmet)**
   - CSP, XSS Protection, Frame Options
   - Prevents common attacks

4. **Input Sanitization**
   - Removes dangerous characters
   - Prevents injection attacks

5. **Request Compression**
   - Reduces bandwidth
   - Faster responses

6. **Logging**
   - Morgan for request logging
   - Different modes for dev/production

## APK Build Configuration

Files to configure:

### mobile/app.json
```json
{
  "expo": {
    "name": "ChromaLife",
    "slug": "chromalife",
    "android": {
      "package": "com.chromalife.app"
    }
  }
}
```

### mobile/eas.json
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### mobile/.env
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## Commands Reference

### Development
```bash
# Root
npm run dev              # Start both API and mobile
npm run api:dev          # Start API only
npm run mobile:dev       # Start mobile only

# API
cd api
npm run dev              # Start dev server
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database
npm run migrate:dev      # Create/apply migration
npm run db:generate      # Generate Prisma Client

# Mobile
cd mobile
npm run dev              # Start Expo
eas build --platform android --profile preview  # Build APK
```

## Troubleshooting

### "Can't find module '@prisma/client'"
```bash
cd api
npm run db:generate
```

### "PrismaClient unable to connect"
- Check DATABASE_URL in `.env`
- Verify database is running
- Test: `cd api && npx prisma db pull`

### "Rate limit error"
- Normal! Security working
- Wait 15 minutes or restart server

### TypeScript errors
```bash
cd api
npm run db:generate
npx tsc --noEmit
```

## Documentation

See these files for details:
- `SETUP_GUIDE.md` - Complete setup instructions
- `SECURITY_REVIEW.md` - Security checklist
- `PRISMA_INTEGRATION.md` - Prisma usage guide
- `BUILD_APK.md` - APK building guide

## Support

If you encounter issues:
1. Check error messages
2. Verify `.env` files
3. Ensure database is accessible
4. Clear node_modules and reinstall
5. Regenerate Prisma client

