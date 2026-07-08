# CUSP — Engagement & Retention Design

## Overview

A thin meta-game layer over the existing CUSP game. No new game modes, no complex UI. Six interconnected features that add daily ritual, progression, and social status.

---

## 1. Casino Terminology Rename

| Current | New | Scope |
|---|---|---|
| Heat Streak | **Hot Streak** | Global find-replace |
| Daily High Stakes | **The Daily Jackpot** | mode-selector, lobby |
| Infinite Cash Run | **The Grind** | mode-selector |
| High Roller Lounge | **The Penthouse** | mode-selector |
| Daily Wheel | **Daily Comp** | daily-wheel component |
| Hints | **House Perks** | action-deck |
| Leaderboard | **The Board** | nav, page title |
| High-Rollers Lounge | **The Board** | leaderboard page |
| Cashier | **Profile** | nav |
| Lobby | **Lobby** | nav (unchanged) |

---

## 2. Difficulty Levels (Tied to Game Mode)

Three word pools instead of one. No UI changes — words are selected server-side based on mode.

| Mode | Difficulty | Word Pool | Payout Multiplier |
|---|---|---|---|
| The Daily Jackpot | **Standard** | Current word list | 1.0x (unchanged) |
| The Grind | **Easy → Escalates** | Starts easy, pool narrows per win | 1.0x base (higher volume) |
| The Penthouse | **Hard** | Rare letters, fewer vowels | 2.0x base payouts |

### Penthouse unlock rework
- Entry cost: 50 chips (same)
- Unlock: 5,000 chips bankroll (same)
- Difficulty: Only words with rare letters (J, Q, X, Z, V, K, W) or unusual letter patterns
- Payout: All payouts multiplied by 2x to compensate for difficulty

### The Grind escalation
- Wins 1-3: Easy pool (common letters, high-frequency words)
- Wins 4-6: Standard pool
- Wins 7+: Hard pool
- Resets per session (new entry = fresh start)

---

## 3. Login Streak (Daily Comp)

Replace the current "claim when broke" wheel with a daily login bonus.

### Mechanics
- Consecutive days logged in = streak counter
- Streak resets if >48h without login
- Bonus chips awarded daily on first visit

### Bonus Scale
| Day | Bonus |
|---|---|
| 1 | 10 chips |
| 2 | 15 chips |
| 3 | 25 chips |
| 4 | 35 chips |
| 5 | 50 chips |
| 6 | 75 chips |
| 7+ | 100 chips |

### Trophy
- **"Loyal Patron"** — Reach a 7-day login streak

### DB changes
- Add `profiles.login_streak INT DEFAULT 0`
- Add `profiles.last_login_date DATE`

### Implementation
- On dashboard load (server component), check if today > last_login_date
- If yes: increment streak, award bonus, update last_login_date
- If >2 days gap: reset streak to 1, award day-1 bonus
- The `DailyWheel` component becomes the "Daily Comp" claim UI

---

## 4. Comps Levels (Tiers)

Lifetime chips earned (sum of all payouts across all games) = XP for tier progression.

### Tiers

| Tier | Chips Earned | Perks |
|---|---|---|
| Bronze | 0 | None |
| Silver | 1,000 | Free Card Count once/day |
| Gold | 5,000 | Free Insurance once/day |
| Platinum | 20,000 | 2x Daily Comp |
| Diamond | 50,000 | Custom tile color |
| Black Card | 100,000 | All above + weekly bonus |

### Trophy
- **"High Roller"** — Reach Platinum tier (20K lifetime chips)
- **"Whale"** — Reach Black Card (100K)

### DB changes
- Add `profiles.comps_level TEXT DEFAULT 'BRONZE'`
- Add `profiles.lifetime_chips_earned INT DEFAULT 0`

### Logic
- Update `lifetime_chips_earned` in `submitGuess` when game ends (WON status)
- Calculate tier from lifetime_chips_earned in profile queries
- Perks checked server-side in game-actions

---

## 5. Trophies (6 Achievements)

Simple achievement badges stored in a `trophies` table. Shown on profile and Player Card.

### Trophy List

| Trophy | Trigger | Rarity |
|---|---|---|
| **"First Win"** | Win your first game | Common |
| **"Unstoppable"** | Reach 10-win Hot Streak | Rare |
| **"High Roller"** | Reach Platinum tier (20K lifetime) | Rare |
| **"Whale"** | Reach Black Card (100K lifetime) | Legendary |
| **"The Grinder"** | Play 100 games | Epic |
| **"Board King"** | Finish #1 on The Board (weekly) | Legendary |
| **"Lucky Guess"** | Win on Row 1 | Rare |
| **"Loyal Patron"** | Reach 7-day login streak | Epic |

### DB changes
- New table: `trophies` (user_id UUID, trophy_id TEXT, earned_at TIMESTAMPTZ)
- Check and insert trophies on game end + daily login

---

## 6. The Board (Weekly Leaderboard)

Reset-to-zero weekly leaderboard showing chips earned this week.

### Mechanics
- New `weekly_chips_earned` column on profiles
- Incremented on each WIN (the escrow payout amount)
- Resets to 0 every Monday via pg_cron
- The Board ranks by weekly_chips_earned for the current week

### Rewards (paid Monday)
| Rank | Prize |
|---|---|
| 1 | 500 chips |
| 2-3 | 200 chips |
| 4-10 | 100 chips |
| 11-50 | 25 chips |

### Trophy
- **"Board King"** — Finish #1 in any week

### DB changes
- Add `profiles.weekly_chips_earned INT DEFAULT 0`

---

## 7. Player Card (Shareable Profile)

Upgrade the existing share-card to show tier, trophies, and stats in a clean card format.

### Content
- Username
- Comps Level badge (Bronze → Black Card)
- Bankroll
- Hot Streak count
- Trophy icons (earned trophies displayed)
- Shareable text/image

---

## DB Schema Changes Summary

```sql
-- Profiles additions
ALTER TABLE profiles ADD COLUMN login_streak INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN last_login_date DATE;
ALTER TABLE profiles ADD COLUMN comps_level TEXT DEFAULT 'BRONZE';
ALTER TABLE profiles ADD COLUMN lifetime_chips_earned INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN weekly_chips_earned INT DEFAULT 0;

-- New table
CREATE TABLE trophies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  trophy_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, trophy_id)
);
```

---

## Implementation Order

| Phase | Items | Effort |
|---|---|---|
| **Phase 1** | Casino rename (UI strings) + Difficulty word pools | Small |
| **Phase 2a** | Login streak + Daily Comp replacement | Small |
| **Phase 2b** | Comps Levels (tiers) with lifetime earnings | Medium |
| **Phase 2c** | Trophies (8 badges) with DB table | Medium |
| **Phase 2d** | Weekly leaderboard with pg_cron reset | Medium |
| **Phase 2e** | Player Card upgrade | Small |
