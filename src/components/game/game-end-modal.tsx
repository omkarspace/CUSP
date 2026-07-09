"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface GameEndModalProps {
  open: boolean;
  gameMode: string;
  targetWord: string;
  status: "WON" | "BANKRUPT" | "FOLDED";
  finalEscrow: number;
  rowsUsed: number;
  isDoubleDown: boolean;
  hintsUsed: string[];
  entryStake: number;
  insuranceRefund: number;
  hasInsurance: boolean;
}

const MODE_LABELS: Record<string, string> = {
  DAILY: "The Daily Jackpot",
  INFINITE: "The Grind",
  HIGH_ROLLER: "The Penthouse",
};

const MODE_CLASSES: Record<string, string> = {
  WON: "text-emerald",
  BANKRUPT: "text-rose",
  FOLDED: "text-ink-muted",
};

const WIN_ICONS: Record<string, string> = {
  WON: "Trophy",
  BANKRUPT: "Skull",
  FOLDED: "Flag",
};

function ChipCounter({ finalValue, label }: { finalValue: number; label: string }) {
  const [display, setDisplay] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * finalValue));
      if (progress < 1) animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [finalValue]);

  return (
    <div className="text-center">
      <span className="font-label text-xs text-ink-muted">{label}</span>
      <div className="mt-1 font-mono text-3xl font-bold tracking-tight text-accent">
        {display.toLocaleString()}
      </div>
    </div>
  );
}

export function GameEndModal({
  open,
  gameMode,
  targetWord,
  status,
  finalEscrow,
  rowsUsed,
  isDoubleDown,
  hintsUsed,
  entryStake,
  insuranceRefund,
  hasInsurance,
}: GameEndModalProps) {
  const router = useRouter();
  const [showCounter, setShowCounter] = useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowCounter(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowCounter(false);
    }
  }, [open]);

  const isWin = status === "WON";
  const icon = isWin ? (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
      <path d="M8 30V10L20 2L32 10V30L20 38L8 30Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M20 14V22M20 26V28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="10" r="2" fill="currentColor" />
    </svg>
  ) : status === "BANKRUPT" ? (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L24 24M24 16L16 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
      <path d="M8 32V12L20 8L32 12V32L20 36L8 32Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M16 22H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl"
          >
            <div className={`mb-4 flex items-center gap-3 ${MODE_CLASSES[status]}`}>
              {icon}
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  {isWin ? "Winner!" : status === "BANKRUPT" ? "Bankrupt" : "Folded"}
                </h2>
                <p className="text-xs text-ink-muted">{MODE_LABELS[gameMode] || gameMode}</p>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-border bg-canvas p-4 text-center">
              <span className="font-label text-xs text-ink-muted">The word was</span>
              <div className="mt-1 font-mono text-2xl font-bold tracking-wider text-ink">
                {targetWord}
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-surface-elevated p-3 text-center">
                <span className="font-label text-xs text-ink-muted">Rows</span>
                <div className="mt-0.5 font-mono text-lg font-semibold text-ink">
                  {rowsUsed}/6
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface-elevated p-3 text-center">
                <span className="font-label text-xs text-ink-muted">Entry</span>
                <div className="mt-0.5 font-mono text-lg font-semibold text-ink-secondary">
                  {entryStake.toLocaleString()}
                </div>
              </div>
              {isDoubleDown && (
                <div className="rounded-lg border border-gold/30 bg-gold-soft p-3 text-center">
                  <span className="font-label text-xs text-gold">Double Down</span>
                  <div className="mt-0.5 font-mono text-lg font-semibold text-gold">Active</div>
                </div>
              )}
              {hintsUsed.length > 0 && (
                <div className="rounded-lg border border-border bg-surface-elevated p-3 text-center">
                  <span className="font-label text-xs text-ink-muted">Hints</span>
                  <div className="mt-0.5 font-mono text-lg font-semibold text-ink capitalize">
                    {hintsUsed.join(", ")}
                  </div>
                </div>
              )}
              {hasInsurance && status === "BANKRUPT" && (
                <div className="col-span-2 rounded-lg border border-accent/30 bg-accent-soft p-3 text-center">
                  <span className="font-label text-xs text-accent">Insurance Refund</span>
                  <div className="mt-0.5 font-mono text-lg font-semibold text-accent">
                    +{insuranceRefund.toLocaleString()} chips
                  </div>
                </div>
              )}
            </div>

            <div className="mb-5">
              <ChipCounter
                finalValue={isWin ? finalEscrow : insuranceRefund}
                label={isWin ? "Total Payout" : status === "FOLDED" ? "Retained" : "Insurance"}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  router.push(`/lobby?mode=${gameMode}`);
                }}
                className="w-full rounded-lg bg-accent py-3 font-label text-xs text-white transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Play Again
              </button>
              <button
                onClick={() => {
                  router.push("/dashboard");
                }}
                className="w-full rounded-lg border border-border py-3 font-label text-xs text-ink-secondary transition-all hover:bg-border active:scale-[0.98]"
              >
                Back to Hub
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
