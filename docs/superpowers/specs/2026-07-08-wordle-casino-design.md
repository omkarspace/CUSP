# CUSP — Design Spec

> **Status:** Approved
> **Date:** 2026-07-08
> **Stack:** Next.js 16 (App Router) + Tailwind CSS v4 + Supabase (PostgreSQL + Auth) + Zustand + Framer Motion + Howler.js

---

## 1. Visual Identity

### Color Palette (Tailwind v4 CSS tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-casino-bg` | `#0A0F0D` | Page background (velvet black) |
| `--color-casino-surface-low` | `#0D1F16` | Card backs, row backgrounds |
| `--color-casino-surface-high` | `#163E2B` | Modals, active rows |
| `--color-casino-neon-green` | `#10B981` | Correct tiles, success glow |
| `--color-casino-neon-gold` | `#FBBF24` | Present tiles, gold glow |
| `--color-casino-slate` | `#1F2937` | Absent tiles |
| `--color-casino-neon-red` | `#EF4444` | Danger, double-down, bankruptcy |

### Shadow Glows

- `shadow-neon-green`: `0 0 15px rgba(16, 185, 129, 0.4)`
- `shadow-neon-gold`: `0 0 15px rgba(251, 191, 36, 0.4)`
- `shadow-neon-red`: `0 0 15px rgba(239, 68, 68, 0.5)`

### Typography

- **UI & letters:** Inter (Geist Sans fallback) — neo-grotesque sans-serif
- **Numbers & branding:** Space Grotesk (JetBrains Mono fallback) — geometric monospace hybrid
- **Weights:** 400 (body), 600 (semibold), 800 (headings)

### Micro-Interactions

- **Typing:** `scale-105 transition-transform duration-75` with white border
- **Tile reveal:** Perspective rotate-X flip, lands with neon glow
- **Green tiles:** `shadow-neon-green`
- **Yellow tiles:** `shadow-neon-gold`
- **Gray tiles:** `opacity-40`
- **Double Down:** Screen shake (`animate-shake`), brightness drop, red neon pulse
- **Bankruptcy letters:** `pointer-events-none opacity-20` on burned keyboard keys

---

## 2. Page Architecture (5 Routes)

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Casino Lobby | Hero, live ticker, CTA, How to Play cards |
| `/dashboard` | Game Hub | Profile bar, mode selector (Daily/Infinite/High Roller), daily wheel |
| `/play/[gameId]` | The Table | Wordle grid, escrow HUD, action deck, virtual keyboard |
| `/leaderboard` | High-Rollers Lounge | Top 100 table, user highlight row, share card |
| `/profile` | Cashier / Profile | Win/loss stats, avg solve row, bankruptcy counter, settings |

### 2a. Casino Lobby (`/`)
- Dark hero with animated neon title "WORDLE CASINO"
- Subhead: "Where every guess is a transaction."
- Live ticker: recent wins stream
- CTA "Enter the Lobby" → Supabase Auth modal (unauthenticated) or redirect to `/dashboard`
- Three How to Play cards: 1) Place your Ante, 2) Manage Chips, 3) Double Down or Fold

### 2b. Game Hub (`/dashboard`)
- Header bar: Username, Bankroll Balance, Heat Streak
- Mode selector cards:
  - **Daily High Stakes:** Once/day, 10 chip entry, posts to leaderboard
  - **Infinite Cash Run:** 50 chip entry, endless mode with escalating stakes
  - **High Roller Lounge:** Locked until 5,000 chips bankroll, 5x multipliers
- Daily wheel widget: free 50-chip stimulus when balance = 0

### 2c. The Table (`/play/[gameId]`)
- **Escrow HUD:** Top bar showing current chip balance per match
- **6x5 Grid:** Standard Wordle tiles, flip animation on submit
- **Action Deck (below grid):**
  - Row 4 decision: Play Safe / Double Down (3x or bankruptcy) / Fold
  - Hint Marketplace: Card Count (-15 chips), Peek (-30 chips), Insurance (-25 chips)
- **Virtual Keyboard:** QWERTY layout, color-coded, burned letters disabled
- **Post-game:** "Dealer's Hand" reveal animation, "Redeem Yourself" CTA on bankruptcy

### 2d. Leaderboard (`/leaderboard`)
- Top 100 table: Rank, Username, Heat Streak, Net Worth, Status
- Current user highlight row (even if rank > 100)
- "Share My Rank" copy button → Twitter/X formatted text

### 2e. Profile (`/profile`)
- Metrics grid: Win/Loss ratio, Avg Solve Row, Biggest Payout, Bankruptcy Counter
- Vertical bar chart for solve distribution
- Account settings: username change, logout (Supabase Auth)

---

## 3. Game Economy

### Cost & Payout Matrix

| Row | Cost to Submit | Payout if Solved | Net Profit |
|-----|---------------|------------------|------------|
| 1 | -10 chips | +200 chips | **+190** |
| 2 | -15 chips | +150 chips | **+125** |
| 3 | -20 chips | +100 chips | **+55** |
| 4 | -25 chips (or Double Down) | +60 chips | **+5** |
| 5 | -30 chips | +40 chips | **-35** |
| 6 | -40 chips | +20 chips | **-100** |
| Fail | -40 chips (row 6 fail) | 0 | **-140** |

### Heat Streak Multipliers
- 3 wins → 1.2x payouts
- 5 wins → 1.5x payouts
- 10+ wins → 2.0x payouts
- Entry cost also multiplies with streak

### Double Down (Row 4)
- Choose before typing row 4:
  - **Play Safe:** Normal -25 chip submission
  - **Double Down:** One final guess on row 4, 3x payout if correct, instant bankruptcy if wrong
  - **Fold:** Forfeit round, lose accumulated costs, preserve remaining bankroll

### Hint Marketplace
- **Card Count (-15 chips):** Burn 3 random absent letters from keyboard (max 2x/game)
- **Peek (-30 chips):** Reveal one correct green letter
- **Insurance (-25 chips):** Buy on row 1, 50% refund of row costs on failure

---

## 4. Technical Architecture

### 4a. Anti-Cheat — Server-Authoritative Game Loop

1. **Game Init:** Client calls server action → server generates `game_session_id`, stores target word in `game_sessions` table, returns session ID
2. **Guess Submission:** Client sends `{ session_id, guess, row }` → server evaluates against stored word, calculates chip deduction, returns color array + updated balance
3. **Double Down Activation:** Must be committed to backend *before* guess evaluation
4. **Client never sees target word** — only receives color arrays per guess

### 4b. Frontend State (Zustand)

```typescript
interface GameState {
  boardGrid: string[][]; // 6x5 guesses
  tileStates: TileState[][]; // 6x5 color states
  keyboardState: Record<string, TileState>;
  currentRow: number;
  currentCol: number;
  currentChips: number;
  heatStreak: number;
  isDoubleDownActive: boolean;
  gameStatus: 'IN_PROGRESS' | 'WON' | 'BANKRUPT' | 'FOLDED';
}
```

### 4c. Database Schema (Supabase)

```sql
-- Profiles (bankrolls, streaks)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  bankroll INTEGER DEFAULT 100 NOT NULL,
  heat_streak INTEGER DEFAULT 0 NOT NULL,
  highest_ever_bankroll INTEGER DEFAULT 100 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Public read, self-update only (username changes)

-- Active games (server-side target words)
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  game_mode TEXT CHECK (game_mode IN ('DAILY', 'INFINITE')) NOT NULL,
  target_word VARCHAR(5) NOT NULL,
  current_chips_escrow INTEGER DEFAULT 100,
  current_row INTEGER DEFAULT 1,
  is_double_down BOOLEAN DEFAULT FALSE,
  hints_used JSONB DEFAULT '[]',
  status TEXT CHECK (status IN ('IN_PROGRESS','WON','BANKRUPT','FOLDED')) DEFAULT 'IN_PROGRESS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
-- No public policies — only service-role server actions
```

### 4d. Tech Stack Decision

- **Next.js 16 App Router** — Server Components + Server Actions for guess evaluation
- **Tailwind CSS v4** — CSS-first config, custom `@theme` tokens
- **Zustand** — Lightweight client-side game state
- **Framer Motion** — Tile flip animations, screen shake, chip particle effects
- **Howler.js** — Low-latency audio (chip clinks, jackpot sirens, heartbeat)
- **Supabase** — PostgreSQL (bankrolls, game sessions), Auth (Google/GitHub OAuth), RLS (anti-cheat)
- **Vercel** — Deployment, serverless functions, global CDN

---

## 5. Implementation Phases

### Phase 1: Foundation
1. Tailwind casino theme + typography config
2. Restructure routes to match spec (`/dashboard`, `/play/[gameId]`, `/profile`)
3. Global layout with Inter + Space Grotesk fonts

### Phase 2: Core Game Engine
4. Zustand store for game state
5. 6x5 Wordle grid component with flip animation
6. Virtual keyboard component with color-coded states
7. Escrow HUD / chip counter
8. Action deck (Double Down, hints marketplace)

### Phase 3: Backend & Game Loop
9. Supabase schema + RLS policies
10. Server actions: game init, guess evaluation, double down
11. Auth integration (Google/GitHub OAuth via Supabase)

### Phase 4: Pages & Polish
12. Casino Lobby (`/`) with hero + live ticker
13. Game Hub (`/dashboard`) with mode selector + daily wheel
14. Leaderboard (`/leaderboard`) with share card
15. Profile (`/profile`) with stats + settings
16. Audio integration (Howler.js) + Framer Motion animations

---

## 6. Edge Cases & Constraints

- **0 chips:** Show daily wheel widget, disable new games
- **Already played daily:** Show countdown timer, block re-entry
- **Bankruptcy during double down:** Immediate game over, "Dealer's Hand" reveal
- **Network failure during guess:** Retry with same `session_id`, idempotent server action
- **Tab close during active game:** Game persists in `game_sessions` for 24h, then expires
- **Username collision:** Supabase unique constraint, show inline error
- **Empty keyboard on fire:** Prevent guess submission if no letters typed
- **Rapid double-click:** Disable submit button during server action
