"use client";

import type { HintType } from "@/lib/types";
import { HINT_COSTS } from "@/lib/types";
import { playSound } from "@/lib/sounds";

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
          onClick={() => { playSound("hint_use"); onHint("card_count"); }}
          disabled={!canAffordHint("card_count") || hintsUsed.includes("card_count") || cardCountRemaining <= 0}
          className="flex-1 rounded-lg border border-tile-border/30 bg-casino-surface-low px-3 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-casino-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
        >
            Burn 3 (-{HINT_COSTS.card_count})
          <br />
          <span className="text-text-muted">{cardCountRemaining} left</span>
        </button>
        <button
          onClick={() => { playSound("hint_use"); onHint("peek"); }}
          disabled={!canAffordHint("peek") || hintsUsed.includes("peek")}
          className="flex-1 rounded-lg border border-tile-border/30 bg-casino-surface-low px-3 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-casino-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Peek Letter (-{HINT_COSTS.peek})
        </button>
        <button
          onClick={() => { playSound("hint_use"); onHint("insurance"); }}
          disabled={!canAffordHint("insurance") || hintsUsed.includes("insurance")}
          className="flex-1 rounded-lg border border-tile-border/30 bg-casino-surface-low px-3 py-2 text-xs font-bold text-text-secondary transition-all hover:bg-casino-surface-high disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Insurance (-{HINT_COSTS.insurance})
        </button>
      </div>
    </div>
  );
}
