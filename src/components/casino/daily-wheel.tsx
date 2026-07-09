"use client";

import { useState } from "react";
import { claimDailyLogin } from "@/actions/profile";

interface DailyWheelProps {
  bankroll: number;
  loginStreak: number;
  todayClaimed: boolean;
}

export function DailyWheel({ bankroll, loginStreak, todayClaimed }: DailyWheelProps) {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClaim() {
    setClaiming(true);
    setError(null);
    try {
      await claimDailyLogin();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to claim");
      setClaiming(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start sm:gap-6">
          <div>
            <span className="font-label text-xs text-ink-muted">Bankroll</span>
            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-semibold tracking-tight text-accent">
              {bankroll.toLocaleString()}
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center sm:text-left">
            <span className="font-label text-xs text-ink-muted">Streak</span>
            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-semibold text-gold">
              {loginStreak}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleClaim}
            disabled={todayClaimed || claiming}
            className="w-full sm:w-auto min-w-[120px] rounded-lg bg-gold-soft px-5 py-3 sm:py-2.5 font-label text-xs text-gold transition-all hover:bg-gold-soft/80 disabled:opacity-40 active:scale-[0.97]"
          >
            {claiming ? "Claiming..." : todayClaimed ? "Claimed" : "Daily Bonus"}
          </button>
          {error && (
            <span className="font-label text-[11px] text-rose">{error}</span>
          )}
        </div>
      </div>
    </div>
  );
}
