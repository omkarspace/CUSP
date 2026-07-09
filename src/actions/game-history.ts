"use server";

import { createClient } from "@/lib/supabase/server";

export interface GameHistoryItem {
  id: string;
  gameMode: string;
  status: string;
  targetWord: string;
  finalEscrow: number;
  rowsUsed: number;
  hintsUsed: string[];
  isDoubleDown: boolean;
  playedAt: string;
}

export async function getGameHistory(limit = 20) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data } = await supabase
    .from("game_sessions")
    .select("id, game_mode, status, target_word, current_chips_escrow, current_row, hints_used, is_double_down, created_at")
    .eq("user_id", user.id)
    .in("status", ["WON", "BANKRUPT"])
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data || []).map((g) => ({
    id: g.id,
    gameMode: g.game_mode,
    status: g.status,
    targetWord: g.target_word,
    finalEscrow: g.current_chips_escrow,
    rowsUsed: Math.min(g.current_row - 1, 6),
    hintsUsed: g.hints_used || [],
    isDoubleDown: g.is_double_down || false,
    playedAt: g.created_at,
  })) satisfies GameHistoryItem[];
}
