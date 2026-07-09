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
  compact?: boolean;
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
  compact = false,
}: ActionDeckProps) {
  const showDoubleDown = row === 4 && !isDoubleDown;
  const canAffordHint = (hint: HintType) => currentChips >= HINT_COSTS[hint];

  const btnBase = compact
    ? "w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-[11px] font-medium text-ink-secondary transition-colors hover:bg-surface-elevated active:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed text-left"
    : "rounded-lg border border-border bg-surface px-2 py-2.5 sm:py-2 text-xs font-medium text-ink-secondary transition-colors hover:bg-surface-elevated active:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed";

  const hintBtn = (hint: HintType, label: string) => (
    <button
      onClick={() => { playSound("hint_use"); onHint(hint); }}
      disabled={!canAffordHint(hint) || hintsUsed.includes(hint) || (hint === "card_count" && cardCountRemaining <= 0)}
      className={btnBase}
    >
      <span className={compact ? "block text-ink-secondary" : "block leading-tight"}>{label}</span>
      <span className="block text-ink-muted mt-0.5">-{HINT_COSTS[hint]} chips</span>
    </button>
  );

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {showDoubleDown && (
          <>
            <button
              onClick={onFold}
              className="w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-[11px] font-medium text-ink-secondary transition-colors hover:bg-surface-elevated active:bg-surface-elevated"
            >
              Fold
            </button>
            <button
              onClick={onDoubleDown}
              className="w-full rounded-lg border border-rose/50 bg-rose-soft px-2.5 py-2 text-[11px] font-medium text-rose transition-colors hover:bg-rose-soft/80 active:bg-rose-soft/80"
            >
              Double Down
            </button>
          </>
        )}
        <div className="border-t border-border pt-2 mt-1">
          <p className="font-label text-[10px] text-ink-muted mb-2">Hints</p>
          <div className="flex flex-col gap-1.5">
            {hintBtn("card_count", "Burn 3")}
            {hintBtn("peek", "Peek")}
            {hintBtn("insurance", "Insurance")}
          </div>
        </div>
      </div>
    );
  }

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
        {hintBtn("card_count", "Burn 3")}
        {hintBtn("peek", "Peek Letter")}
        {hintBtn("insurance", "Insurance")}
      </div>
    </div>
  );
}
