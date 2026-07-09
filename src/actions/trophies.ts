"use server";

import { createClient } from "@/lib/supabase/server";

const ALL_TROPHIES = [
  { id: "first_win", label: "First Win", desc: "Win your first game" },
  { id: "unstoppable", label: "Unstoppable", desc: "Reach a 10-win Hot Streak" },
  { id: "high_roller", label: "High Roller", desc: "Reach Platinum tier (20K lifetime chips)" },
  { id: "whale", label: "Whale", desc: "Reach Black Card (100K lifetime chips)" },
  { id: "grinder", label: "The Grinder", desc: "Play 100 games" },
  { id: "lucky_guess", label: "Lucky Guess", desc: "Win on Row 1" },
  { id: "loyal_patron", label: "Loyal Patron", desc: "Reach a 7-day login streak" },
  { id: "board_king", label: "Board King", desc: "Top the weekly leaderboard" },
] as const;

export type TrophyId = (typeof ALL_TROPHIES)[number]["id"];

export async function checkTrophiesAfterGame(gameResult: {
  won: boolean;
  row?: number;
  hotStreak: number;
  totalWins: number;
  totalGames: number;
  lifetimeChips: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("trophies")
    .select("trophy_id")
    .eq("user_id", user.id);

  const earned = new Set(existing?.map((t) => t.trophy_id) || []);

  const toInsert: string[] = [];

  if (!earned.has("first_win") && gameResult.won && gameResult.totalWins >= 1) {
    toInsert.push("first_win");
  }
  if (!earned.has("unstoppable") && gameResult.hotStreak >= 10) {
    toInsert.push("unstoppable");
  }
  if (!earned.has("high_roller") && gameResult.lifetimeChips >= 20000) {
    toInsert.push("high_roller");
  }
  if (!earned.has("whale") && gameResult.lifetimeChips >= 100000) {
    toInsert.push("whale");
  }
  if (!earned.has("grinder") && gameResult.totalGames >= 100) {
    toInsert.push("grinder");
  }
  if (!earned.has("lucky_guess") && gameResult.won && gameResult.row === 1) {
    toInsert.push("lucky_guess");
  }

  if (toInsert.length > 0) {
    await supabase.from("trophies").insert(
      toInsert.map((trophyId) => ({ user_id: user.id, trophy_id: trophyId }))
    );
  }
}

export async function checkLoginTrophy(loginStreak: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (loginStreak >= 7) {
    const { data: existing } = await supabase
      .from("trophies")
      .select("trophy_id")
      .eq("user_id", user.id)
      .eq("trophy_id", "loyal_patron");

    if (!existing?.length) {
      await supabase.from("trophies").insert({ user_id: user.id, trophy_id: "loyal_patron" });
    }
  }
}

export async function getUserTrophies(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trophies")
    .select("trophy_id, earned_at")
    .eq("user_id", userId);

  return (data || []).map((t) => {
    const meta = ALL_TROPHIES.find((a) => a.id === t.trophy_id);
    return { id: t.trophy_id, label: meta?.label || t.trophy_id, desc: meta?.desc || "", earnedAt: t.earned_at };
  });
}