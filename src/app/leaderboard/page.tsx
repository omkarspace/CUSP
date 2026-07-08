import { Nav } from "@/components/layout/nav";
import { createClient } from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/casino/leaderboard-table";
import { ShareCard } from "@/components/casino/share-card";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: topPlayers } = await supabase
    .from("profiles")
    .select("id, username, heat_streak, highest_ever_bankroll, total_wins, weekly_chips_earned")
    .order("weekly_chips_earned", { ascending: false })
    .limit(100);

  const entries = (topPlayers || []).map((p, i) => ({
    rank: i + 1,
    username: p.username,
    heatStreak: p.heat_streak,
    highestEverBankroll: p.highest_ever_bankroll,
    totalWins: p.total_wins,
    weeklyChips: p.weekly_chips_earned || 0,
  }));

  const currentUserEntry = (topPlayers || []).find((p) => p.id === user?.id);
  const userRank = currentUserEntry
    ? (topPlayers || []).findIndex((p) => p.id === user?.id) + 1
    : 0;
  const userStreak = currentUserEntry?.heat_streak ?? 0;
  const userPeak = currentUserEntry?.highest_ever_bankroll ?? 0;

  return (
    <>
      <Nav userEmail={user?.email} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-ink">The Board</h1>
            <p className="text-sm text-ink-secondary">Weekly leaderboard — resets Monday</p>
          </div>
        </div>
        <LeaderboardTable entries={entries} currentUserId={user?.id} />
        <div className="mt-6 sm:mt-8">
          <ShareCard
            username={user?.email?.split("@")[0] || "Player"}
            rank={userRank}
            streak={userStreak}
            peak={userPeak}
          />
        </div>
      </main>
    </>
  );
}
