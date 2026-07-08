"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateUsername(username: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (username.length < 3 || username.length > 20) {
    throw new Error("Username must be 3-20 characters");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") throw new Error("Username already taken");
    throw error;
  }

  revalidatePath("/profile");
  return { success: true };
}

function getLoginBonus(streak: number): number {
  if (streak >= 7) return 100;
  if (streak >= 6) return 75;
  if (streak >= 5) return 50;
  if (streak >= 4) return 35;
  if (streak >= 3) return 25;
  if (streak >= 2) return 15;
  return 10;
}

export async function claimDailyLogin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("bankroll, login_streak, last_login_date")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const today = new Date().toISOString().split("T")[0];
  if (profile.last_login_date === today) {
    throw new Error("Daily Comp already claimed today");
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak = profile.last_login_date === yesterdayStr
    ? (profile.login_streak || 0) + 1
    : 1;

  const bonus = getLoginBonus(newStreak);

  await supabase
    .from("profiles")
    .update({
      bankroll: (profile.bankroll || 0) + bonus,
      login_streak: newStreak,
      last_login_date: today,
    })
    .eq("id", user.id);

  const { checkLoginTrophy } = await import("./trophies");
  await checkLoginTrophy(newStreak);

  revalidatePath("/dashboard");
  return { bonus, streak: newStreak };
}

export async function claimDailyWheel() {
  return claimDailyLogin();
}
