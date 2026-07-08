<p align="center">
  <img src="public/icon.svg" width="128" height="128" alt="CUSP Logo">
</p>

<h1 align="center">CUSP</h1>

<p align="center"><strong>On the edge of a win — every guess is a transaction.</strong></p>

---

CUSP turns the familiar rhythm of Wordle into a tense, reward-driven casino experience. Players wager chips on each round, climb comps tiers, build hot streaks, and compete on weekly leaderboards. The core game loop challenges players to guess words, win chips, unlock harder rooms, and elevate their high-roller status.

---

## 🎰 Core Features

- **The Chip Economy:** Every guess is a transaction. Wager stakes, lock in payouts for correct letters, and manage your bankroll.
- **High-Stakes Mechanics:** Activate **Double Down** on Row 4 to double your potential winnings (all or nothing), or **Fold** to salvage your remaining chips.
- **Daily Rewards:** Claim free daily comps scaled by your login streak, or spin the Daily Wheel when you go bankrupt for a stimulus check.
- **Comps Tiers:** Climb from Bronze up to the exclusive **Black Card** status as your lifetime chips earned increase.
- **Trophies & Badges:** Unlock and display earned achievements such as *Lucky Guess* (Row 1 win) or *Unstoppable* (10-win streak).
- **The Board:** A weekly competitive leaderboard to see how your wagering skills rank against other players, resetting every Monday at 00:00 with massive prizes for the top 50.
- **Procedural Sound FX:** High-fidelity game sounds generated procedurally in real-time using the browser's Web Audio API and Howler.js.

---

## 🎮 Game Modes

CUSP features three game modes targeting different bankroll and skill levels:

| Mode | Entry Cost | Requirements | Rewards | Description |
|---|---|---|---|---|
| **Daily High Stakes** | 10 chips | Once per day | Leaderboard Posting | The standard daily challenge. Test your word skills and post your score to the weekly board. |
| **Infinite Cash Run** | 50 chips | Unlimited entry | Standard Payouts | Practice your strategies, build streaks, and grind your bankroll with endless games. |
| **High Roller Penthouse** | 50 chips | 5,000+ chips & 3+ Hot Streak | **2.0x Payouts** | The ultimate VIP lounge. High stakes, strict requirements, but twice the payouts. |

---

## 📊 The Economy & Cost Matrix

Each row in CUSP has a submit cost and a payout if solved at that row. Payouts are multiplied by **Heat Streak Multipliers** and **Mode Multipliers** (2x in High Roller mode).

### Base Cost & Payout Matrix

| Row | Cost to Submit | Payout if Solved | Net Profit (Base) |
|:---:|:---:|:---:|:---:|
| **1** | -10 chips | +200 chips | **+190** |
| **2** | -15 chips | +150 chips | **+125** |
| **3** | -20 chips | +100 chips | **+55** |
| **4** | -25 chips | +60 chips | **+5** |
| **5** | -30 chips | +40 chips | **-35** |
| **6** | -40 chips | +20 chips | **-100** |
| **Fail / Bankrupt** | -40 chips (row 6 fail) | 0 chips | **-140** |

### Heat Streak Multipliers
Consecutive wins build your heat streak and scale your payouts:
- **3+ Win Streak:** 1.2x payouts
- **5+ Win Streak:** 1.5x payouts
- **10+ Win Streak:** 2.0x payouts

---

## 🛍️ The Hint Marketplace

When you need an edge at the table, visit the Hint Marketplace to purchase game-assisting utilities:

- **Peek (`-30 chips`):** Instantly reveals the first letter of the target word.
- **Card Count (`-15 chips`):** Burns 3 random absent letters from the virtual keyboard (maximum 2 times per game).
- **Insurance (`-25 chips`):** Can be purchased on Row 1. If you go bankrupt in the round, you get a 50% refund of all total accumulated row costs.

---

## 🏆 Comps & Trophies System

### Comps Tiers
Your comps status escalates as your lifetime chips earned increase:
- **Bronze:** Entry level
- **Silver:** Regular lounge access
- **Gold:** Premium comp tier
- **Platinum:** High-Roller VIP status (20k+ lifetime chips)
- **Black Card:** The ultimate Penthouse tier (100k+ lifetime chips)

### Unlockable Trophies
Earn badges stored permanently on the blockchain (or rather, PostgreSQL database):
- `first_win`: **First Win** – Win your first game.
- `unstoppable`: **Unstoppable** – Reach a 10-game Hot Streak.
- `high_roller`: **High Roller** – Reach Platinum tier (20,000+ lifetime chips).
- `whale`: **Whale** – Reach Black Card status (100,000+ lifetime chips).
- `grinder`: **The Grinder** – Play 100 games.
- `lucky_guess`: **Lucky Guess** – Solve the word on Row 1.
- `loyal_patron`: **Loyal Patron** – Reach a 7-day login streak.
- `board_king`: **Board King** – Awarded to the #1 player on the weekly leaderboard when it resets.

---

## 📅 Weekly Leaderboard Reset & Prizes

The weekly leaderboard resets every Monday at 00:00 (via pg_cron or manual maintenance). 
Top 50 players receive cash prizes credited directly to their bankroll:

- **1st Place:** 500 chips + the exclusive **Board King** trophy
- **2nd & 3rd Place:** 200 chips
- **4th to 10th Place:** 100 chips
- **11th to 50th Place:** 25 chips

*Note: All weekly earnings are reset to 0 after prizes are distributed.*

---

## 📱 Progressive Web App (PWA) Integration

CUSP is fully equipped with Progressive Web App features for a native app feel on mobile and desktop:

- **Web App Manifest (`src/app/manifest.ts`):** Automatically compiled by Next.js, defining standalone portrait layout, dark status bar, and brand-matching colors.
- **Service Worker (`public/sw.js`):** Intercepts requests to cache static scripts, stylesheets, custom Web Fonts, and vector branding. It applies a **Network-First** strategy for page navigation and a **Stale-While-Revalidate** strategy for assets.
- **Custom Install Prompt:** An animated bottom banner built with Framer Motion that appears on eligible devices, encouraging players to add CUSP to their home screens.
- **Offline Fallback Page (`/offline`):** A custom connection-lost card that displays when the user is disconnected, preventing default browser offline pages and allowing quick connection retries.
- **Dynamic Icons:** Dynamic Next.js Route Handlers (`/icon.svg` vector source rendering to `/icon-192.png`, `/icon-512.png`, `/icon-maskable.png`) that render vector branding to pixel-perfect PNG layouts at runtime.

---

## 🎨 Brand & Design Guidelines (`DESIGN.md`)

- **Creative North Star:** "The Felt Palette". Warm neutral foundations with deep teal accents. Contrast and typography carry the layout.
- **No-Shadow Rule:** Tonal layering (canvas → surface → surface-elevated) is used for depth instead of drop shadows. Shadows are reserved exclusively for tile glows on reveal.
- **No-Green Rule:** Green is reserved for low-end casino floors. CUSP uses deep teal (`#0D7377` / `#1A8A8E`) for "Correct" and refined gold (`#B8862C` / `#D4A44A`) for "Wins" and "Present" tiles.
- **Typography:** The layout is carried entirely by **Inter** (sans-serif) for labels and copy, and **JetBrains Mono** (monospace) for all numeric values, chip amounts, and streaks.

---

## 🛠️ Technology Stack

- **Core:** Next.js (App Router), React, TypeScript
- **Database & Auth:** Supabase (via `@supabase/ssr` & `@supabase/supabase-js`)
- **Styling:** Tailwind CSS (v4)
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Audio:** Howler.js (Custom Web Audio API synthesizers)

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Environment Setup

Create a `.env.local` file in the root directory and configure your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 3. Database Migrations

Apply the migration scripts in the SQL editor of your Supabase project:
1. Run `supabase/migrations/001_add_engagement_features.sql` to set up columns for login streaks, comps levels, and the trophies table.
2. Sign up your master user account (`master@gmail.com`) via the signup API, then run `supabase/migrations/002_seed_master_account.sql` to confirm the email and seed the `THE_HOUSE` profile with 1,000 chips.

Alternatively, you can seed the database locally with:
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
