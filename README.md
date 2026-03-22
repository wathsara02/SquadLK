# 🎮 Squad Finder LK

Welcome to **Squad Finder LK**, a dedicated web platform built for gamers in Sri Lanka to find their perfect teammates, manage comprehensive game profiles, and build localized communities.

## 🚀 Overview

Gamers in Sri Lanka often have to rely on generic Facebook groups or Discord servers to find teammates. **Squad Finder LK** aims to streamline this by providing a robust, searchable, and dedicated platform where players can be filtered by district, preferred language, gaming platform, play styles, and game-specific ranks.

Currently in **Phase 1 (MVP Core)**, the platform supports fully dynamic rank tracking, advanced player discovery, and secure user profiles.

## ✨ Features

- **Robust Authentication:** Secure email/password login and registration powered by **NextAuth.js**.
- **User Onboarding:** Capture local variables such as Sri Lankan District, languages spoken (Sinhala, English, Tamil), and play styles (Casual, Tryhard, Competitive, etc.).
- **Dynamic Game Profiles:** Users can add multiple games to their profile, specifying their IGN, platform, and precise Rank.
- **Dynamic CMS Rank System:** The Admin Dashboard allows for the creation of new Games on the fly. Admins can define exact rank list structures (e.g., Bronze, Silver, Radiant) which immediately dictate what users can select as their rank without modifying code.
- **Advanced Player Discovery:** Find active players using the frontend Discover page with database-backed search queries overriding URL params.
- **Messaging Foundation:** The backend data structure is already laid out for friend requests and direct messaging.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Authentication:** NextAuth.js (Credentials Provider with `bcryptjs`)
- **Styling:** CSS Modules & Global Vanilla CSS

## 💻 Local Setup & Development

Follow these steps to initialize your local development environment.

### 1. Prerequisites
- Node.js installed
- A local or remote PostgreSQL database instance running

### 2. Environment Variables
Create a `.env` file in the root directory and add the following securely:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/squadlk?schema=public"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Initialization
Push the Prisma schema to your PostgreSQL database and generate the Prisma client mappings:
```bash
npx prisma db push
npx prisma generate
```

### 4. Seed the Database
Populate the database with default games (Valorant, PUBG, CS2, etc.), localized rank structures, and 25 mock players to test the Discover page filters immediately:
```bash
npm run prisma seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 👑 Default Admin Credentials
To access the Admin Dashboard (`/admin/games`) and manipulate dynamic ranking lists:
- **Email**: `admin@squadfinder.lk`
- **Password**: `password123`

---
*Built as a bespoke solution to connect the Sri Lankan gaming community.*
