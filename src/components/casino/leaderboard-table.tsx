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
    <div className="overflow-hidden rounded-xl border border-tile-border/30 bg-casino-surface-low">
      <table className="w-full">
        <thead>
          <tr className="border-b border-tile-border/30 text-left">
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Rank
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Player
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Weekly
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Hot Streak
            </th>
            <th className="px-6 py-3 font-heading text-xs uppercase tracking-widest text-text-muted">
              Wins
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.rank}
              className={`border-b border-tile-border/10 transition-colors hover:bg-casino-surface-high ${
                entry.rank <= 3 ? "bg-casino-surface-high/50" : ""
              }`}
            >
              <td className="px-6 py-4">
                <span
                  className={`font-heading text-lg font-bold ${
                    entry.rank === 1
                      ? "text-neon-gold"
                      : entry.rank === 2
                      ? "text-text-secondary"
                      : entry.rank === 3
                      ? "text-orange-400"
                      : "text-text-muted"
                  }`}
                >
                  {entry.rank === 1 ? "👑" : `#${entry.rank}`}
                </span>
              </td>
              <td className="px-6 py-4 font-heading font-bold text-text-primary">
                {entry.username}
              </td>
              <td className="px-6 py-4 font-heading text-neon-green font-bold">
                {entry.weeklyChips.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <span className="font-heading text-neon-gold">{entry.heatStreak}</span>
                {entry.heatStreak >= 3 && (
                  <span className="ml-1 text-xs text-neon-green">
                    ({entry.heatStreak >= 10 ? "2x" : entry.heatStreak >= 5 ? "1.5x" : "1.2x"})
                  </span>
                )}
              </td>
              <td className="px-6 py-4 font-heading text-neon-green">{entry.totalWins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}