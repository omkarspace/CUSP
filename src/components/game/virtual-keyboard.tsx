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
  correct: "bg-tile-correct border-tile-correct text-tile-correct-text",
  present: "bg-tile-present border-tile-present text-tile-present-text",
  absent: "bg-tile-absent border-tile-absent text-tile-absent-text opacity-40 pointer-events-none",
  empty: "bg-surface-elevated border-border text-ink hover:bg-surface-hover active:bg-surface-hover",
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
    <div className="w-full max-w-[500px] flex flex-col items-center gap-1 sm:gap-1.5">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex w-full gap-[3px] sm:gap-1.5">
          {row.map((key) => {
            const state = keyboardState[key] || "empty";
            const isAction = key === "ENTER" || key === "\u232B";

            return (
              <button
                key={key}
                onClick={() => handleKey(key)}
                disabled={disabled || state === "absent"}
                className={`
                  flex items-center justify-center rounded-md border font-label text-xs
                  transition-colors duration-150
                  h-11 sm:h-14
                  ${isAction ? "flex-[1.5]" : "flex-1 min-w-0"}
                  ${stateStyles[state]}
                  ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95 touch-manipulation"}
                `}
              >
                <span className="truncate">
                  {key === "\u232B" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  ) : (
                    key
                  )}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
