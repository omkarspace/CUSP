import { COST_MATRIX, STREAK_MULTIPLIERS } from "../types";

export function calculatePayout(
  row: number,
  isWin: boolean,
  hotStreak: number
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
    cost: rowConfig.cost,
    payout: isWin ? Math.floor(rowConfig.payout * multiplier) : 0,
  };
}
