"use client";

import type { GameHistoryItem } from "@/actions/game-history";

interface GameHistoryProps {
  games: GameHistoryItem[];
}

const MODE_LABELS: Record<string, string> = {
  DAILY: "Daily",
  INFINITE: "Infinite",
  HIGH_ROLLER: "Penthouse",
};

export function GameHistory({ games }: GameHistoryProps) {
  if (games.length === 0) {
    return (
      <p className="text-sm text-ink-muted">No completed games yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left font-label text-xs text-ink-muted pb-2 pr-4">Mode</th>
            <th className="text-left font-label text-xs text-ink-muted pb-2 pr-4">Result</th>
            <th className="text-left font-label text-xs text-ink-muted pb-2 pr-4">Payout</th>
            <th className="text-left font-label text-xs text-ink-muted pb-2 pr-4">Rows</th>
            <th className="text-left font-label text-xs text-ink-muted pb-2 pr-4">Hints</th>
            <th className="text-left font-label text-xs text-ink-muted pb-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g.id} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-medium text-ink">
                {MODE_LABELS[g.gameMode] || g.gameMode}
              </td>
              <td className="py-2.5 pr-4">
                <span className={`font-label text-[11px] ${g.status === "WON" ? "text-emerald" : "text-rose"}`}>
                  {g.status === "WON" ? "Win" : "Bust"}
                </span>
              </td>
              <td className="py-2.5 pr-4 font-mono text-accent">
                +{g.finalEscrow.toLocaleString()}
              </td>
              <td className="py-2.5 pr-4 text-ink-secondary">
                {g.rowsUsed}/6
              </td>
              <td className="py-2.5 pr-4 text-ink-muted">
                {g.hintsUsed.length > 0 ? g.hintsUsed.join(", ") : "—"}
              </td>
              <td className="py-2.5 text-ink-muted whitespace-nowrap">
                {new Date(g.playedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
