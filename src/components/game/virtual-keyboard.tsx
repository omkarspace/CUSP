"use client";

import type { TileState } from "@/lib/types";
import { playSound } from "@/lib/sounds";

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
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "\u232B"],
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
    if (key === "ENTER") {
      playSound("key_enter");
      onEnter();
    } else if (key === "\u232B") {
      onDelete();
    } else {
      playSound("key_press");
      onKeyPress(key);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1.5">
          {row.map((key) => {
            const state = keyboardState[key] || "empty";
            const isWide = key === "ENTER" || key === "\u232B";

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
