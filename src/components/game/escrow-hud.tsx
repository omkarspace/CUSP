"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { playSound } from "@/lib/sounds";

interface EscrowHudProps {
  currentChips: number;
  row: number;
  isDoubleDown: boolean;
}

export function EscrowHud({ currentChips, row, isDoubleDown }: EscrowHudProps) {
  const prevChips = useRef(currentChips);
  const [delta, setDelta] = useState<number | null>(null);

  useEffect(() => {
    if (currentChips !== prevChips.current) {
      setDelta(currentChips - prevChips.current);
      prevChips.current = currentChips;
      playSound("chip_clink");
      const timer = setTimeout(() => setDelta(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentChips]);

  const isIncrease = delta !== null && delta > 0;

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 sm:px-6 py-3">
      <div className="flex items-center gap-3 sm:gap-4">
        <div>
          <span className="font-label text-xs text-ink-muted">Escrow</span>
          <div className="relative">
            <motion.div
              key={currentChips}
              initial={{ scale: 1.3, color: "var(--accent)" }}
              animate={{ scale: 1, color: "var(--accent)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="font-mono text-lg sm:text-2xl font-semibold tracking-tight"
            >
              {currentChips} chips
            </motion.div>
            <AnimatePresence>
              {delta !== null && (
                <motion.span
                  key={delta}
                  initial={{ opacity: 1, x: isIncrease ? 10 : -10 }}
                  animate={{ opacity: 0, x: isIncrease ? 40 : -40, y: -32 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`absolute -top-1 right-0 font-mono text-xs sm:text-sm font-semibold tabular-nums ${isIncrease ? "text-accent" : "text-rose"}`}
                >
                  {isIncrease ? "+" : ""}{delta}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <span className="font-label text-xs text-ink-muted">Row</span>
          <div className="font-mono text-lg sm:text-2xl font-semibold tabular-nums text-ink">
            {row}/6
          </div>
        </div>
      </div>
      {isDoubleDown && (
        <div className="rounded-lg border border-rose/50 bg-rose-soft px-2 sm:px-3 py-1 font-label text-[10px] sm:text-xs text-rose whitespace-nowrap">
          DOUBLE DOWN
        </div>
      )}
    </div>
  );
}
