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
    <div className="flex items-center justify-between rounded-xl border border-tile-border/30 bg-casino-surface-low px-6 py-3">
      <div className="flex items-center gap-4">
        <div>
          <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
            Escrow
          </span>
          <div className="relative">
            <motion.div
              key={currentChips}
              initial={{ scale: 1.3, color: "#FBBF24" }}
              animate={{ scale: 1, color: "#E8F5E9" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="font-heading text-2xl font-bold"
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
                  className={`absolute -top-1 right-0 font-heading text-sm font-bold tabular-nums ${isIncrease ? "text-neon-green" : "text-neon-red"}`}
                >
                  {isIncrease ? "+" : ""}{delta}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="h-8 w-px bg-tile-border" />
        <div>
          <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
            Row
          </span>
          <div className="font-heading text-2xl font-bold text-text-primary">
            {row}/6
          </div>
        </div>
      </div>
      {isDoubleDown && (
        <div className="rounded-lg border border-neon-red bg-neon-red/20 px-3 py-1 text-sm font-bold text-neon-red animate-pulse-glow">
          DOUBLE DOWN ACTIVE
        </div>
      )}
    </div>
  );
}
