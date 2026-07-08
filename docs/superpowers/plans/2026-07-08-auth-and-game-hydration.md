# Auth System + Game State Hydration

> **For agentic workers:** Implement task-by-task using subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add Supabase Auth (Google/GitHub OAuth), login page, auth guard, auth-aware nav, and hydrate game state from server on mount.

**Architecture:** Next.js App Router with Supabase SSR auth. Server action `getGameState` returns game metadata without exposing target word. Zustand store hydrates from server on `/play/[gameId]` mount. Protected routes redirect to `/login`.

**Pages:**
- `/login` — Login page with Google/GitHub OAuth buttons, handles both sign-in and sign-up
- `/auth/callback` — OAuth redirect handler (route handler)
- `/` — Lobby now checks auth status, shows different CTA
- `/play/[gameId]` — Hydrates game state from server on mount

---

### Task 1: Auth Callback Route

**Create:** `src/app/auth/callback/route.ts`

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

### Task 2: Login Page

**Create:** `src/app/login/page.tsx`

```typescript
import { LoginForm } from "@/components/login-form";
import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <>
      <Nav />
      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-24">
        <h1 className="font-heading text-4xl font-extrabold text-neon-green text-center">
          WORDLE CASINO
        </h1>
        <p className="mt-2 text-text-secondary text-center">
          Sign in to place your bets.
        </p>
        <div className="mt-10 w-full">
          <LoginForm />
        </div>
      </main>
    </>
  );
}
```

### Task 3: Login Form Component

**Create:** `src/components/login-form.tsx`

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [loading, setLoading] = useState<string | null>(null);

  const signInWith = async (provider: "google" | "github") => {
    setLoading(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => signInWith("google")}
        disabled={loading !== null}
        className="w-full rounded-xl border border-tile-border/30 bg-casino-surface-low px-6 py-4 font-heading text-sm font-bold text-text-primary transition-all hover:bg-casino-surface-high disabled:opacity-50 flex items-center justify-center gap-3"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        {loading === "google" ? "Connecting..." : "Continue with Google"}
      </button>
      <button
        onClick={() => signInWith("github")}
        disabled={loading !== null}
        className="w-full rounded-xl border border-tile-border/30 bg-casino-surface-low px-6 py-4 font-heading text-sm font-bold text-text-primary transition-all hover:bg-casino-surface-high disabled:opacity-50 flex items-center justify-center gap-3"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
        {loading === "github" ? "Connecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
}
```

### Task 4: Auth-Aware Nav + CTA

**Modify:** `src/components/nav.tsx` — Add sign out button and auth-aware links
**Modify:** `src/app/page.tsx` — Make CTA auth-aware
**Create:** `src/components/auth-button.tsx` — Reusable sign out button

**src/components/auth-button.tsx:**
```typescript
"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function AuthButton({ email }: { email?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      {email && (
        <span className="hidden text-xs text-text-muted sm:block">{email}</span>
      )}
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="rounded-lg border border-tile-border/30 px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-neon-red/50 hover:text-neon-red disabled:opacity-50"
      >
        {loading ? "..." : "Sign Out"}
      </button>
    </div>
  );
}
```

**Modify `src/components/nav.tsx` — add auth section:**
Replace the nav to accept a `userEmail` prop and show auth button:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";

interface NavProps {
  userEmail?: string;
}

const links = [
  { href: "/", label: "Lobby" },
  { href: "/dashboard", label: "Hub" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Cashier" },
];

export function Nav({ userEmail }: NavProps) {
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
        <AuthButton email={userEmail} />
      </div>
    </nav>
  );
}
```

**Modify `src/app/page.tsx` — auth-aware lobby:**
Wrap the page to check auth server-side and pass user info:

```typescript
import { Nav } from "@/components/nav";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

export default async function LobbyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Nav userEmail={user?.email} />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h1 className="font-heading text-6xl font-extrabold tracking-tight text-neon-green drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            WORDLE CASINO
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Where every guess is a transaction.
          </p>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="mt-8 inline-block rounded-xl bg-neon-green px-8 py-4 font-heading text-lg font-bold text-casino-bg shadow-neon-green transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            {user ? "Enter the Lobby" : "Login to Play"}
          </Link>
        </div>

        <div className="mt-16 rounded-xl border border-tile-border/30 bg-casino-surface-low p-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Live Wins
            </span>
          </div>
          <div className="mt-3 overflow-hidden">
            <div className="flex gap-8 text-sm text-text-secondary">
              <span><strong className="text-neon-gold">Player1</strong> won <strong className="text-neon-green">+200</strong> chips on Row 1</span>
              <span><strong className="text-neon-gold">HighRoller</strong> doubled down and won <strong className="text-neon-green">+600</strong> chips!</span>
              <span><strong className="text-neon-gold">WordNerd</strong> on a <strong className="text-neon-gold">5-win streak</strong> (1.5x multiplier)</span>
              <span><strong className="text-neon-gold">LuckyGuess</strong> won <strong className="text-neon-green">+150</strong> chips on Row 2</span>
            </div>
          </div>
        </div>

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

### Task 5: Game State Hydration

**Modify:** `src/actions/game-actions.ts` — Add `getGameState` action
**Modify:** `src/stores/game-store.ts` — Add `hydrateFromServer` action
**Modify:** `src/app/play/[gameId]/page.tsx` — Hydrate on mount

**Add to `src/actions/game-actions.ts`:**
```typescript
export async function getGameState(gameId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: game } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game) throw new Error("Game not found");

  return {
    gameMode: game.game_mode,
    currentRow: game.current_row,
    currentChipsEscrow: game.current_chips_escrow,
    isDoubleDown: game.is_double_down,
    hintsUsed: game.hints_used as string[],
    status: game.status,
  };
}
```

**Add to `src/stores/game-store.ts` — add `hydrateFromServer`:**
```typescript
  hydrateFromServer: (data: {
    currentRow: number;
    currentChipsEscrow: number;
    isDoubleDown: boolean;
    hintsUsed: string[];
    status: GameStatus;
  }) =>
    set({
      currentRow: data.currentRow - 1,
      currentCol: 0,
      currentChips: data.currentChipsEscrow,
      isDoubleDownActive: data.isDoubleDown,
      hintsUsed: data.hintsUsed as HintType[],
      cardCountRemaining: 2 - data.hintsUsed.filter((h) => h === "card_count").length,
      gameStatus: data.status,
    }),
```

**Modify `src/app/play/[gameId]/page.tsx` — add hydration useEffect:**
Add before the keyboard listener:
```typescript
  // Hydrate game state on mount
  useEffect(() => {
    if (!gameId) return;
    const hydrate = async () => {
      try {
        const { getGameState } = await import("@/actions/game-actions");
        const state = await getGameState(gameId);
        hydrateFromServer(state);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Failed to load game");
      }
    };
    hydrate();
  }, [gameId, hydrateFromServer]);
```
And add `hydrateFromServer` to the destructured store:
```typescript
    hydrateFromServer,
```

### Task 6: Auth Guard — Protected Routes

**Modify:** `src/app/dashboard/page.tsx` — Already has redirect check, but add Nav userEmail
**Modify:** `src/app/leaderboard/page.tsx` — Add Nav userEmail
**Modify:** `src/app/profile/page.tsx` — Add Nav userEmail

Each page already has an auth check that redirects to `/`. Update to pass `userEmail` to Nav, and redirect to `/login` instead of `/` for better UX.

Example change for dashboard:
```typescript
  if (!user) redirect("/login");
```
(Already the pattern exists, just change redirect destination)

---

### Build Verification

```bash
npx next build
```
Should compile cleanly.
