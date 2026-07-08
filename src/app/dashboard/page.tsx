import { Nav } from "@/components/layout/nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ModeSelector } from "@/components/casino/mode-selector";
import { DailyWheel } from "@/components/casino/daily-wheel";

const TIER_NAMES: Record<string, string> = {
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

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const today = new Date().toISOString().split("T")[0];
  const todayClaimed = profile.last_login_date === today;
  const compsLevel = getCompsLevel(profile.lifetime_chips_earned || 0);

  return (
    <>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between rounded-xl border border-tile-border/30 bg-casino-surface-low px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-xl font-bold text-text-primary">
                Welcome, {profile.username}
              </h1>
              <span className="rounded-full border border-neon-gold/30 bg-neon-gold/10 px-3 py-0.5 font-heading text-xs text-neon-gold">
                {TIER_NAMES[compsLevel] || "Bronze"}
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              Hot Streak: <span className="text-neon-gold font-bold">{profile.heat_streak}</span>
              {profile.heat_streak >= 3 && (
                <span className="ml-2 text-neon-green">
                  ({profile.heat_streak >= 10 ? "2.0x" : profile.heat_streak >= 5 ? "1.5x" : "1.2x"} multiplier)
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Bankroll
            </span>
            <div className="font-heading text-3xl font-bold text-neon-green">
              {profile.bankroll} chips
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DailyWheel
            bankroll={profile.bankroll}
            loginStreak={profile.login_streak || 0}
            todayClaimed={todayClaimed}
          />
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-lg font-bold text-text-primary mb-4">
            Choose Your Game
          </h2>
          <ModeSelector bankroll={profile.bankroll} heatStreak={profile.heat_streak} />
        </div>
      </main>
    </>
  );
}