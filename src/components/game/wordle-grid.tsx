"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { TileState } from "@/lib/types";
import { playSound } from "@/lib/sounds";

interface WordleGridProps {
  boardGrid: string[][];
  tileStates: TileState[][];
  currentRow: number;
  currentCol: number;
  isRevealing: boolean;
  shakeRow: boolean;
}

const stateStyles: Record<TileState, string> = {
  correct: "bg-tile-correct border-tile-correct text-tile-correct-text",
  present: "bg-tile-present border-tile-present text-tile-present-text",
  absent: "bg-tile-absent border-tile-absent text-tile-absent-text",
  empty: "bg-transparent border-tile-border text-ink",
};

export function WordleGrid({
  boardGrid,
  tileStates,
  currentRow,
  currentCol,
  isRevealing,
  shakeRow,
}: WordleGridProps) {
  const [landedTiles, setLandedTiles] = useState<Set<string>>(new Set());

  const handleFlipComplete = (tileKey: string, state: TileState, colIdx: number) => {
    setLandedTiles((prev) => new Set(prev).add(tileKey));
    if (colIdx === 4) {
      if (state === "correct") playSound("tile_correct");
      else if (state === "present") playSound("tile_present");
      else if (state === "absent") playSound("tile_absent");
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      {boardGrid.map((row, rowIdx) => (
        <motion.div
          key={rowIdx}
          className="flex gap-1 sm:gap-1.5"
          animate={
            rowIdx === currentRow && shakeRow
              ? { x: [0, -4, 4, -4, 4, -4, 4, 0] }
              : { x: 0 }
          }
          transition={{ duration: 0.5 }}
        >
          {row.map((letter, colIdx) => {
            const state = tileStates[rowIdx][colIdx];
            const isCurrentRow = rowIdx === currentRow;
            const isActive = isCurrentRow && colIdx === currentCol - 1;
            const isRevealed = rowIdx < currentRow || (isRevealing && rowIdx === currentRow);
            const showFlip = isRevealed && state !== "empty";
            const tileKey = `${rowIdx}-${colIdx}`;
            const hasLanded = landedTiles.has(tileKey);

            return (
              <AnimatePresence key={colIdx}>
                <motion.div
                  key={`${colIdx}-${showFlip ? "revealed" : "hidden"}`}
                  className={`
                    flex items-center justify-center
                    rounded-md border-2 font-semibold
                    h-12 w-12 sm:h-14 sm:w-14
                    text-base sm:text-lg
                    ${stateStyles[state]}
                    ${isActive ? "scale-105 border-accent" : ""}
                  `}
                  initial={showFlip ? { rotateX: 0 } : undefined}
                  animate={showFlip ? { rotateX: [0, 90, 0] } : undefined}
                  transition={
                    showFlip
                      ? { duration: 0.4, delay: colIdx * 0.1 }
                      : undefined
                  }
                  onAnimationComplete={() => {
                    if (showFlip) handleFlipComplete(tileKey, state, colIdx);
                  }}
                  layout
                  style={{ perspective: "1000px" }}
                >
                  {letter}
                </motion.div>
              </AnimatePresence>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
}
