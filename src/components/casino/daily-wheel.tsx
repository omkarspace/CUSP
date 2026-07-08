"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { playSound } from "@/lib/sounds";

interface DailyWheelProps {
  bankroll: number;
  loginStreak: number;
  todayClaimed: boolean;
}

const STREAK_BONUSES: { min: number; bonus: string }[] = [
  { min: 7, bonus: "100 chips" },
  { min: 6, bonus: "75 chips" },
  { min: 5, bonus: "50 chips" },
  { min: 4, bonus: "35 chips" },
  { min: 3, bonus: "25 chips" },
  { min: 2, bonus: "15 chips" },
  { min: 1, bonus: "10 chips" },
];

export function DailyWheel({ bankroll, loginStreak, todayClaimed }: DailyWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [claimed, setClaimed] = useState(todayClaimed);
  const [result, setResult] = useState<{ bonus: number; streak: number } | null>(null);
  const rotationRef = useRef(0);

  if (todayClaimed) return null;

  const handleClaim = async () => {
    rotationRef.current = 720 + Math.random() * 720;
    setSpinning(true);
    try {
      const { claimDailyLogin } = await import("@/actions/profile");
      const res = await claimDailyLogin();
      setResult(res);
      setClaimed(true);
      playSound("chip_clink");
    } catch {
      setSpinning(false);
    } finally {
      setSpinning(false);
    }
  };

  const nextBonus = claimed ? 0 : STREAK_BONUSES.find((b) => loginStreak < b.min)?.min ?? 7;

  return (
    <div className="rounded-xl border border-neon-gold/30 bg-casino-surface-low p-6 text-center">
      {!claimed ? (
        <>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Daily Comp
            </span>
            <span className="rounded-full bg-neon-gold/20 px-2 py-0.5 font-heading text-xs text-neon-gold">
              Day {loginStreak}
            </span>
          </div>
          <motion.div
            className="font-heading text-4xl"
            animate={spinning ? { rotate: rotationRef.current } : { rotate: 0 }}
            transition={spinning ? { duration: 2, ease: "easeOut" } : {}}
          >
            🎰
          </motion.div>
          <div className="mt-3 space-y-1">
            <p className="text-sm text-text-secondary">Claim your Daily Comp!</p>
            <div className="flex justify-center gap-2 text-xs text-text-muted">
              {STREAK_BONUSES.map((b) => (
                <span
                  key={b.min}
                  className={`rounded px-1.5 py-0.5 ${
                    loginStreak + 1 === b.min || (loginStreak === 0 && b.min === 1)
                      ? "bg-neon-gold/20 text-neon-gold font-bold"
                      : ""
                  }`}
                >
                  {b.min === 7 ? "7+" : b.min}d: {b.bonus}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleClaim}
            disabled={spinning}
            className="mt-4 rounded-lg bg-neon-gold px-6 py-2 font-heading text-sm font-bold text-casino-bg transition-all hover:scale-105 disabled:opacity-50"
          >
            {spinning ? "Claiming..." : "Claim Daily Comp"}
          </button>
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="space-y-2"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-2xl font-bold text-green-400">
              +{result?.bonus ?? 0}
            </div>
            <h3 className="font-heading text-lg font-bold text-neon-gold">
              Daily Comp Claimed
            </h3>
            <p className="text-sm text-text-secondary">
              Day {result?.streak ?? loginStreak} streak — +{result?.bonus ?? 0} chips!
            </p>
            {(result?.streak ?? loginStreak) >= 7 && (
              <p className="text-xs text-neon-green">🔥 Max streak bonus!</p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}