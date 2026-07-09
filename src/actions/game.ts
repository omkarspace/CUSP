"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getWordForMode, evaluateGuess, isValidWord } from "@/lib/game/words";
import { calculatePayout, getBaseEntryForMode, getStakeLimits } from "@/lib/game/engine";
import { checkTrophiesAfterGame } from "./trophies";
import type { HintType, GameStatus, GameMode } from "@/lib/types";

export async function initGame(gameMode: GameMode, stake?: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const baseEntry = getBaseEntryForMode(gameMode);
  const entryCost = stake ?? baseEntry;
  const limits = getStakeLimits(gameMode);
  if (entryCost < limits.min || entryCost > limits.max) throw new Error("Invalid stake");

  const [profile, todayCheck] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    gameMode === "DAILY"
      ? supabase
          .from("game_sessions")
          .select("id")
          .eq("user_id", user.id)
          .eq("game_mode", "DAILY")
          .gte("created_at", new Date().toISOString().split("T")[0])
          .single()
      : Promise.resolve({ data: null }),
  ]);

  if (!profile.data) throw new Error("Profile not found");
  if (todayCheck.data) throw new Error("Already played daily mode today");
  if (profile.data.bankroll < entryCost) throw new Error("Insufficient chips");

  if (gameMode === "HIGH_ROLLER") {
    if (profile.data.bankroll < 5000) throw new Error("5,000 chips required for The Penthouse");
    if (profile.data.heat_streak < 3) throw new Error("3-win Hot Streak required for The Penthouse");
  }

  const targetWord = getWordForMode(gameMode, profile.data.heat_streak);

  const { data: game, error } = await supabase
    .from("game_sessions")
    .insert({
      user_id: user.id,
      game_mode: gameMode,
      target_word: targetWord,
      entry_stake: entryCost,
      current_chips_escrow: entryCost,
      current_row: 1,
      is_double_down: false,
      hints_used: [],
      total_costs_incurred: 0,
      status: "IN_PROGRESS",
    })
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from("profiles")
    .update({ bankroll: profile.data.bankroll - entryCost })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  return { gameId: game.id, bankroll: profile.data.bankroll - entryCost };
}

export async function submitGuess(
  gameId: string,
  guess: string,
  row: number,
  isDoubleDown: boolean
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (!isValidWord(guess)) throw new Error("Not a valid word");

  const { data: game } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game || game.status !== "IN_PROGRESS") throw new Error("Game not active");
  if (game.current_row !== row) throw new Error("Invalid row");

  const tileStates = evaluateGuess(guess, game.target_word);
  const isWin = tileStates.every((s) => s === "correct");

  const isPenthouse = game.game_mode === "HIGH_ROLLER";
  const modeMultiplier = isPenthouse ? 2 : 1;
  const baseEntry = getBaseEntryForMode(game.game_mode);
  const scaleFactor = game.entry_stake ? game.entry_stake / baseEntry : 1;

  let newStatus: GameStatus = "IN_PROGRESS";
  let message = "";

  if (isWin) {
    newStatus = "WON";
    message = isPenthouse ? "PENTHOUSE JACKPOT!" : "Winner Winner!";
  } else if (row >= 6 || isDoubleDown) {
    if (isDoubleDown && !isWin) {
      newStatus = "BANKRUPT";
      message = "Double Down Bankruptcy!";
    } else if (row >= 6) {
      newStatus = "BANKRUPT";
      message = "No more rows!";
    }
  } else {
    message = `Row ${row} complete`;
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("heat_streak")
    .eq("id", user.id)
    .single();
  const { cost, payout } = calculatePayout(row, isWin, currentProfile?.heat_streak || 0, scaleFactor);
  const adjustedPayout = Math.floor(payout * modeMultiplier);
  const newEscrow = game.current_chips_escrow + adjustedPayout - cost;
  const newTotalCosts = (game.total_costs_incurred || 0) + cost;

  let insuranceRefund = 0;
  if (newStatus === "BANKRUPT") {
    const hintsUsed = (game.hints_used || []) as string[];
    if (hintsUsed.includes("insurance")) {
      insuranceRefund = Math.floor(newTotalCosts * 0.5);
    }
  }

  await supabase
    .from("game_sessions")
    .update({
      current_row: row + 1,
      current_chips_escrow: newEscrow,
      is_double_down: isDoubleDown,
      total_costs_incurred: newTotalCosts,
      status: newStatus,
    })
    .eq("id", gameId);

  if (newStatus !== "IN_PROGRESS") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("bankroll, heat_streak, total_games_played, total_wins, total_bankruptcies, lifetime_chips_earned, weekly_chips_earned")
      .eq("id", user.id)
      .single();

    if (profile) {
      const newBankroll = newStatus === "WON"
        ? profile.bankroll + newEscrow
        : profile.bankroll + insuranceRefund;
      const newStreak = newStatus === "WON" ? profile.heat_streak + 1 : 0;
      const earnedThisGame = newStatus === "WON" ? adjustedPayout : 0;

      await supabase
        .from("profiles")
        .update({
          bankroll: newBankroll,
          heat_streak: newStreak,
          total_games_played: profile.total_games_played + 1,
          total_wins: profile.total_wins + (newStatus === "WON" ? 1 : 0),
          total_bankruptcies: profile.total_bankruptcies + (newStatus === "BANKRUPT" ? 1 : 0),
          lifetime_chips_earned: (profile.lifetime_chips_earned || 0) + earnedThisGame,
          weekly_chips_earned: (profile.weekly_chips_earned || 0) + earnedThisGame,
        })
        .eq("id", user.id);

      if (newStatus === "WON") {
        await checkTrophiesAfterGame({
          won: true,
          row,
          hotStreak: newStreak,
          totalWins: (profile.total_wins || 0) + 1,
          totalGames: (profile.total_games_played || 0) + 1,
          lifetimeChips: (profile.lifetime_chips_earned || 0) + earnedThisGame,
        });
      }
    }
  }

  revalidatePath("/play/[gameId]", "page");
  return { tileStates, isWin, status: newStatus, message, updatedChips: newEscrow, insuranceRefund };
}

export async function foldGame(gameId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: game } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game || game.status !== "IN_PROGRESS") throw new Error("Game not active");

  const escrowReturn = game.current_chips_escrow;

  await supabase
    .from("game_sessions")
    .update({ status: "FOLDED" })
    .eq("id", gameId);

  const { data: profile } = await supabase
    .from("profiles")
    .select("bankroll, total_games_played")
    .eq("id", user.id)
    .single();

  if (profile) {
    await supabase
      .from("profiles")
      .update({
        bankroll: (profile.bankroll || 0) + escrowReturn,
        total_games_played: (profile.total_games_played || 0) + 1,
      })
      .eq("id", user.id);
  }

  revalidatePath("/play/[gameId]", "page");
  revalidatePath("/dashboard");
  return { returnedChips: escrowReturn };
}

export async function getGameEndData(gameId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: game } = await supabase
    .from("game_sessions")
    .select("game_mode, target_word, current_chips_escrow, current_row, is_double_down, hints_used, total_costs_incurred, entry_stake, status")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game || game.status === "IN_PROGRESS") throw new Error("Game not ended");

  const hintsUsed = (game.hints_used || []) as string[];
  const hasInsurance = hintsUsed.includes("insurance");
  const insuranceRefund = game.status === "BANKRUPT" && hasInsurance
    ? Math.floor((game.total_costs_incurred || 0) * 0.5)
    : 0;

  return {
    gameMode: game.game_mode,
    targetWord: game.target_word,
    finalEscrow: game.current_chips_escrow,
    rowsUsed: Math.min(game.current_row - 1, 6),
    isDoubleDown: game.is_double_down || false,
    hintsUsed,
    entryStake: game.entry_stake || 10,
    status: game.status,
    insuranceRefund,
    hasInsurance,
  };
}

export async function getGameState(gameId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: game } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game) throw new Error("Game not found");

  return {
    gameMode: game.game_mode,
    currentRow: game.current_row,
    currentChipsEscrow: game.current_chips_escrow,
    entryStake: game.entry_stake,
    isDoubleDown: game.is_double_down,
    hintsUsed: game.hints_used as string[],
    status: game.status,
  };
}

export async function useHintAction(
  gameId: string,
  hintType: HintType
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: game } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", gameId)
    .eq("user_id", user.id)
    .single();

  if (!game || game.status !== "IN_PROGRESS") throw new Error("Game not active");

  const hintsUsed = game.hints_used as HintType[];
  if (hintsUsed.includes(hintType)) throw new Error("Hint already used");

  const hintCosts = { card_count: 15, peek: 30, insurance: 25 };
  const cost = game.entry_stake
    ? Math.floor(hintCosts[hintType] * (game.entry_stake / getBaseEntryForMode(game.game_mode)))
    : hintCosts[hintType];

  if (game.current_chips_escrow < cost) throw new Error("Insufficient chips for hint");

  let result: { lettersToReveal?: string[]; lettersToBurn?: string[] } = {};

  if (hintType === "peek") {
    const target = game.target_word;
    result = { lettersToReveal: [target[0]] };
  } else if (hintType === "card_count") {
    const target = game.target_word;
    const absent = "abcdefghijklmnopqrstuvwxyz"
      .split("")
      .filter((l) => !target.includes(l))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    result = { lettersToBurn: absent };
  }

  await supabase
    .from("game_sessions")
    .update({
      hints_used: [...hintsUsed, hintType],
      current_chips_escrow: game.current_chips_escrow - cost,
      total_costs_incurred: (game.total_costs_incurred || 0) + cost,
    })
    .eq("id", gameId);

  return result;
}
