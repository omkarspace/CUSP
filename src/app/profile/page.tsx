import { Nav } from "@/components/layout/nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserTrophies } from "@/actions/trophies";
import { UsernameEditor } from "@/components/profile/username-editor";
import { getGameHistory } from "@/actions/game-history";
import { GameHistory } from "@/components/profile/game-history";

function getCompsLevel(lifetime: number): string {
  if (lifetime >= 100000) return "BLACK_CARD";
  if (lifetime >= 50000) return "DIAMOND";
  if (lifetime >= 20000) return "PLATINUM";
  if (lifetime >= 5000) return "GOLD";
  if (lifetime >= 1000) return "SILVER";
  return "BRONZE";
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const trophies = await getUserTrophies(user.id);
  const gameHistory = await getGameHistory();
  const comps = getCompsLevel(profile.lifetime_chips_earned || 0);

  const winRate = profile.total_games_played > 0
    ? ((profile.total_wins / profile.total_games_played) * 100).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Win Rate", value: `${winRate}%` },
    { label: "Games Played", value: profile.total_games_played },
    { label: "Total Wins", value: profile.total_wins },
    { label: "Bankruptcies", value: profile.total_bankruptcies },
    { label: "Hot Streak", value: profile.heat_streak },
    { label: "Peak Bankroll", value: profile.highest_ever_bankroll },
    { label: "Login Streak", value: profile.login_streak || 0 },
    { label: "Lifetime Earned", value: profile.lifetime_chips_earned || 0 },
  ];

  const TIER_LABELS: Record<string, string> = {
    BRONZE: "Bronze", SILVER: "Silver", GOLD: "Gold",
    PLATINUM: "Platinum", DIAMOND: "Diamond", BLACK_CARD: "Black Card",
  };

  return (
    <>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 pb-nav">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <UsernameEditor initial={profile.username} />
              <span className="rounded-full border border-gold/30 bg-gold-soft px-3 py-0.5 font-label text-[11px] text-gold">
                {TIER_LABELS[comps] || "Bronze"}
              </span>
            </div>
            <p className="text-sm text-ink-secondary">Profile</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-label text-xs text-ink-muted">Bankroll</span>
            <div className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-accent">
              {profile.bankroll.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface p-4 sm:p-6"
            >
              <span className="font-label text-xs text-ink-muted">{stat.label}</span>
              <div className={`mt-1 sm:mt-2 font-mono text-xl sm:text-3xl font-semibold tracking-tight truncate ${
                stat.label === "Hot Streak" || stat.label === "Login Streak" ? "text-gold"
                : stat.label === "Bankruptcies" ? "text-rose"
                : "text-accent"
              }`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {trophies.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-ink mb-4">
              Trophies ({trophies.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {trophies.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-gold/30 bg-gold-soft px-4 py-2"
                >
                  <span className="text-sm font-semibold text-gold">{t.label}</span>
                  <p className="text-xs text-ink-muted">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-ink mb-4">
            Game History ({gameHistory.length})
          </h2>
          <GameHistory games={gameHistory} />
        </div>
      </main>
    </>
  );
}
