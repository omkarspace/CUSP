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
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onFold}
            className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 sm:py-3 font-label text-xs text-ink-secondary transition-colors hover:bg-surface-elevated active:bg-surface-elevated"
          >
            Fold (Save Chips)
          </button>
          <button
            onClick={onDoubleDown}
            className="flex-1 rounded-lg border border-rose/50 bg-rose-soft px-4 py-3 sm:py-3 font-label text-xs text-rose transition-colors hover:bg-rose-soft/80 active:bg-rose-soft/80"
          >
            Double Down (3x or Bust)
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => { playSound("hint_use"); onHint("card_count"); }}
          disabled={!canAffordHint("card_count") || hintsUsed.includes("card_count") || cardCountRemaining <= 0}
          className="rounded-lg border border-border bg-surface px-2 py-2.5 sm:py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-elevated active:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="block leading-tight">Burn 3</span>
          <span className="block text-ink-muted mt-0.5">-{HINT_COSTS.card_count} chips</span>
        </button>
        <button
          onClick={() => { playSound("hint_use"); onHint("peek"); }}
          disabled={!canAffordHint("peek") || hintsUsed.includes("peek")}
          className="rounded-lg border border-border bg-surface px-2 py-2.5 sm:py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-elevated active:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="block leading-tight">Peek Letter</span>
          <span className="block text-ink-muted mt-0.5">-{HINT_COSTS.peek} chips</span>
        </button>
        <button
          onClick={() => { playSound("hint_use"); onHint("insurance"); }}
          disabled={!canAffordHint("insurance") || hintsUsed.includes("insurance")}
          className="rounded-lg border border-border bg-surface px-2 py-2.5 sm:py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-elevated active:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="block leading-tight">Insurance</span>
          <span className="block text-ink-muted mt-0.5">-{HINT_COSTS.insurance} chips</span>
        </button>
      </div>
    </div>
  );
}
