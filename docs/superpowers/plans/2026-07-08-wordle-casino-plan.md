# CUSP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional CUSP (word game with casino mechanics) where players bet chips on word guesses, with server-authoritative game evaluation, Double Down mechanics, hint marketplace, and a leaderboard.

**Architecture:** Next.js 16 App Router with Supabase for auth/database, Zustand for client game state, Framer Motion for animations, Howler.js for audio. Server actions handle all game logic (anti-cheat). Tailwind CSS v4 with casino-themed dark mode tokens.

**Tech Stack:** Next.js 16, Tailwind CSS v4, Supabase (PostgreSQL + Auth), Zustand, Framer Motion, Howler.js, Zod, TypeScript

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout (fonts, providers, nav)
│   ├── page.tsx                ← Casino Lobby (/) — hero, ticker, CTA
│   ├── dashboard/page.tsx      ← Game Hub — mode selector, daily wheel
│   ├── play/[gameId]/page.tsx  ← The Table — grid, keyboard, actions
│   ├── leaderboard/page.tsx    ← High-Rollers Lounge
│   ├── profile/page.tsx        ← Cashier / Profile
│   ├── api/auth/callback/route.ts ← Supabase auth callback
│   └── globals.css             ← Casino theme tokens
├── components/
│   ├── nav.tsx                 ← Casino-themed navbar
│   ├── wordle-grid.tsx         ← 6x5 tile grid with flip animation
│   ├── virtual-keyboard.tsx    ← QWERTY keyboard with color states
│   ├── escrow-hud.tsx          ← Chip balance display per game
│   ├── action-deck.tsx         ← Double Down, Fold, hints
│   ├── chip-counter.tsx        ← Animated chip display
│   ├── mode-selector.tsx       ← Daily/Infinite/High Roller cards
│   ├── daily-wheel.tsx         ← Free 50-chip wheel widget
│   ├── leaderboard-table.tsx   ← Top 100 table
│   ├── share-card.tsx          ← Twitter/X share generator
│   └── screen-frame.tsx        ← Reusable screen frame
├── stores/
│   └── game-store.ts           ← Zustand game state
├── lib/
│   ├── supabase/
│   │   ├── client.ts           ← Browser client
│   │   ├── server.ts           ← Server client
│   │   └── middleware.ts       ← Auth middleware
│   ├── game.ts                 ← Word validation, scoring logic
│   ├── words.ts                ← Word list (filtered 5-letter words)
│   └── types.ts                ← Shared TypeScript types
└── actions/
    ├── game-actions.ts         ← Server actions: init, guess, double down
    └── profile-actions.ts      ← Server actions: update username
```

---

## Task 1: Install Dependencies & Clean Up Old Routes

**Files:**
- Modify: `package.json`
- Delete: `src/app/arena/`, `src/app/game-hub/`, `src/app/lobby/`, `src/app/player-profile/`
- Delete: `src/app/page.tsx`

- [ ] **Step 1: Install dependencies**

Run in project root:
```bash
npm install zustand @supabase/supabase-js @supabase/ssr framer-motion howler zod
npm install -D @types/howler
```

- [ ] **Step 2: Remove old route directories and files**

```bash
Remove-Item -Recurse -Force "src/app/arena"
Remove-Item -Recurse -Force "src/app/game-hub"
Remove-Item -Recurse -Force "src/app/lobby"
Remove-Item -Recurse -Force "src/app/player-profile"
Remove-Item -Force "src/app/page.tsx"
```

- [ ] **Step 3: Remove old components**

```bash
Remove-Item -Force "src/components/nav.tsx"
Remove-Item -Force "src/components/screen-frame.tsx"
```

- [ ] **Step 4: Remove unused Stitch downloads**

```bash
Remove-Item -Recurse -Force "src/code"
Remove-Item -Recurse -Force "public/screenshots"
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: install deps, remove scaffold code"
```

---

## Task 2: Casino Theme Tokens & Typography

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace globals.css with casino theme**

```css
@import "tailwindcss";

@theme inline {
  /* Casino Canvas */
  --color-casino-bg: #0A0F0D;
  --color-casino-surface-low: #0D1F16;
  --color-casino-surface-high: #163E2B;

  /* Neon Accents */
  --color-neon-green: #10B981;
  --color-neon-gold: #FBBF24;
  --color-neon-red: #EF4444;
  --color-neon-crimson: #DC2626;

  /* Text */
  --color-text-primary: #E8F5E9;
  --color-text-secondary: #A3C4A8;
  --color-text-muted: #5A7A5E;

  /* Tile States */
  --color-tile-correct: #10B981;
  --color-tile-present: #FBBF24;
  --color-tile-absent: #1F2937;
  --color-tile-border: #2D4A3E;

  /* Shadows */
  --shadow-neon-green: 0 0 15px rgba(16, 185, 129, 0.4);
  --shadow-neon-gold: 0 0 15px rgba(251, 191, 36, 0.4);
  --shadow-neon-red: 0 0 15px rgba(239, 68, 68, 0.5);

  /* Typography */
  --font-sans: "Inter", "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "Space Grotesk", "JetBrains Mono", ui-monospace, monospace;

  /* Animations */
  --animate-shake: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

@keyframes flip-in {
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor; }
}

html {
  background-color: #0A0F0D;
  color: #E8F5E9;
}

body {
  background-color: #0A0F0D;
  color: #E8F5E9;
}

.animate-flip-in {
  animation: flip-in 0.4s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

- [ ] **Step 2: Replace layout.tsx with Space Grotesk + Inter**

```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "CUSP",
  description: "Where every guess is a transaction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-casino-bg text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: casino dark theme tokens and typography"
```

---

## Task 3: Types & Word List

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/words.ts`
- Create: `src/lib/game.ts`

- [ ] **Step 1: Create types.ts**

```typescript
export type TileState = "correct" | "present" | "absent" | "empty";

export type GameStatus = "IN_PROGRESS" | "WON" | "BANKRUPT" | "FOLDED";

export type GameMode = "DAILY" | "INFINITE";

export interface GameSession {
  id: string;
  userId: string;
  gameMode: GameMode;
  targetWord: string;
  currentChipsEscrow: number;
  currentRow: number;
  isDoubleDown: boolean;
  hintsUsed: HintType[];
  status: GameStatus;
  boardGrid: string[][];
  tileStates: TileState[][];
  createdAt: string;
}

export type HintType = "card_count" | "peek" | "insurance";

export interface GuessResult {
  tileStates: TileState[];
  updatedBalance: number;
  isWin: boolean;
  nextRow: number;
  message: string;
}

export interface PlayerProfile {
  id: string;
  username: string;
  bankroll: number;
  heatStreak: number;
  highestEverBankroll: number;
  totalGamesPlayed: number;
  totalWins: number;
  totalBankruptcies: number;
  updatedAt: string;
}

export const COST_MATRIX = [
  { row: 1, cost: 10, payout: 200 },
  { row: 2, cost: 15, payout: 150 },
  { row: 3, cost: 20, payout: 100 },
  { row: 4, cost: 25, payout: 60 },
  { row: 5, cost: 30, payout: 40 },
  { row: 6, cost: 40, payout: 20 },
];

export const STREAK_MULTIPLIERS: Array<{ minStreak: number; multiplier: number }> = [
  { minStreak: 10, multiplier: 2.0 },
  { minStreak: 5, multiplier: 1.5 },
  { minStreak: 3, multiplier: 1.2 },
];

export const HINT_COSTS: Record<HintType, number> = {
  card_count: 15,
  peek: 30,
  insurance: 25,
};
```

- [ ] **Step 2: Create words.ts**

```typescript
// Filtered 5-letter words suitable for a word game
// Real implementation should use a curated 2300+ word list like Wordle's original
const WORD_LIST = [
  "about", "above", "abuse", "actor", "acute", "admit", "adopt", "adult", "agent", "agree",
  "alarm", "album", "alert", "alien", "align", "alive", "allow", "alone", "along", "alter",
  "among", "angel", "anger", "angle", "angry", "anime", "ankle", "annex", "apart", "apple",
  "apply", "arena", "argue", "arise", "armor", "array", "aside", "asset", "atlas", "attic",
  "audio", "audit", "avoid", "awake", "award", "aware", "awful", "bacon", "badge", "badly",
  "basic", "basis", "batch", "beach", "beard", "beast", "begin", "being", "below", "bench",
  "berry", "birth", "black", "blade", "blame", "blank", "blast", "blaze", "bleed", "blend",
  "bless", "blind", "block", "blood", "bloom", "board", "boost", "booth", "bound", "brain",
  "brand", "brave", "bread", "break", "breed", "brick", "brief", "bring", "broad", "brook",
  "brown", "brush", "build", "bunch", "burst", "buyer", "cabin", "candy", "cargo", "carry",
  "catch", "cause", "chain", "chair", "chalk", "chaos", "charm", "chart", "chase", "cheap",
  "check", "cheek", "chess", "chest", "chief", "child", "chill", "china", "chord", "chose",
  "chunk", "civic", "civil", "claim", "clash", "class", "clean", "clear", "climb", "cling",
  "clock", "clone", "close", "cloud", "coach", "coast", "color", "comet", "coral", "could",
  "count", "court", "cover", "crack", "craft", "crane", "crash", "crawl", "crazy", "cream",
  "crest", "crime", "crisp", "cross", "crowd", "crown", "cruel", "crush", "curve", "cycle",
  "dance", "death", "debug", "decay", "delay", "delta", "dense", "depot", "depth", "derby",
  "diary", "diner", "dirty", "disco", "ditch", "dizzy", "dodge", "doing", "donor", "doubt",
  "dough", "draft", "drain", "drama", "drank", "drape", "dream", "dress", "dried", "drift",
  "drill", "drink", "drive", "drone", "drown", "dying", "eager", "early", "earth", "eighth",
  "elect", "elite", "email", "ember", "empty", "enemy", "enjoy", "enter", "entry", "equal",
  "error", "essay", "event", "every", "exact", "exile", "exist", "extra", "fable", "faith",
  "false", "fancy", "fatal", "fault", "feast", "fence", "ferry", "fetch", "fever", "fiber",
  "field", "fifth", "fifty", "fight", "final", "first", "flame", "flash", "fleet", "flesh",
  "float", "flood", "floor", "flour", "fluid", "flush", "flute", "focus", "force", "forge",
  "forth", "forum", "found", "frame", "frank", "fraud", "fresh", "front", "frost", "froze",
  "fruit", "fully", "funny", "ghost", "giant", "given", "glad", "globe", "gloom", "glory",
  "going", "grace", "grade", "grain", "grand", "grant", "graph", "grasp", "grass", "grave",
  "great", "green", "greet", "grief", "grill", "grind", "groan", "gross", "group", "grove",
  "grown", "guard", "guess", "guest", "guide", "guild", "guilt", "happy", "harsh", "haste",
  "haunt", "haven", "heart", "heavy", "hence", "herbs", "honor", "horse", "hotel", "house",
  "human", "humor", "hurry", "ideal", "image", "imply", "index", "inner", "input", "irony",
  "ivory", "joint", "joker", "judge", "juice", "karma", "kayak", "knack", "kneel", "knife",
  "knock", "known", "label", "large", "laser", "later", "laugh", "layer", "learn", "lease",
  "least", "leave", "legal", "lemon", "level", "light", "limit", "linen", "liver", "lobby",
  "local", "login", "logic", "login", "loose", "lover", "lower", "loyal", "lucky", "lunch",
  "lying", "magic", "major", "maker", "manor", "march", "match", "maybe", "mayor", "media",
  "mercy", "merit", "metal", "meter", "micro", "might", "mimic", "mince", "minor", "minus",
  "mixer", "model", "money", "month", "moral", "mount", "mouse", "mouth", "movie", "muddy",
  "multi", "music", "naive", "nerve", "never", "night", "noble", "noise", "north", "noted",
  "novel", "nurse", "nylon", "occur", "ocean", "offer", "often", "olive", "onset", "opera",
  "orbit", "order", "other", "outer", "oxide", "ozone", "panda", "panel", "panic", "paper",
  "party", "pasta", "patch", "pause", "peace", "pearl", "penny", "perch", "phase", "phone",
  "photo", "piano", "piece", "pilot", "pinch", "pitch", "pixel", "pizza", "place", "plain",
  "plane", "plant", "plate", "plaza", "plead", "pluck", "plumb", "point", "polar", "pound",
  "power", "press", "price", "pride", "prime", "print", "prior", "prize", "probe", "proof",
  "proud", "prove", "psalm", "pulse", "punch", "pupil", "purse", "queen", "query", "quest",
  "queue", "quick", "quiet", "quota", "quote", "radar", "radio", "ranch", "range", "rapid",
  "ratio", "reach", "react", "ready", "realm", "rebel", "refer", "reign", "relax", "reply",
  "rider", "rifle", "right", "rigid", "risky", "rival", "river", "roast", "robot", "rocky",
  "rouge", "rough", "round", "route", "royal", "ruler", "rural", "salad", "sauce", "scale",
  "scare", "scene", "scent", "scope", "score", "scout", "scrap", "seize", "sense", "serve",
  "setup", "seven", "shade", "shaft", "shake", "shame", "shape", "share", "shark", "sharp",
  "shelf", "shell", "shift", "shine", "shirt", "shock", "shoot", "shore", "short", "shout",
  "siege", "sight", "sigma", "since", "sixth", "sixty", "skill", "skull", "slate", "slave",
  "sleep", "slice", "slide", "slope", "small", "smart", "smell", "smile", "smoke", "snake",
  "solar", "solid", "solve", "sorry", "sound", "south", "space", "spare", "speak", "speed",
  "spend", "spill", "spine", "spite", "split", "spoke", "sport", "spray", "squad", "stack",
  "staff", "stage", "stain", "stake", "stale", "stall", "stamp", "stand", "stark", "start",
  "state", "stays", "steak", "steal", "steam", "steel", "steep", "steer", "stern", "stick",
  "stiff", "still", "stock", "stone", "stood", "store", "storm", "story", "strip", "stuck",
  "study", "stuff", "style", "sugar", "suite", "sunny", "super", "surge", "swamp", "swear",
  "sweep", "sweet", "swept", "swift", "swing", "sword", "syrup", "table", "taste", "teach",
  "tempo", "thank", "theft", "theme", "thick", "thief", "thing", "think", "third", "those",
  "three", "threw", "throw", "thumb", "tiger", "tight", "timer", "tired", "title", "today",
  "token", "tooth", "topic", "total", "touch", "tough", "towel", "tower", "toxic", "trace",
  "track", "trade", "trail", "train", "trait", "trash", "treat", "trend", "trial", "tribe",
  "trick", "tried", "troop", "truck", "truly", "trump", "trunk", "trust", "truth", "tumor",
  "tuner", "tweed", "twice", "twist", "ultra", "uncle", "under", "union", "unite", "unity",
  "until", "upper", "upset", "urban", "usage", "usher", "usual", "utter", "valid", "valor",
  "value", "vapor", "vault", "verse", "video", "vigor", "vinyl", "viola", "viral", "virus",
  "visit", "vista", "vital", "vivid", "vocal", "vodka", "voice", "voter", "vowel", "watch",
  "water", "weary", "weave", "wedge", "weigh", "weird", "whale", "wheat", "wheel", "where",
  "which", "while", "white", "whole", "whose", "widow", "width", "witch", "woman", "world",
  "worry", "worse", "worst", "worth", "would", "wound", "wrath", "write", "wrote", "yacht",
  "yield", "young", "youth", "zebra", "zonal",
];

export function isValidWord(word: string): boolean {
  return word.length === 5 && WORD_LIST.includes(word.toLowerCase());
}

export function getRandomWord(): string {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

export function getDailyWord(): string {
  // Deterministic daily word based on date
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return WORD_LIST[seed % WORD_LIST.length];
}

export function evaluateGuess(guess: string, target: string): import("./types").TileState[] {
  const result: import("./types").TileState[] = Array(5).fill("absent");
  const targetChars = target.split("");
  const guessChars = guess.split("");

  // First pass: correct positions
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct";
      targetChars[i] = "*"; // Mark as used
      guessChars[i] = "*"; // Mark as used
    }
  }

  // Second pass: present (wrong position)
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === "*") continue; // Already matched
    const targetIdx = targetChars.indexOf(guessChars[i]);
    if (targetIdx !== -1) {
      result[i] = "present";
      targetChars[targetIdx] = "*"; // Mark as used
    }
  }

  return result;
}

export function calculatePayout(
  row: number,
  isWin: boolean,
  heatStreak: number
): { cost: number; payout: number } {
  const rowConfig = COST_MATRIX[row - 1];
  if (!rowConfig) return { cost: 0, payout: 0 };

  let multiplier = 1;
  for (const { minStreak, multiplier: m } of STREAK_MULTIPLIERS) {
    if (heatStreak >= minStreak) {
      multiplier = m;
      break;
    }
  }

  return {
    cost: rowConfig.cost,
    payout: isWin ? Math.floor(rowConfig.payout * multiplier) : 0,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: types, word list, and game logic utilities"
```

---

## Task 4: Supabase Client Setup

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `.env.local`

- [ ] **Step 1: Create .env.local (with placeholder values)**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- [ ] **Step 2: Create browser client**

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 3: Create server client**

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  );
}
```

- [ ] **Step 4: Create middleware**

```typescript
// src/lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}
```

- [ ] **Step 5: Create middleware.ts in project root**

```typescript
// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 6: Create Supabase schema**

Run this SQL in your Supabase dashboard (SQL Editor):

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  bankroll INTEGER DEFAULT 100 NOT NULL,
  heat_streak INTEGER DEFAULT 0 NOT NULL,
  highest_ever_bankroll INTEGER DEFAULT 100 NOT NULL,
  total_games_played INTEGER DEFAULT 0 NOT NULL,
  total_wins INTEGER DEFAULT 0 NOT NULL,
  total_bankruptcies INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read, self-update only
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Game sessions table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  game_mode TEXT CHECK (game_mode IN ('DAILY', 'INFINITE', 'HIGH_ROLLER')) NOT NULL,
  target_word VARCHAR(5) NOT NULL,
  current_chips_escrow INTEGER DEFAULT 100,
  current_row INTEGER DEFAULT 1,
  is_double_down BOOLEAN DEFAULT FALSE,
  hints_used JSONB DEFAULT '[]',
  total_costs_incurred INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('IN_PROGRESS', 'WON', 'BANKRUPT', 'FOLDED')) DEFAULT 'IN_PROGRESS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Only service-role (server actions) can access game_sessions
-- No public policies = anti-cheat: client never reads target_word

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: supabase client/server setup and auth middleware"
```

---

## Task 5: Zustand Game Store

**Files:**
- Create: `src/stores/game-store.ts`

- [ ] **Step 1: Create game store**

```typescript
// src/stores/game-store.ts
import { create } from "zustand";
import type { TileState, GameStatus, HintType } from "@/lib/types";

interface GameStore {
  // Board state
  boardGrid: string[][];
  tileStates: TileState[][];
  keyboardState: Record<string, TileState>;

  // Game state
  currentRow: number;
  currentCol: number;
  currentChips: number;
  heatStreak: number;
  isDoubleDownActive: boolean;
  gameStatus: GameStatus;
  gameId: string | null;

  // Hints
  hintsUsed: HintType[];
  cardCountRemaining: number;

  // Actions
  setGameId: (id: string) => void;
  setGameInfo: (chips: number, streak: number) => void;
  typeLetter: (letter: string) => void;
  deleteLetter: () => void;
  submitGuess: (guess: string, states: TileState[]) => void;
  activateDoubleDown: () => void;
  useHint: (hint: HintType) => void;
  resetGame: () => void;
  setStatus: (status: GameStatus) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  boardGrid: Array.from({ length: 6 }, () => Array(5).fill("")),
  tileStates: Array.from({ length: 6 }, () => Array(5).fill("empty")),
  keyboardState: {},

  currentRow: 0,
  currentCol: 0,
  currentChips: 100,
  heatStreak: 0,
  isDoubleDownActive: false,
  gameStatus: "IN_PROGRESS",
  gameId: null,

  hintsUsed: [],
  cardCountRemaining: 2,

  setGameId: (id) => set({ gameId: id }),

  setGameInfo: (chips, streak) => set({ currentChips: chips, heatStreak: streak }),

  typeLetter: (letter) => {
    const { currentCol, currentRow, boardGrid, gameStatus } = get();
    if (currentCol >= 5 || currentRow >= 6 || gameStatus !== "IN_PROGRESS") return;

    const newGrid = boardGrid.map((row) => [...row]);
    newGrid[currentRow][currentCol] = letter;

    set({ boardGrid: newGrid, currentCol: currentCol + 1 });
  },

  deleteLetter: () => {
    const { currentCol, currentRow, boardGrid } = get();
    if (currentCol <= 0 || currentRow >= 6) return;

    const newGrid = boardGrid.map((row) => [...row]);
    newGrid[currentRow][currentCol - 1] = "";

    set({ boardGrid: newGrid, currentCol: currentCol - 1 });
  },

  submitGuess: (guess, states) => {
    const { currentRow, keyboardState } = get();

    // Update keyboard colors (correct > present > absent priority)
    const newKeyboard = { ...keyboardState };
    for (let i = 0; i < 5; i++) {
      const letter = guess[i];
      const state = states[i];
      const current = newKeyboard[letter];
      const priority: Record<TileState, number> = {
        correct: 3,
        present: 2,
        absent: 1,
        empty: 0,
      };
      if (priority[state] > priority[current || "empty"]) {
        newKeyboard[letter] = state;
      }
    }

    set({
      tileStates: get().tileStates.map((row, i) =>
        i === currentRow ? states : row
      ),
      keyboardState: newKeyboard,
      currentRow: currentRow + 1,
      currentCol: 0,
    });
  },

  activateDoubleDown: () => set({ isDoubleDownActive: true }),

  useHint: (hint) => {
    const { hintsUsed, cardCountRemaining } = get();
    if (hint === "card_count" && cardCountRemaining <= 0) return;

    set({
      hintsUsed: [...hintsUsed, hint],
      cardCountRemaining: hint === "card_count" ? cardCountRemaining - 1 : cardCountRemaining,
    });
  },

  resetGame: () =>
    set({
      boardGrid: Array.from({ length: 6 }, () => Array(5).fill("")),
      tileStates: Array.from({ length: 6 }, () => Array(5).fill("empty")),
      keyboardState: {},
      currentRow: 0,
      currentCol: 0,
      isDoubleDownActive: false,
      gameStatus: "IN_PROGRESS",
      gameId: null,
      hintsUsed: [],
      cardCountRemaining: 2,
    }),

  setStatus: (status) => set({ gameStatus: status }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: zustand game store with board/keyboard/game state"
```

---

## Task 6: Server Actions — Game Logic

**Files:**
- Create: `src/actions/game-actions.ts`
- Create: `src/actions/profile-actions.ts`

- [ ] **Step 1: Create game actions**

```typescript
// src/actions/game-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getRandomWord, evaluateGuess, calculatePayout, isValidWord } from "@/lib/game";
import type { HintType, GameStatus } from "@/lib/types";

export async function initGame(gameMode: "DAILY" | "INFINITE") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  // Check daily limit
  if (gameMode === "DAILY") {
    const { data: todayGame } = await supabase
      .from("game_sessions")
      .select("id")
      .eq("user_id", user.id)
      .eq("game_mode", "DAILY")
      .gte("created_at", new Date().toISOString().split("T")[0])
      .single();

    if (todayGame) throw new Error("Already played daily mode today");
  }

  const targetWord = getRandomWord();
  const entryCost = gameMode === "HIGH_ROLLER" ? 50 : 10;

  if (profile.bankroll < entryCost) throw new Error("Insufficient chips");

  // Create game session
  const { data: game, error } = await supabase
    .from("game_sessions")
    .insert({
      user_id: user.id,
      game_mode: gameMode,
      target_word: targetWord,
      current_chips_escrow: entryCost,
      current_row: 1,
      is_double_down: false,
      hints_used: [],
      status: "IN_PROGRESS",
    })
    .select()
    .single();

  if (error) throw error;

  // Deduct entry cost
  await supabase
    .from("profiles")
    .update({ bankroll: profile.bankroll - entryCost })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  return { gameId: game.id, bankroll: profile.bankroll - entryCost };
}

export async function submitGuess(
  gameId: string,
  guess: string,
  row: number,
  isDoubleDown: boolean
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (!isValidWord(guess)) throw new Error("Not a valid word");

  // Get game session
  const { data: game } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game || game.status !== "IN_PROGRESS") throw new Error("Game not active");
  if (game.current_row !== row) throw new Error("Invalid row");

  const tileStates = evaluateGuess(guess, game.target_word);
  const isWin = tileStates.every((s) => s === "correct");

  let newStatus: GameStatus = "IN_PROGRESS";
  let message = "";

  if (isWin) {
    newStatus = "WON";
    message = "Winner Winner!";
  } else if (row >= 6 || isDoubleDown) {
    if (isDoubleDown && !isWin) {
      newStatus = "BANKRUPT";
      message = "Double Down Bankruptcy!";
    } else if (row >= 6) {
      newStatus = "BANKRUPT";
      message = "No more rows!";
    }
  } else {
    message = `Row ${row} complete`;
  }

  // Calculate chips
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("heat_streak")
    .eq("id", user.id)
    .single();
  const { cost, payout } = calculatePayout(row, isWin, currentProfile?.heat_streak || 0);
  const newEscrow = game.current_chips_escrow + payout - cost;

  // Update game session
  await supabase
    .from("game_sessions")
    .update({
      current_row: row + 1,
      current_chips_escrow: newEscrow,
      is_double_down: isDoubleDown,
      status: newStatus,
    })
    .eq("id", gameId);

  // If game over, update profile
  if (newStatus !== "IN_PROGRESS") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("bankroll, heat_streak, total_games_played, total_wins, total_bankruptcies")
      .eq("id", user.id)
      .single();

    if (profile) {
      const newBankroll = newStatus === "WON"
        ? profile.bankroll + newEscrow
        : profile.bankroll;
      const newStreak = newStatus === "WON" ? profile.heat_streak + 1 : 0;

      await supabase
        .from("profiles")
        .update({
          bankroll: newBankroll,
          heat_streak: newStreak,
          total_games_played: profile.total_games_played + 1,
          total_wins: profile.total_wins + (newStatus === "WON" ? 1 : 0),
          total_bankruptcies: profile.total_bankruptcies + (newStatus === "BANKRUPT" ? 1 : 0),
        })
        .eq("id", user.id);
    }
  }

  revalidatePath("/play/[gameId]", "page");
  return { tileStates, isWin, status: newStatus, message, updatedChips: newEscrow };
}

export async function useHintAction(
  gameId: string,
  hintType: HintType
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: game } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game || game.status !== "IN_PROGRESS") throw new Error("Game not active");

  const hintsUsed = game.hints_used as HintType[];
  if (hintsUsed.includes(hintType)) throw new Error("Hint already used");

  let result: { lettersToReveal?: string[]; lettersToBurn?: string[] } = {};

  if (hintType === "peek") {
    // Reveal first correct letter
    const target = game.target_word;
    result = { lettersToReveal: [target[0]] };
  } else if (hintType === "card_count") {
    // Burn 3 random absent letters
    const target = game.target_word;
    const absent = "abcdefghijklmnopqrstuvwxyz"
      .split("")
      .filter((l) => !target.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    result = { lettersToBurn: absent };
  }

  await supabase
    .from("game_sessions")
    .update({ hints_used: [...hintsUsed, hintType] })
    .eq("id", gameId);

  return result;
}
```

- [ ] **Step 2: Create profile actions**

```typescript
// src/actions/profile-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateUsername(username: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (username.length < 3 || username.length > 20) {
    throw new Error("Username must be 3-20 characters");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") throw new Error("Username already taken");
    throw error;
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function claimDailyWheel() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("bankroll")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");
  if (profile.bankroll > 0) throw new Error("Can only claim when balance is 0");

  const bonus = 50;
  await supabase
    .from("profiles")
    .update({ bankroll: bonus })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  return { bonus };
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: server actions for game logic and profile management"
```

---

## Task 7: Nav Component

**Files:**
- Create: `src/components/nav.tsx`

- [ ] **Step 1: Create casino nav**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Lobby" },
  { href: "/dashboard", label: "Hub" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Cashier" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-tile-border/30 bg-casino-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-neon-green">
          WORDLE CASINO
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "text-neon-gold shadow-neon-gold"
                    : "text-text-secondary hover:text-text-primary hover:bg-casino-surface-low"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: casino-themed navigation bar"
```

---

## Task 8: Wordle Grid Component

**Files:**
- Create: `src/components/wordle-grid.tsx`

- [ ] **Step 1: Create wordle grid with flip animation**

```tsx
"use client";

import type { TileState } from "@/lib/types";

interface WordleGridProps {
  boardGrid: string[][];
  tileStates: TileState[][];
  currentRow: number;
  currentCol: number;
  isRevealing: boolean;
  shakeRow: boolean;
}

const stateStyles: Record<TileState, string> = {
  correct: "bg-tile-correct border-tile-correct text-white shadow-neon-green",
  present: "bg-tile-present border-tile-present text-black shadow-neon-gold",
  absent: "bg-tile-absent border-tile-absent text-text-muted opacity-60",
  empty: "bg-transparent border-tile-border text-text-primary",
};

export function WordleGrid({
  boardGrid,
  tileStates,
  currentRow,
  currentCol,
  isRevealing,
  shakeRow,
}: WordleGridProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {boardGrid.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex gap-1.5 ${rowIdx === currentRow && shakeRow ? "animate-shake" : ""}`}
        >
          {row.map((letter, colIdx) => {
            const state = tileStates[rowIdx][colIdx];
            const isCurrentRow = rowIdx === currentRow;
            const isActive = isCurrentRow && colIdx === currentCol - 1;
            const isRevealed = rowIdx < currentRow || (isRevealing && rowIdx === currentRow);

            return (
              <div
                key={colIdx}
                className={`
                  flex h-14 w-14 items-center justify-center
                  rounded-lg border-2 font-heading text-2xl font-bold
                  transition-all duration-200
                  ${stateStyles[state]}
                  ${isActive ? "scale-105 border-white" : ""}
                  ${isRevealed && state !== "empty" ? "animate-flip-in" : ""}
                `}
                style={{
                  perspective: "1000px",
                  animationDelay: isRevealing ? `${colIdx * 100}ms` : "0ms",
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: wordle grid component with flip animation"
```

---

## Task 9: Virtual Keyboard Component

**Files:**
- Create: `src/components/virtual-keyboard.tsx`

- [ ] **Step 1: Create virtual keyboard**

```tsx
"use client";

import type { TileState } from "@/lib/types";

interface VirtualKeyboardProps {
  keyboardState: Record<string, TileState>;
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  disabled?: boolean;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

const stateStyles: Record<TileState, string> = {
  correct: "bg-tile-correct border-tile-correct text-white shadow-neon-green",
  present: "bg-tile-present border-tile-present text-black shadow-neon-gold",
  absent: "bg-tile-absent border-tile-absent text-text-muted opacity-40 pointer-events-none",
  empty: "bg-casino-surface-low border-tile-border text-text-primary hover:bg-casino-surface-high",
};

export function VirtualKeyboard({
  keyboardState,
  onKeyPress,
  onDelete,
  onEnter,
  disabled,
}: VirtualKeyboardProps) {
  const handleKey = (key: string) => {
    if (disabled) return;
    if (key === "ENTER") onEnter();
    else if (key === "⌫") onDelete();
    else onKeyPress(key);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5">
          {row.map((key) => {
            const state = keyboardState[key] || "empty";
            const isWide = key === "ENTER" || key === "⌫";

            return (
              <button
                key={key}
                onClick={() => handleKey(key)}
                disabled={disabled || state === "absent"}
                className={`
                  flex items-center justify-center rounded-lg border-2
                  font-heading text-sm font-bold transition-all duration-150
                  ${isWide ? "h-14 w-[68px] text-xs" : "h-14 w-10"}
                  ${stateStyles[state]}
                  ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                `}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: virtual keyboard component with color states"
```

---

## Task 10: Escrow HUD & Action Deck

**Files:**
- Create: `src/components/escrow-hud.tsx`
- Create: `src/components/action-deck.tsx`

- [ ] **Step 1: Create escrow HUD**

```tsx
"use client";

import { motion } from "framer-motion";

interface EscrowHudProps {
  currentChips: number;
  row: number;
  isDoubleDown: boolean;
}

export function EscrowHud({ currentChips, row, isDoubleDown }: EscrowHudProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-tile-border/30 bg-casino-surface-low px-6 py-3">
      <div className="flex items-center gap-4">
        <div>
          <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
            Escrow
          </span>
          <motion.div
            key={currentChips}
            initial={{ scale: 1.2, color: "#FBBF24" }}
            animate={{ scale: 1, color: "#E8F5E9" }}
            className="font-heading text-2xl font-bold"
          >
            {currentChips} chips
          </motion.div>
        </div>
        <div className="h-8 w-px bg-tile-border" />
        <div>
          <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
            Row
          </span>
          <div className="font-heading text-2xl font-bold text-text-primary">
            {row}/6
          </div>
        </div>
      </div>
      {isDoubleDown && (
        <div className="rounded-lg border border-neon-red bg-neon-red/20 px-3 py-1 text-sm font-bold text-neon-red animate-pulse-glow">
          DOUBLE DOWN ACTIVE
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create action deck**

```tsx
"use client";

import type { HintType } from "@/lib/types";
import { HINT_COSTS } from "@/lib/types";

interface ActionDeckProps {
  row: number;
  currentChips: number;
  isDoubleDown: boolean;
  hintsUsed: HintType[];
  cardCountRemaining: number;
  onDoubleDown: () => void;
  onFold: () => void;
  onHint: (hint: HintType) => void;
}

export function ActionDeck({
  row,
  currentChips,
  isDoubleDown,
  hintsUsed,
  cardCountRemaining,
  onDoubleDown,
  onFold,
  onHint,
}: ActionDeckProps) {
  const showDoubleDown = row === 4 && !isDoubleDown;
  const canAffordHint = (hint: HintType) => currentChips >= HINT_COSTS[hint];

  return (
    <div className="flex flex-col gap-3">
      {showDoubleDown && (
        <div className="flex gap-2">
          <button
            onClick={onFold}
            className="flex-1 rounded-lg border border-neon-gold/50 bg-casino-surface-low px-4 py-3 font-heading text-sm font-bold text-neon-gold transition-all hover:bg-neon-gold/10"
          >
            Fold (Save Chips)
          </button>
          <button
            onClick={onDoubleDown}
            className="flex-1 rounded-lg border border-neon-red/50 bg-neon-red/20 px-4 py-3 font-heading text-sm font-bold text-neon-red transition-all hover:bg-neon-red/30 animate-pulse-glow"
          >
            Double Down (3x or Bust)
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onHint("card_count")}
          disabled={!canAffordHint("card_count") || hintsUsed.includes("card_count") || cardCountRemaining <= 0}
          className="flex-1 rounded-lg border border-tile-border/30 bg-casino-surface-low px-3 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-casino-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Card Count (-{HINT_COSTS.card_count})
          <br />
          <span className="text-text-muted">{cardCountRemaining} left</span>
        </button>
        <button
          onClick={() => onHint("peek")}
          disabled={!canAffordHint("peek") || hintsUsed.includes("peek")}
          className="flex-1 rounded-lg border border-tile-border/30 bg-casino-surface-low px-3 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-casino-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Peek (-{HINT_COSTS.peek})
        </button>
        <button
          onClick={() => onHint("insurance")}
          disabled={!canAffordHint("insurance") || hintsUsed.includes("insurance")}
          className="flex-1 rounded-lg border border-tile-border/30 bg-casino-surface-low px-3 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-casino-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Insurance (-{HINT_COSTS.insurance})
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: escrow hud and action deck components"
```

---

## Task 11: Casino Lobby Page

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create casino lobby**

```tsx
import { Nav } from "@/components/nav";
import Link from "next/link";

const howToPlay = [
  {
    step: "1",
    title: "Place Your Ante",
    desc: "Choose Daily (10 chips), Infinite (50 chips), or High Roller (5,000+ required).",
  },
  {
    step: "2",
    title: "Manage Chips",
    desc: "Row 1 wins big (+200), but later rows cost more and pay less. Know when to hold.",
  },
  {
    step: "3",
    title: "Double Down or Fold",
    desc: "At Row 4, risk it all for 3x payout — or fold to preserve your bankroll.",
  },
];

export default function LobbyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero */}
        <div className="text-center">
          <h1 className="font-heading text-6xl font-extrabold tracking-tight text-neon-green drop-shadow-neon-green">
            WORDLE CASINO
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Where every guess is a transaction.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-block rounded-xl bg-neon-green px-8 py-4 font-heading text-lg font-bold text-casino-bg shadow-neon-green transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            Enter the Lobby
          </Link>
        </div>

        {/* Live Ticker */}
        <div className="mt-16 rounded-xl border border-tile-border/30 bg-casino-surface-low p-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Live Wins
            </span>
          </div>
          <div className="mt-3 overflow-hidden">
            <div className="flex animate-[scroll_20s_linear_infinite] gap-8 text-sm text-text-secondary">
              <span><strong className="text-neon-gold">Player1</strong> won <strong className="text-neon-green">+200</strong> chips on Row 1</span>
              <span><strong className="text-neon-gold">HighRoller</strong> doubled down and won <strong className="text-neon-green">+600</strong> chips!</span>
              <span><strong className="text-neon-gold">WordNerd</strong> on a <strong className="text-neon-gold">5-win streak</strong> (1.5x multiplier)</span>
              <span><strong className="text-neon-gold">LuckyGuess</strong> won <strong className="text-neon-green">+150</strong> chips on Row 2</span>
            </div>
          </div>
        </div>

        {/* How to Play */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-text-primary text-center mb-8">
            How to Play
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {howToPlay.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-tile-border/30 bg-casino-surface-low p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/20 font-heading text-lg font-bold text-neon-green">
                  {item.step}
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: casino lobby page with hero, ticker, how-to-play"
```

---

## Task 12: Dashboard Page

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/mode-selector.tsx`
- Create: `src/components/daily-wheel.tsx`

- [ ] **Step 1: Create mode selector**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModeSelectorProps {
  bankroll: number;
  heatStreak: number;
}

const modes = [
  {
    id: "DAILY",
    title: "Daily High Stakes",
    cost: 10,
    desc: "Once per day. 10 chip entry. Posts to leaderboard.",
    color: "neon-green",
    required: 0,
  },
  {
    id: "INFINITE",
    title: "Infinite Cash Run",
    cost: 50,
    desc: "50 chip entry. Endless mode with escalating stakes.",
    color: "neon-gold",
    required: 0,
  },
  {
    id: "HIGH_ROLLER",
    title: "High Roller Lounge",
    cost: 50,
    desc: "Locked until 5,000 chips bankroll. 5x multipliers.",
    color: "neon-red",
    required: 5000,
  },
];

export function ModeSelector({ bankroll, heatStreak }: ModeSelectorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlay = async (modeId: string) => {
    setLoading(modeId);
    try {
      const { initGame } = await import("@/actions/game-actions");
      const result = await initGame(modeId as "DAILY" | "INFINITE");
      router.push(`/play/${result.gameId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start game");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {modes.map((mode) => {
        const locked = bankroll < mode.required;
        const canAfford = bankroll >= mode.cost;
        return (
          <div
            key={mode.id}
            className={`relative rounded-xl border bg-casino-surface-low p-6 transition-all ${
              locked
                ? "border-tile-border/20 opacity-50"
                : `border-${mode.color}/30 hover:border-${mode.color}/60 hover:shadow-[0_0_20px_rgba(var(--${mode.color}-rgb),0.2)]`
            }`}
          >
            <h3 className="font-heading text-lg font-bold text-text-primary">{mode.title}</h3>
            <p className="mt-2 text-sm text-text-secondary">{mode.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-heading text-sm text-text-muted">{mode.cost} chips</span>
              <button
                onClick={() => handlePlay(mode.id)}
                disabled={locked || !canAfford || loading === mode.id}
                className={`rounded-lg px-4 py-2 font-heading text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                  locked
                    ? "bg-tile-border text-text-muted"
                    : `bg-${mode.color} text-casino-bg hover:scale-105`
                }`}
              >
                {loading === mode.id ? "Loading..." : locked ? "Locked" : "Play"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create daily wheel**

```tsx
"use client";

import { useState } from "react";

interface DailyWheelProps {
  bankroll: number;
}

export function DailyWheel({ bankroll }: DailyWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [claimed, setClaimed] = useState(false);

  if (bankroll > 0 || claimed) return null;

  const handleClaim = async () => {
    setSpinning(true);
    try {
      const { claimDailyWheel } = await import("@/actions/profile-actions");
      await claimDailyWheel();
      setClaimed(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to claim");
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="rounded-xl border border-neon-gold/30 bg-casino-surface-low p-6 text-center">
      <div className="font-heading text-4xl">🎰</div>
      <h3 className="mt-2 font-heading text-lg font-bold text-neon-gold">
        Daily Stimulus
      </h3>
      <p className="mt-1 text-sm text-text-secondary">
        You&apos;re out of chips! Claim your free 50-chip bonus.
      </p>
      <button
        onClick={handleClaim}
        disabled={spinning}
        className="mt-4 rounded-lg bg-neon-gold px-6 py-2 font-heading text-sm font-bold text-casino-bg transition-all hover:scale-105 disabled:opacity-50"
      >
        {spinning ? "Claiming..." : "Claim 50 Chips"}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create dashboard page**

```tsx
import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ModeSelector } from "@/components/mode-selector";
import { DailyWheel } from "@/components/daily-wheel";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Profile Bar */}
        <div className="flex items-center justify-between rounded-xl border border-tile-border/30 bg-casino-surface-low px-6 py-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-text-primary">
              Welcome, {profile.username}
            </h1>
            <p className="text-sm text-text-secondary">
              Heat Streak: <span className="text-neon-gold font-bold">{profile.heat_streak}</span>
              {profile.heat_streak >= 3 && (
                <span className="ml-2 text-neon-green">
                  ({profile.heat_streak >= 10 ? "2.0x" : profile.heat_streak >= 5 ? "1.5x" : "1.2x"} multiplier)
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Bankroll
            </span>
            <div className="font-heading text-3xl font-bold text-neon-green">
              {profile.bankroll} chips
            </div>
          </div>
        </div>

        {/* Daily Wheel */}
        <div className="mt-6">
          <DailyWheel bankroll={profile.bankroll} />
        </div>

        {/* Mode Selector */}
        <div className="mt-8">
          <h2 className="font-heading text-lg font-bold text-text-primary mb-4">
            Choose Your Game
          </h2>
          <ModeSelector bankroll={profile.bankroll} heatStreak={profile.heat_streak} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: dashboard with mode selector and daily wheel"
```

---

## Task 13: Game Table Page

**Files:**
- Create: `src/app/play/[gameId]/page.tsx`

- [ ] **Step 1: Create game table page**

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { WordleGrid } from "@/components/wordle-grid";
import { VirtualKeyboard } from "@/components/virtual-keyboard";
import { EscrowHud } from "@/components/escrow-hud";
import { ActionDeck } from "@/components/action-deck";
import { useGameStore } from "@/stores/game-store";
import { submitGuess, useHintAction } from "@/actions/game-actions";
import type { HintType } from "@/lib/types";

interface GameTableProps {
  params: Promise<{ gameId: string }>;
}

export default function GameTablePage({ params }: GameTableProps) {
  const router = useRouter();
  const [gameId, setGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [message, setMessage] = useState("");

  const {
    boardGrid,
    tileStates,
    keyboardState,
    currentRow,
    currentCol,
    currentChips,
    heatStreak,
    isDoubleDownActive,
    gameStatus,
    hintsUsed,
    cardCountRemaining,
    setGameId: storeSetGameId,
    setGameInfo,
    typeLetter,
    deleteLetter,
    submitGuess: storeSubmitGuess,
    activateDoubleDown,
    useHint,
    resetGame,
    setStatus,
  } = useGameStore();

  useEffect(() => {
    params.then((p) => {
      setGameId(p.gameId);
      storeSetGameId(p.gameId);
    });
  }, [params, storeSetGameId]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (loading || isRevealing || gameStatus !== "IN_PROGRESS") return;
      typeLetter(key);
    },
    [loading, isRevealing, gameStatus, typeLetter]
  );

  const handleDelete = useCallback(() => {
    if (loading || isRevealing) return;
    deleteLetter();
  }, [loading, isRevealing, deleteLetter]);

  const handleSubmit = useCallback(async () => {
    if (loading || isRevealing || !gameId) return;
    if (currentCol !== 5) {
      setMessage("Not enough letters");
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const guess = boardGrid[currentRow].join("");
    setLoading(true);
    setIsRevealing(true);

    try {
      const result = await submitGuess(gameId, guess, currentRow + 1, isDoubleDownActive);

      storeSubmitGuess(guess, result.tileStates);
      setMessage(result.message);

      if (result.status !== "IN_PROGRESS") {
        setStatus(result.status);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error");
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRevealing(false), 500);
    }
  }, [gameId, boardGrid, currentRow, currentCol, isDoubleDownActive, loading, isRevealing, storeSubmitGuess, setStatus]);

  const handleDoubleDown = useCallback(() => {
    activateDoubleDown();
    setMessage("DOUBLE DOWN ACTIVATED - All or nothing!");
  }, [activateDoubleDown]);

  const handleFold = useCallback(() => {
    setStatus("FOLDED");
    setMessage("Folded. You preserved your remaining chips.");
  }, [setStatus]);

  const handleHint = useCallback(
    async (hint: HintType) => {
      if (!gameId) return;
      try {
        const result = await useHintAction(gameId, hint);
        useHint(hint);
        setMessage(`Hint applied: ${hint.replace("_", " ")}`);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Hint failed");
      }
    },
    [gameId, useHint]
  );

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Enter") handleSubmit();
      else if (e.key === "Backspace") handleDelete();
      else if (/^[a-zA-Z]$/.test(e.key)) handleKeyPress(e.key.toUpperCase());
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit, handleDelete, handleKeyPress]);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Escrow HUD */}
          <EscrowHud
            currentChips={currentChips}
            row={currentRow + 1}
            isDoubleDown={isDoubleDownActive}
          />

          {/* Message */}
          {message && (
            <div className="rounded-lg bg-casino-surface-high px-4 py-2 text-center font-heading text-sm font-bold text-neon-gold">
              {message}
            </div>
          )}

          {/* Wordle Grid */}
          <div className="flex justify-center">
            <WordleGrid
              boardGrid={boardGrid}
              tileStates={tileStates}
              currentRow={currentRow}
              currentCol={currentCol}
              isRevealing={isRevealing}
              shakeRow={shakeRow}
            />
          </div>

          {/* Action Deck */}
          <ActionDeck
            row={currentRow + 1}
            currentChips={currentChips}
            isDoubleDown={isDoubleDownActive}
            hintsUsed={hintsUsed}
            cardCountRemaining={cardCountRemaining}
            onDoubleDown={handleDoubleDown}
            onFold={handleFold}
            onHint={handleHint}
          />

          {/* Virtual Keyboard */}
          <div className="flex justify-center">
            <VirtualKeyboard
              keyboardState={keyboardState}
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onEnter={handleSubmit}
              disabled={loading || isRevealing || gameStatus !== "IN_PROGRESS"}
            />
          </div>

          {/* Game Over */}
          {gameStatus !== "IN_PROGRESS" && (
            <div className="rounded-xl border border-neon-green/30 bg-casino-surface-low p-6 text-center">
              <h2 className="font-heading text-2xl font-bold text-neon-green">
                {gameStatus === "WON" ? "Winner Winner!" : gameStatus === "BANKRUPT" ? "Bankruptcy!" : "Folded"}
              </h2>
              <p className="mt-2 text-text-secondary">{message}</p>
              <button
                onClick={() => {
                  resetGame();
                  router.push("/dashboard");
                }}
                className="mt-4 rounded-lg bg-neon-green px-6 py-2 font-heading text-sm font-bold text-casino-bg transition-all hover:scale-105"
              >
                Back to Hub
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: game table page with grid, keyboard, actions, and game over"
```

---

## Task 14: Leaderboard Page

**Files:**
- Create: `src/app/leaderboard/page.tsx`
- Create: `src/components/leaderboard-table.tsx`

- [ ] **Step 1: Create leaderboard table**

```tsx
"use client";

interface LeaderboardEntry {
  rank: number;
  username: string;
  heatStreak: number;
  highestEverBankroll: number;
  totalWins: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-tile-border/30 bg-casino-surface-low">
      <table className="w-full">
        <thead>
          <tr className="border-b border-tile-border/30 text-left">
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Rank
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Player
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Streak
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Peak
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Wins
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.rank}
              className={`border-b border-tile-border/10 transition-colors hover:bg-casino-surface-high ${
                entry.rank <= 3 ? "bg-casino-surface-high/50" : ""
              }`}
            >
              <td className="px-6 py-4">
                <span
                  className={`font-heading text-lg font-bold ${
                    entry.rank === 1
                      ? "text-neon-gold"
                      : entry.rank === 2
                      ? "text-text-secondary"
                      : entry.rank === 3
                      ? "text-orange-400"
                      : "text-text-muted"
                  }`}
                >
                  {entry.rank === 1 ? "👑" : `#${entry.rank}`}
                </span>
              </td>
              <td className="px-6 py-4 font-heading font-bold text-text-primary">
                {entry.username}
              </td>
              <td className="px-6 py-4">
                <span className="font-heading text-neon-gold">{entry.heatStreak}</span>
                {entry.heatStreak >= 3 && (
                  <span className="ml-1 text-xs text-neon-green">
                    ({entry.heatStreak >= 10 ? "2x" : entry.heatStreak >= 5 ? "1.5x" : "1.2x"})
                  </span>
                )}
              </td>
              <td className="px-6 py-4 font-heading text-text-secondary">
                {entry.highestEverBankroll}
              </td>
              <td className="px-6 py-4 font-heading text-neon-green">{entry.totalWins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Create leaderboard page**

```tsx
import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/leaderboard-table";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: topPlayers } = await supabase
    .from("profiles")
    .select("id, username, heat_streak, highest_ever_bankroll, total_wins")
    .order("highest_ever_bankroll", { ascending: false })
    .limit(100);

  const entries = (topPlayers || []).map((p, i) => ({
    rank: i + 1,
    username: p.username,
    heatStreak: p.heat_streak,
    highestEverBankroll: p.highest_ever_bankroll,
    totalWins: p.total_wins,
  }));

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-6">
          High-Rollers Lounge
        </h1>
        <LeaderboardTable entries={entries} currentUserId={user?.id} />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: leaderboard page with top 100 table"
```

---

## Task 15: Profile Page

**Files:**
- Create: `src/app/profile/page.tsx`

- [ ] **Step 1: Create profile page**

```tsx
import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  const winRate = profile.total_games_played > 0
    ? ((profile.total_wins / profile.total_games_played) * 100).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Win Rate", value: `${winRate}%`, color: "text-neon-green" },
    { label: "Games Played", value: profile.total_games_played, color: "text-text-primary" },
    { label: "Total Wins", value: profile.total_wins, color: "text-neon-green" },
    { label: "Bankruptcies", value: profile.total_bankruptcies, color: "text-neon-red" },
    { label: "Current Streak", value: profile.heat_streak, color: "text-neon-gold" },
    { label: "Peak Bankroll", value: profile.highest_ever_bankroll, color: "text-neon-green" },
  ];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-primary">
              {profile.username}
            </h1>
            <p className="text-text-secondary">Cashier / Profile</p>
          </div>
          <div className="text-right">
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Bankroll
            </span>
            <div className="font-heading text-4xl font-bold text-neon-green">
              {profile.bankroll} chips
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-tile-border/30 bg-casino-surface-low p-6"
            >
              <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
                {stat.label}
              </span>
              <div className={`mt-2 font-heading text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: profile/cashier page with stats grid"
```

---

## Task 16: Build Verification

**Files:**
- Verify: `next.config.ts`

- [ ] **Step 1: Verify build succeeds**

```bash
npx next build
```

Expected: Build completes with no errors. Warnings about dynamic routes are acceptable.

- [ ] **Step 2: Fix any issues found**

If there are TypeScript errors, fix them in the relevant files.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix: resolve build errors"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Install deps, clean up | `package.json` |
| 2 | Casino theme tokens | `globals.css`, `layout.tsx` |
| 3 | Types & word list | `lib/types.ts`, `lib/words.ts`, `lib/game.ts` |
| 4 | Supabase setup | `lib/supabase/*`, `middleware.ts` |
| 5 | Zustand store | `stores/game-store.ts` |
| 6 | Server actions | `actions/game-actions.ts`, `actions/profile-actions.ts` |
| 7 | Nav component | `components/nav.tsx` |
| 8 | Wordle grid | `components/wordle-grid.tsx` |
| 9 | Virtual keyboard | `components/virtual-keyboard.tsx` |
| 10 | Escrow HUD & actions | `components/escrow-hud.tsx`, `components/action-deck.tsx` |
| 11 | Casino lobby | `app/page.tsx` |
| 12 | Dashboard | `app/dashboard/page.tsx`, `components/mode-selector.tsx`, `components/daily-wheel.tsx` |
| 13 | Game table | `app/play/[gameId]/page.tsx` |
| 14 | Leaderboard | `app/leaderboard/page.tsx`, `components/leaderboard-table.tsx` |
| 15 | Profile | `app/profile/page.tsx` |
| 16 | Build verification | All |
