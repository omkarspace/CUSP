import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStakeLimits, getBaseEntryForMode } from "@/lib/game/engine";
import { LobbyClient } from "@/components/lobby/lobby-client";
import { Nav } from "@/components/layout/nav";
import type { GameMode } from "@/lib/types";

const MODE_INFO: Record<string, { title: string; desc: string; requiredBankroll: number; requiredStreak: number }> = {
  DAILY: { title: "The Daily Jackpot", desc: "Once per day. Posts to The Board.", requiredBankroll: 0, requiredStreak: 0 },
  INFINITE: { title: "The Grind", desc: "Endless mode — starts easy, gets harder each round.", requiredBankroll: 0, requiredStreak: 0 },
  HIGH_ROLLER: { title: "The Penthouse", desc: "Hard words, 2x payouts. The big leagues.", requiredBankroll: 5000, requiredStreak: 3 },
};

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betting Lobby",
  robots: { index: false, follow: false },
};

export default async function LobbyPage(props: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await props.searchParams;
  if (!mode || !["DAILY", "INFINITE", "HIGH_ROLLER"].includes(mode)) redirect("/dashboard");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const gameMode = mode as GameMode;
  const info = MODE_INFO[gameMode];
  const limits = getStakeLimits(gameMode);
  const baseEntry = getBaseEntryForMode(gameMode);

  return (
    <>
      <Nav userEmail={user.email} />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8 pb-nav">
        <LobbyClient
          gameMode={gameMode}
          title={info.title}
          desc={info.desc}
          bankroll={profile.bankroll}
          heatStreak={profile.heat_streak}
          requiredBankroll={info.requiredBankroll}
          requiredStreak={info.requiredStreak}
          minStake={limits.min}
          maxStake={limits.max}
          baseEntry={baseEntry}
          defaultStake={baseEntry}
        />
      </main>
    </>
  );
}
