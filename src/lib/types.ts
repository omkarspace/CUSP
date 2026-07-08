export type TileState = "correct" | "present" | "absent" | "empty";

export type GameStatus = "IN_PROGRESS" | "WON" | "BANKRUPT" | "FOLDED";

export type GameMode = "DAILY" | "INFINITE";

export interface GameSession {
  id: string;
  userId: string;
  gameMode: GameMode;
  targetWord: string;
  currentChipsEscrow: number;
  currentRow: number;
  isDoubleDown: boolean;
  hintsUsed: HintType[];
  totalCostsIncurred: number;
  status: GameStatus;
  boardGrid: string[][];
  tileStates: TileState[][];
  createdAt: string;
}

export type HintType = "card_count" | "peek" | "insurance";

export interface GuessResult {
  tileStates: TileState[];
  updatedBalance: number;
  isWin: boolean;
  nextRow: number;
  message: string;
  insuranceRefund?: number;
}

export interface PlayerProfile {
  id: string;
  username: string;
  bankroll: number;
  heatStreak: number;
  highestEverBankroll: number;
  totalGamesPlayed: number;
  totalWins: number;
  totalBankruptcies: number;
  updatedAt: string;
}

export const COST_MATRIX = [
  { row: 1, cost: 10, payout: 200 },
  { row: 2, cost: 15, payout: 150 },
  { row: 3, cost: 20, payout: 100 },
  { row: 4, cost: 25, payout: 60 },
  { row: 5, cost: 30, payout: 40 },
  { row: 6, cost: 40, payout: 20 },
];

export const STREAK_MULTIPLIERS: Array<{ minStreak: number; multiplier: number }> = [
  { minStreak: 10, multiplier: 2.0 },
  { minStreak: 5, multiplier: 1.5 },
  { minStreak: 3, multiplier: 1.2 },
];

export const HINT_COSTS: Record<HintType, number> = {
  card_count: 15,
  peek: 30,
  insurance: 25,
};
