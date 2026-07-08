---
name: CUSP
description: On the edge of a win
colors:
  accent: "#0D7377"
  accent-soft: "#E8F4F4"
  accent-dark: "#0A5C5E"
  gold: "#B8862C"
  gold-soft: "#FDF4E3"
  rose: "#B84A4A"
  rose-soft: "#FDF0F0"
  ink: "#1C1B1A"
  ink-secondary: "#6B6560"
  ink-muted: "#9C9590"
  surface: "#FFFFFF"
  surface-elevated: "#F0EDE8"
  canvas: "#F5F3EF"
  border: "#E2DDD8"
  tile-correct-bg: "#0D7377"
  tile-correct-text: "#FFFFFF"
  tile-present-bg: "#B8862C"
  tile-present-text: "#FFFFFF"
  tile-absent-bg: "#E2DDD8"
  tile-absent-text: "#9C9590"
  dark-accent: "#1A8A8E"
  dark-accent-soft: "#0D2425"
  dark-gold: "#D4A44A"
  dark-gold-soft: "#1E190E"
  dark-rose: "#D46A6A"
  dark-rose-soft: "#2A1515"
  dark-ink: "#EDEBE9"
  dark-ink-secondary: "#8A8480"
  dark-ink-muted: "#5E5956"
  dark-surface: "#1C1B1A"
  dark-surface-elevated: "#242322"
  dark-canvas: "#161514"
  dark-border: "#33312E"
  dark-tile-correct-bg: "#1A8A8E"
  dark-tile-correct-text: "#FFFFFF"
  dark-tile-present-bg: "#D4A44A"
  dark-tile-present-text: "#1C1B1A"
  dark-tile-absent-bg: "#33312E"
  dark-tile-absent-text: "#5E5956"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
---

# Design System: CUSP

## 1. Overview

**Creative North Star: "The Edge"**

CUSP lives in the moment between the guess and the reveal — that charged pause where the outcome hasn't landed yet. The interface is a private high-stakes room, not a casino floor. Every element is stripped to its essential function, then refined. No neon, no Vegas theatrics. The tension comes from typography, spacing, and the quiet confidence of a room that doesn't need to prove itself.

This system rejects the casino cliché (glowing green, flashing gold, roulette-wheel decoration). Instead it evokes the physical objects of the game: felt-textured surfaces, sharp card-stock whites, deep ink on paper, the clean precision of a dealer's table. Warm neutrals ground the experience; deep teal and refined gold signal meaning without shouting.

**Key Characteristics:**
- Warm neutral foundation, not cool gray or beige — the canvas has presence
- One sans family carries the full hierarchy; weight and spacing do the work
- Light and dark modes that share the same accent language, not separate brands
- Borders define surfaces, not shadows — depth through layering, not elevation
- Tiles are the only decorative element; everything else recedes

## 2. Colors: The Felt Palette

Warm neutrals with a deep teal accent. The palette is restrained — the accent appears on ≤10% of any given screen. Color carries information, not decoration.

### Primary
- **Deep Teal** (#0D7377 / dark: #1A8A8E): Primary actions, correct tile states, active selection. Calm and confident. Not green, not blue — a precise midpoint.

### Neutral
- **Ink** (#1C1B1A / dark: #EDEBE9): Body text and headings. Near-black with a trace of warmth. Never pure #000.
- **Ink Secondary** (#6B6560 / dark: #8A8480): Labels, metadata, secondary text.
- **Ink Muted** (#9C9590 / dark: #5E5956): Placeholders, disabled text, captions.
- **Canvas** (#F5F3EF / dark: #161514): Page background. A warm off-white with substance; never a clinical white. Dark mode is a warm near-black.
- **Surface** (#FFFFFF / dark: #1C1B1A): Card, modal, and panel backgrounds.
- **Surface Elevated** (#F0EDE8 / dark: #242322): Hover states, active cards.
- **Border** (#E2DDD8 / dark: #33312E): All borders, dividers, and outlines.

### Win / Loss
- **Refined Gold** (#B8862C / dark: #D4A44A): Wins, streaks, tier names, present tile state. Warm, never brassy.
- **Muted Rose** (#B84A4A / dark: #D46A6A): Errors, losses, destructive actions. Not alarming — precise.

### Named Rules
**The 10% Rule.** The deep teal accent covers no more than 10% of any given screen. Its rarity is the point. When you see teal, it matters.

**The No-Green Rule.** No pure green — not in buttons, not in tiles, not in accents. "Win" is gold; "correct" is teal. Green belongs to the casino floor; CUSP is upstairs.

## 3. Typography

**Body Font:** Inter (with `ui-sans-serif, system-ui, sans-serif` fallback)
**Mono Font:** JetBrains Mono (for chip counts, scores, tabular data)

**Character:** Single-family refinement. Inter's quiet precision carries everything from the hero to the keyboard key. Weight contrast does the work of hierarchy; no display font needed. The mono face signals "numbers worth reading" — bankroll, streak counts, row counters.

### Hierarchy
- **Display** (Semi-Bold 600, 2.5rem/40px, 1.1): The CUSP wordmark and page-level H1s only. Never used in-body.
- **Headline** (Semi-Bold 600, 1.5rem/24px, 1.25): Section headers — "The Board", "Play", "Profile".
- **Title** (Semi-Bold 600, 1.125rem/18px, 1.3): Card titles, mode names.
- **Body** (Regular 400, 0.9375rem/15px, 1.5): Running text, descriptions. Max line length 65ch.
- **Label** (Medium 500, 0.8125rem/13px, 1.2, +0.04em tracking): Buttons, table headers, form labels, uppercase as needed.
- **Mono** (Regular 400, 0.9375rem/15px, 1.4): Chip amounts, streak numbers, scores.
- **Document** (Semi-Bold 500, 0.875rem/14px, 1.3): The optional body one step between Label and Body, for compact info in game-state areas or dense rows that need to stay readable without drawing focus.

### Named Rules
**The Single-Family Rule.** No serif, no display font. All headings, body, buttons, labels, and data are Inter. The hierarchy is expressed through weight (400 / 500 / 600), size (0.8125–2.5rem), and letter-spacing. JetBrains Mono is the single exception for numeric display.

## 4. Elevation

This system uses tonal layering, not shadows. Depth is conveyed through surface color: canvas → surface → surface-elevated. Each step shifts the background by one lightness tick on the same warm-neutral axis.

Cards and containers sit at `surface` against the `canvas` background. Interactive states (hover, active) shift to `surface-elevated`. No drop shadows, no floating elements.

### Named Rules
**The No-Shadow Rule.** No `box-shadow` on any surface element. Buttons, cards, modals, dropdowns — all flat. Depth lives in the color stack, not in light simulation. Shadows are reserved exclusively for tile state feedback (correct / present glow on reveal).

## 5. Components

For each component, lead with a short character line, then specify shape, color assignment, states, and any distinctive behavior.

### Buttons
- **Shape:** Gently rounded corners (lg: 12px). No shadows. Capital case (Label weight).
- **Primary:** Deep teal background, white text. 12px 24px padding. Hover: dark-teal background. Active: scale 0.98.
- **Secondary:** Transparent background, ink text, 1px solid border (border). Hover: surface-elevated background.
- **Ghost:** Transparent, ink-secondary text. Minimal padding (8px 16px). Hover: ink text.
- **Danger:** Muted rose background or rose border variant. Confirms destructive intent.
- All buttons: transition 150ms ease, no decorative glow.

### Cards / Containers
- **Corner Style:** Generous rounded corners (xl: 16px).
- **Background:** Surface color, 1px border (border).
- **Shadow Strategy:** None (see No-Shadow Rule).
- **Internal Padding:** lg (24px).
- Hover: surface-elevated background (where interactive).

### Inputs / Fields
- **Style:** 1px border (border), surface background, md (8px) radius.
- **Focus:** Border shifts to accent. No glow.
- **Placeholder:** Ink-muted color.
- **Error:** Border shifts to rose.

### Navigation
- **Style:** Clean top bar, canvas background, 1px bottom border.
- **Content:** Logo/wordmark on left, navigation links center-left, auth + theme toggle on right.
- **Nav links:** Label style, ink-muted text. Active: ink text with subtle underline indicator.
- **Mobile:** Responsive collapse with hamburger.

### Tiles (Wordle Grid)
- **Shape:** Square, md (8px) radius.
- **Default:** Transparent fill, 2px border (tile-border), ink-muted letter.
- **Correct:** Deep teal fill, no border, white letter. Soft teal glow on reveal.
- **Present:** Refined gold fill, no border, white letter. Soft gold glow on reveal.
- **Absent:** Absent-bg fill, no border, absent-text letter.
- **Animation:** 3D flip (rotateX) with 100ms stagger per column. 400ms duration.

### Keyboard Keys
- **Shape:** Rectangular, md (8px) radius.
- **Default:** Surface-elevated background, border border, ink text.
- **Correct:** Deep teal fill, white text.
- **Present:** Refined gold fill, dark text.
- **Used:** Absent-bg fill, absent-text.
- **Action keys (ENTER/DEL):** Slightly wider (68px), label font.

### The Player Card (Shareable)
- **Style:** Code-block aesthetic inside a surface card. Monospace text, elevated surface background for the code area.
- **Button:** Refined gold soft-bg for the copy button.

### Leaderboard Table
- **Style:** Clean table, no stripes. Surface-card container, 16px radius.
- **Headers:** Label style, tracking-widest, ink-muted.
- **Rows:** Border-bottom dividers. Hover: surface-elevated.
- **Rank 1:** Gold text.
- **Rank 2-3:** Ink-secondary text.

## 6. Do's and Don'ts

### Do:
- **Do** use the full surface family (canvas → surface → surface-elevated) before considering borders. Tonal layering is the primary depth mechanism.
- **Do** keep the deep teal accent to ≤10% of screen area. It should feel like a precise instrument, not a theme.
- **Do** use JetBrains Mono for all chip counts, scores, and streak numbers. Numbers are data; treat them as such.
- **Do** use Refined Gold for wins, streak indicators, and tier badges exclusively. Gold is earned, not decorative.
- **Do** let whitespace carry the tension. Empty space is the premium move.
- **Do** animate tile reveals correctly — the 3D flip stagger is the game's signature motion moment.
- **Do** use `text-wrap: balance` on headings. Uneven line breaks cheapen the precision.

### Don't:
- **Don't** use pure green anywhere. No buttons, no tiles, no backgrounds. "Correct" is teal; "win" is gold.
- **Don't** use neon effects, glows, or gradients on UI elements. The only glow is on tile reveal animations.
- **Don't** use casino imagery — no dice, roulette wheels, card suits, or chip stacks as decoration. The casino metaphor lives in the language, not the visuals.
- **Don't** use shadows on surfaces. The No-Shadow Rule is absolute; depth is tonal.
- **Don't** use a display font. Inter covers everything.
- **Don't** use gradient or rainbow text for tier names or badges. Single solid colors only.
- **Don't** use the tight beige-cream body background that reads as "AI default." The canvas is a warm off-white with actual substance — not sand, not parchment, not cream.
- **Don't** stack cards inside cards. One level of containment is the limit.
