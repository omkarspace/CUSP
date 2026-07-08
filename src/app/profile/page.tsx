import { Nav } from "@/components/layout/nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserTrophies } from "@/actions/trophies";

const TIER_LABELS: Record<string, string> = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platinum",
  DIAMOND: "Diamond",
  BLACK_CARD: "Black Card",
};

function getCompsLevel(lifetime: number): string {
  if (lifetime >= 100000) return "BLACK_CARD";
  if (lifetime >= 50000) return "DIAMOND";
  if (lifetime >= 20000) return "PLATINUM";
  if (lifetime >= 5000) return "GOLD";
  if (lifetime >= 1000) return "SILVER";
  return "BRONZE";
}

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
  const comps = getCompsLevel(profile.lifetime_chips_earned || 0);

  const winRate = profile.total_games_played > 0
    ? ((profile.total_wins / profile.total_games_played) * 100).toFixed(1)
    : "0.0";

  const stats = [
    { label: "Win Rate", value: `${winRate}%`, color: "text-neon-green" },
    { label: "Games Played", value: profile.total_games_played, color: "text-text-primary" },
    { label: "Total Wins", value: profile.total_wins, color: "text-neon-green" },
    { label: "Bankruptcies", value: profile.total_bankruptcies, color: "text-neon-red" },
    { label: "Hot Streak", value: profile.heat_streak, color: "text-neon-gold" },
    { label: "Peak Bankroll", value: profile.highest_ever_bankroll, color: "text-neon-green" },
    { label: "Login Streak", value: profile.login_streak || 0, color: "text-neon-gold" },
    { label: "Lifetime Earned", value: profile.lifetime_chips_earned || 0, color: "text-neon-green" },
  ];

  return (
    <>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl font-bold text-text-primary">
                {profile.username}
              </h1>
              <span className="rounded-full border border-neon-gold/30 bg-neon-gold/10 px-3 py-0.5 font-heading text-sm text-neon-gold">
                {TIER_LABELS[comps] || "Bronze"}
              </span>
            </div>
            <p className="text-text-secondary">Profile</p>
          </div>
          <div className="text-right">
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Bankroll
            </span>
            <div className="font-heading text-4xl font-bold text-neon-green">
              {profile.bankroll} chips
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-tile-border/30 bg-casino-surface-low p-6"
            >
              <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
                {stat.label}
              </span>
              <div className={`mt-2 font-heading text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {trophies.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-lg font-bold text-text-primary mb-4">
              Trophies ({trophies.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {trophies.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-neon-gold/30 bg-casino-surface-low px-4 py-2"
                >
                  <span className="font-heading text-sm font-bold text-neon-gold">{t.label}</span>
                  <p className="text-xs text-text-muted">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}