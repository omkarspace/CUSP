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
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-lg sm:text-xl font-semibold text-ink">
                  Welcome, {profile.username}
                </h1>
                <span className="rounded-full border border-gold/30 bg-gold-soft px-3 py-0.5 font-label text-[11px] text-gold">
                  {TIER_NAMES[compsLevel] || "Bronze"}
                </span>
              </div>
              <p className="text-sm text-ink-secondary">
                Hot Streak: <span className="font-semibold text-gold">{profile.heat_streak}</span>
                {profile.heat_streak >= 3 && (
                  <span className="ml-1 text-ink-muted">
                    ({profile.heat_streak >= 10 ? "2.0x" : profile.heat_streak >= 5 ? "1.5x" : "1.2x"})
                  </span>
                )}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-label text-xs text-ink-muted">Bankroll</span>
              <div className="font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-accent">
                {profile.bankroll.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <DailyWheel
            bankroll={profile.bankroll}
            loginStreak={profile.login_streak || 0}
            todayClaimed={todayClaimed}
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg font-semibold text-ink">Choose Your Game</h2>
          <div className="mt-3 sm:mt-4">
            <ModeSelector bankroll={profile.bankroll} heatStreak={profile.heat_streak} />
          </div>
        </div>
      </main>
    </>
  );
}
