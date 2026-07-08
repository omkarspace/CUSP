# Phase 3: Polish & Audio

> **Goal:** Add Framer Motion animations, Howler.js casino audio, insurance payout logic, daily wheel animation, and share card.

## Task 1: Framer Motion Tile Flip Animations

**Files:** `src/components/wordle-grid.tsx`

Replace CSS `animate-flip-in` with Framer Motion `motion.div` using staggered `AnimatePresence`. Each tile should:
- Flip on X axis (rotateX) over 400ms when revealed
- Stagger 100ms per column (colIdx * 100ms delay)
- Land with neon glow shadow
- Use `layout` prop for smooth transitions

Also add screen shake via Framer Motion: replace `animate-shake` CSS class with Framer Motion `animate={{ x: [0, -4, 4, -4, 4, -4, 4, 0] }}` with `transition={{ duration: 0.5 }}`.

## Task 2: Chip Counter + Screen Shake

**Files:** `src/components/escrow-hud.tsx`, `src/app/play/[gameId]/page.tsx`

**Escrow HUD:** Improve chip counter animation:
- Use Framer Motion spring animation (`type: "spring", stiffness: 300, damping: 20`)
- Animate number changes with scale and color transition
- Add sparkle/glow on positive changes

**Double Down screen shake:** Add full-page horizontal shake animation when:
- Double Down button is pressed (`isDoubleDownActive` becomes true)
- Game ends in BANKRUPT
Use Framer Motion on a wrapper div with `animate` x oscillation.

## Task 3: Howler.js Casino Sound System

**Create:** `src/lib/sounds.ts`

Create a sound manager that:
- Preloads sounds using Howler's `Howl` instances
- Exports `playSound(name: SoundName)` function
- Handles errors gracefully (no crash if audio missing)
- Uses low-latency HTML5 Audio mode

Sound names and their triggers:
- `key_press` → Every letter typed on virtual keyboard
- `key_enter` → Submit guess
- `tile_correct` → Tile flip reveals green (per tile)
- `tile_present` → Tile flip reveals yellow (per tile)
- `tile_absent` → Tile flip reveals gray (per tile)
- `win_jingle` → Game won
- `bankruptcy` → Game over as bankrupt
- `double_down` → Double Down activated (heartbeat pulse)
- `fold` → Fold action
- `chip_clink` → Chip balance changes
- `hint_use` → Hint purchased

Since we can't include actual audio files, create a `generateSounds()` function that uses Web Audio API to procedurally generate sounds (oscillator-based beeps, clicks, and tones). This removes the need for audio files entirely.

## Task 4: Insurance Payout Logic

**Files:** `src/actions/game-actions.ts`, `src/lib/types.ts`

When a game ends in BANKRUPT and the player had purchased `insurance` hint:
- Calculate 50% refund of total row costs incurred
- Add refund to player's bankroll
- Send `insuranceRefund` in the response

Modify `submitGuess` to:
- Track total costs in `game_sessions` table (add `total_costs_incurred` column)
- On BANKRUPT status, check if `insurance` was in `hints_used`
- Calculate refund: `Math.floor(total_costs_incurred * 0.5)`
- Add refund to player's bankroll
- Return `insuranceRefund` in the response

Also modify the SQL schema note to include this column.

## Task 5: Daily Wheel Spinning Animation

**Files:** `src/components/daily-wheel.tsx`

Replace static emoji with Framer Motion animated wheel:
- On claim click, start spinning animation (rotate emoji container 720-1440 degrees over 2s)
- Show chip count landing on final value
- Green glow pulse on completion
- Add chip clink sound on completion

## Task 6: Share Card for Leaderboard

**Create:** `src/components/share-card.tsx`

A component that:
- Takes `username`, `rank`, `streak`, `peak` props
- Renders a styled card matching the casino theme
- Has a "Copy Share Text" button that copies formatted text to clipboard:
  ```
  🎰 CUSP - The Penthouse
  Rank: #12 | Streak: 5 🔥 | Peak: 2,500 chips
  Think you can beat me? 👑
  ```
- Shows a toast/confirmation on successful copy

## Task 7: Build Verification

```bash
npx next build
```
Should compile cleanly.
