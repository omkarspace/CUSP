# CUSP

> On the edge of a win — every guess is a transaction.

CUSP turns the familiar rhythm of Wordle into a tense, reward-driven casino experience. Players wager chips on each round, climb comps tiers, build hot streaks, and compete on weekly leaderboards. The core game loop challenges players to guess words, win chips, unlock harder rooms, and elevate their high-roller status.

---

## 🎰 Core Features

- **The Chip Economy:** Every guess is a transaction. Wager stakes, lock in payouts for correct letters, and manage your bankroll.
- **High-Stakes Mechanics:** Activate **Double Down** to double your potential winnings (all or nothing), or **Fold** to salvage your remaining chips.
- **Daily Rewards:** Spin the Daily Wheel to claim chips, with bonuses scaled by your daily login streak.
- **Comps Tiers:** Climb from Bronze up to the exclusive **Black Card** status as your lifetime chips earned increase.
- **The Board:** A weekly leaderboard to see how your wagering skills rank against other players.
- **Procedural Sound FX:** High-fidelity game sounds generated procedurally in real-time using the browser's Web Audio API.

---

## 📱 Progressive Web App (PWA) Integration

CUSP is fully equipped with Progressive Web App features for a native app feel on mobile and desktop:

- **Web App Manifest (`/manifest.webmanifest`):** Automatically compiled by Next.js, defining standalone portrait layout, dark status bar, and brand-matching colors.
- **Service Worker (`/sw.js`):** Intercepts requests to cache static scripts, stylesheets, custom Web Fonts, and vector branding. It applies a **Network-First** strategy for page navigation and a **Stale-While-Revalidate** strategy for assets.
- **Custom Install Prompt:** A custom, animated bottom banner built with Framer Motion that appears on eligible devices, encouraging players to add CUSP to their home screens.
- **Offline Fallback Page (`/offline`):** A custom connection-lost card that displays when the user is disconnected, preventing default browser offline pages and allowing quick connection retries.
- **Dynamic Icons:** Dynamic Next.js Route Handlers (`/icon-192.png`, `/icon-512.png`, `/icon-maskable.png`) that render vector branding to pixel-perfect PNG layouts at runtime.

---

## 🛠️ Technology Stack

- **Core:** Next.js (App Router), React, TypeScript
- **Database & Auth:** Supabase (via `@supabase/ssr` & `@supabase/supabase-js`)
- **Styling:** Tailwind CSS (v4)
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Audio:** Custom Web Audio API synthesizers

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Environment Setup

Create a `.env.local` file in the root directory and configure your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. Database Migration & Seeding

Deploy your database schema to Supabase and seed your initial master account:

```bash
# Seed the initial master account record (1,000 chips bankroll)
npm run seed:master
```

### 4. Running the Development Server

Start the local server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

Build the project for production:

```bash
npm run build
```

This compiles static pages, dynamic route icons, and builds the service worker resources.

---

## 🎨 Brand Guidelines (`DESIGN.md`)

- **Creative North Star:** "The Felt Palette". Warm neutral foundations with deep teal accents. Contrast and typography carry the layout.
- **No-Shadow Rule:** Tonal layering (canvas → surface → surface-elevated) is used for depth instead of drop shadows.
- **No-Green Rule:** Green is reserved for low-end casino floors. CUSP uses deep teal (`#0D7377` / `#1A8A8E`) for "Correct" and refined gold (`#B8862C` / `#D4A44A`) for "Wins" and "Present" tiles.
