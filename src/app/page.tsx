import { Nav } from "@/components/layout/nav";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const howToPlay = [
  {
    step: "1",
    title: "Place Your Ante",
    desc: "Choose The Daily Jackpot (10 chips), The Grind (50 chips), or The Penthouse (5,000+ required).",
  },
  {
    step: "2",
    title: "Manage Chips",
    desc: "Row 1 wins big (+200), but later rows cost more and pay less. Know when to hold.",
  },
  {
    step: "3",
    title: "Double Down or Fold",
    desc: "At Row 4, risk it all for 3x payout \u2014 or fold to preserve your bankroll.",
  },
];

export default async function LobbyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Nav userEmail={user?.email} />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h1 className="font-heading text-6xl font-extrabold tracking-tight text-neon-green drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            CUSP
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            On the edge of a win
          </p>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="mt-8 inline-block rounded-xl bg-neon-green px-8 py-4 font-heading text-lg font-bold text-casino-bg shadow-neon-green transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            {user ? "Enter the Lobby" : "Login to Play"}
          </Link>
        </div>

        <div className="mt-16 rounded-xl border border-tile-border/30 bg-casino-surface-low p-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-heading text-xs uppercase tracking-widest text-text-muted">
              Live Wins
            </span>
          </div>
          <div className="mt-3 overflow-hidden">
            <div className="flex gap-8 text-sm text-text-secondary">
              <span><strong className="text-neon-gold">Player1</strong> won <strong className="text-neon-green">+200</strong> chips on Row 1</span>
              <span><strong className="text-neon-gold">HighRoller</strong> doubled down and won <strong className="text-neon-green">+600</strong> chips!</span>
              <span><strong className="text-neon-gold">StreakKing</strong> on a <strong className="text-neon-gold">5-win Hot Streak</strong> (1.5x multiplier)</span>
              <span><strong className="text-neon-gold">LuckyGuess</strong> won <strong className="text-neon-green">+150</strong> chips on Row 2</span>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-text-primary text-center mb-8">
            How to Play
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {howToPlay.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-tile-border/30 bg-casino-surface-low p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/20 font-heading text-lg font-bold text-neon-green">
                  {item.step}
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
