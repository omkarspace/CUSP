"use client";

interface LeaderboardEntry {
  rank: number;
  username: string;
  heatStreak: number;
  highestEverBankroll: number;
  totalWins: number;
  weeklyChips: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 sm:px-6 py-3 font-label text-xs text-ink-muted">Rank</th>
            <th className="px-4 sm:px-6 py-3 font-label text-xs text-ink-muted">Player</th>
            <th className="px-4 sm:px-6 py-3 font-label text-xs text-ink-muted">Weekly</th>
            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 font-label text-xs text-ink-muted">Hot Streak</th>
            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 font-label text-xs text-ink-muted">Wins</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.rank}
              className={`border-b border-border/50 transition-colors hover:bg-surface-elevated ${
                entry.rank <= 3 ? "bg-surface-elevated" : ""
              }`}
            >
              <td className="px-4 sm:px-6 py-3 sm:py-4">
                <span
                  className={`font-mono text-base sm:text-lg font-semibold tabular-nums ${
                    entry.rank === 1
                      ? "text-gold"
                      : entry.rank === 2 || entry.rank === 3
                      ? "text-ink-secondary"
                      : "text-ink-muted"
                  }`}
                >
                  #{entry.rank}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4">
                <div>
                  <span className="font-medium text-sm sm:text-base text-ink">{entry.username}</span>
                  {entry.heatStreak >= 3 && (
                    <span className="ml-1.5 font-label text-[10px] text-gold">
                      {entry.heatStreak >= 10 ? "2x" : entry.heatStreak >= 5 ? "1.5x" : "1.2x"}
                    </span>
                  )}
                </div>
                <div className="sm:hidden mt-1 flex gap-3 text-xs text-ink-muted">
                  <span>Streak: <span className="font-mono text-gold">{entry.heatStreak}</span></span>
                  <span>Wins: <span className="font-mono text-accent">{entry.totalWins}</span></span>
                </div>
              </td>
              <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-sm sm:text-base tabular-nums text-accent">
                {entry.weeklyChips.toLocaleString()}
              </td>
              <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4">
                <span className="font-mono tabular-nums text-gold">{entry.heatStreak}</span>
              </td>
              <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 font-mono tabular-nums text-accent">{entry.totalWins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
