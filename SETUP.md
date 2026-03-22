# Squad Finder LK - Local Setup Guide

Follow these steps to initialize your Phase 1 local development environment.

## 1. Environment variables
Ensure you have a `.env` file in the `squad-finder-lk` root containing:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/squad_finder?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 2. Database Initialization
Run the following commands to push the schema to PostgreSQL and generate the client:
```bash
npx prisma db push
npx prisma generate
```

## 3. Seeding the Database
Populate the database with the pre-configured 7 games (Valorant, PUBG, etc.) and 25 test users:
```bash
npx prisma db seed
# Or manually if needed: npx tsx prisma/seed.ts
```

## 4. Default Admin Test Credentials
Use the super admin account to access the dashboard (`/admin/games`):
- **Email**: `admin@squadfinder.lk`
- **Password**: `password123`

## 5. Running the App
Start the Next.js development server:
```bash
cd squad-finder-lk
npm run dev
```

## 6. QA Checklist
- [ ] Log in as Admin and verify the Games & Ranks list is populated.
- [ ] Create a new Game configuration and specify some rank options.
- [ ] Sign up as a new user or log in as a seeded player (`player1@test.com` / `password123`).
- [ ] Complete the onboarding district/platform selection.
- [ ] Add a Game Profile from your dashboard (`/profile/games`) and verify rank dropdowns load correctly.
- [ ] Visit the Discover page and test filtering by Game, District, and Play Style.
