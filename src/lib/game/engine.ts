import { COST_MATRIX, STREAK_MULTIPLIERS } from "../types";

export function calculatePayout(
  row: number,
  isWin: boolean,
  hotStreak: number,
  scaleFactor: number = 1
): { cost: number; payout: number } {
  const rowConfig = COST_MATRIX[row - 1];
  if (!rowConfig) return { cost: 0, payout: 0 };

  let multiplier = 1;
  for (const { minStreak, multiplier: m } of STREAK_MULTIPLIERS) {
    if (hotStreak >= minStreak) {
      multiplier = m;
      break;
    }
  }

  return {
    cost: Math.floor(rowConfig.cost * scaleFactor),
    payout: isWin ? Math.floor(rowConfig.payout * multiplier * scaleFactor) : 0,
  };
}

export function getBaseEntryForMode(mode: string): number {
  if (mode === "INFINITE") return 50;
  if (mode === "HIGH_ROLLER") return 50;
  return 10;
}

export function getStakeLimits(mode: string): { min: number; max: number } {
  if (mode === "HIGH_ROLLER") return { min: 50, max: 1000 };
  if (mode === "INFINITE") return { min: 50, max: 500 };
  return { min: 10, max: 200 };
}
