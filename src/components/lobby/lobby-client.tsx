"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { initGame } from "@/actions/game";
import { getScaledPayoutTable } from "@/lib/types";
import type { GameMode } from "@/lib/types";

interface LobbyClientProps {
  gameMode: GameMode;
  title: string;
  desc: string;
  bankroll: number;
  heatStreak: number;
  requiredBankroll: number;
  requiredStreak: number;
  minStake: number;
  maxStake: number;
  baseEntry: number;
  defaultStake: number;
}

export function LobbyClient({
  gameMode,
  title,
  desc,
  bankroll,
  heatStreak,
  requiredBankroll,
  requiredStreak,
  minStake,
  maxStake,
  baseEntry,
  defaultStake,
}: LobbyClientProps) {
  const router = useRouter();
  const [stake, setStake] = useState(defaultStake);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scale = stake / baseEntry;

  const payoutRows = useMemo(() => getScaledPayoutTable(scale, heatStreak), [scale, heatStreak]);

  const canPlay =
    bankroll >= requiredBankroll &&
    heatStreak >= requiredStreak &&
    bankroll >= stake;

  const requirements: string[] = [];
  if (requiredBankroll > 0 && bankroll < requiredBankroll) {
    requirements.push(`Need ${requiredBankroll.toLocaleString()} chips (have ${bankroll.toLocaleString()})`);
  }
  if (requiredStreak > 0 && heatStreak < requiredStreak) {
    requirements.push(`Need ${requiredStreak}-win streak (have ${heatStreak})`);
  }
  if (bankroll < stake) {
    requirements.push(`Insufficient chips for this stake`);
  }

  async function handleStart() {
    setLoading(true);
    setError(null);
    try {
      const result = await initGame(gameMode, stake);
      router.push(`/play/${result.gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start game");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink">{title}</h1>
            <p className="mt-1 text-sm text-ink-secondary">{desc}</p>
          </div>
          <div className="text-right">
            <span className="font-label text-xs text-ink-muted">Bankroll</span>
            <div className="font-mono text-lg font-semibold tracking-tight text-accent">
              {bankroll.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-label text-xs text-ink-muted">Entry Stake</span>
          <span className="font-mono text-lg font-semibold text-accent">{stake.toLocaleString()} chips</span>
        </div>
        <input
          type="range"
          min={minStake}
          max={maxStake}
          step={10}
          value={stake}
          onChange={(e) => setStake(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f59e0b ${((stake - minStake) / (maxStake - minStake)) * 100}%, #2a2a3e ${((stake - minStake) / (maxStake - minStake)) * 100}%)`,
          }}
          disabled={loading}
        />
        <div className="flex justify-between mt-1">
          <span className="font-label text-[11px] text-ink-muted">{minStake}</span>
          <span className="font-label text-[11px] text-ink-muted">{maxStake}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink mb-3">Payout Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-label text-xs text-ink-muted pb-2 pr-4">Row</th>
                <th className="text-left font-label text-xs text-ink-muted pb-2 pr-4">Guess Cost</th>
                <th className="text-left font-label text-xs text-ink-muted pb-2">Win Payout</th>
              </tr>
            </thead>
            <tbody>
              {payoutRows.map((r) => (
                <tr key={r.row} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-ink font-medium">{r.row}</td>
                  <td className="py-2 pr-4 font-mono text-ink-secondary">-{r.cost.toLocaleString()}</td>
                  <td className="py-2 font-mono text-emerald">+{r.payout.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {error && (
          <div className="rounded-lg bg-rose-soft px-4 py-2.5">
            <p className="font-label text-xs text-rose">{error}</p>
          </div>
        )}

        {requirements.length > 0 && (
          <div className="rounded-lg bg-amber-soft px-4 py-2.5 space-y-1">
            {requirements.map((r, i) => (
              <p key={i} className="font-label text-xs text-amber">{r}</p>
            ))}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!canPlay || loading}
          className="w-full rounded-lg bg-accent py-3.5 font-label text-xs text-white transition-all hover:opacity-90 disabled:opacity-40 active:scale-[0.98]"
        >
          {loading ? "Starting..." : `Start Game — ${stake.toLocaleString()} chips`}
        </button>
      </div>
    </div>
  );
}
