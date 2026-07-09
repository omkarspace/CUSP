import { create } from "zustand";
import type { TileState, GameStatus, HintType } from "@/lib/types";

export interface ServerGameState {
  currentRow: number;
  currentChipsEscrow: number;
  isDoubleDown: boolean;
  hintsUsed: string[];
  status: GameStatus;
}

interface GameStore {
  boardGrid: string[][];
  tileStates: TileState[][];
  keyboardState: Record<string, TileState>;

  currentRow: number;
  currentCol: number;
  currentChips: number;
  heatStreak: number;
  isDoubleDownActive: boolean;
  gameStatus: GameStatus;
  gameId: string | null;

  hintsUsed: HintType[];
  cardCountRemaining: number;
  burnedLetters: string[];

  hydrateFromServer: (data: ServerGameState) => void;
  setGameId: (id: string) => void;
  setGameInfo: (chips: number, streak: number) => void;
  typeLetter: (letter: string) => void;
  deleteLetter: () => void;
  submitGuess: (guess: string, states: TileState[]) => void;
  activateDoubleDown: () => void;
  useHint: (hint: HintType, lettersToBurn?: string[]) => void;
  resetGame: () => void;
  setStatus: (status: GameStatus) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  boardGrid: Array.from({ length: 6 }, () => Array(5).fill("")),
  tileStates: Array.from({ length: 6 }, () => Array(5).fill("empty")),
  keyboardState: {},

  currentRow: 0,
  currentCol: 0,
  currentChips: 100,
  heatStreak: 0,
  isDoubleDownActive: false,
  gameStatus: "IN_PROGRESS",
  gameId: null,

  hintsUsed: [],
  cardCountRemaining: 2,
  burnedLetters: [],

  hydrateFromServer: (data) =>
    set({
      currentRow: data.currentRow - 1,
      currentCol: 0,
      currentChips: data.currentChipsEscrow,
      isDoubleDownActive: data.isDoubleDown,
      hintsUsed: data.hintsUsed as HintType[],
      cardCountRemaining: 2 - data.hintsUsed.filter((h) => h === "card_count").length,
      gameStatus: data.status,
    }),

  setGameId: (id) => set({ gameId: id }),

  setGameInfo: (chips, streak) => set({ currentChips: chips, heatStreak: streak }),

  typeLetter: (letter) => {
    const { currentCol, currentRow, boardGrid, gameStatus } = get();
    if (currentCol >= 5 || currentRow >= 6 || gameStatus !== "IN_PROGRESS") return;

    const newGrid = boardGrid.map((row) => [...row]);
    newGrid[currentRow][currentCol] = letter;

    set({ boardGrid: newGrid, currentCol: currentCol + 1 });
  },

  deleteLetter: () => {
    const { currentCol, currentRow, boardGrid } = get();
    if (currentCol <= 0 || currentRow >= 6) return;

    const newGrid = boardGrid.map((row) => [...row]);
    newGrid[currentRow][currentCol - 1] = "";

    set({ boardGrid: newGrid, currentCol: currentCol - 1 });
  },

  submitGuess: (guess, states) => {
    const { currentRow, keyboardState } = get();

    const newKeyboard = { ...keyboardState };
    for (let i = 0; i < 5; i++) {
      const letter = guess[i];
      const state = states[i];
      const current = newKeyboard[letter];
      const priority: Record<TileState, number> = {
        correct: 3,
        present: 2,
        absent: 1,
        empty: 0,
      };
      if (priority[state] > priority[current || "empty"]) {
        newKeyboard[letter] = state;
      }
    }

    set({
      tileStates: get().tileStates.map((row, i) =>
        i === currentRow ? states : row
      ),
      keyboardState: newKeyboard,
      currentRow: currentRow + 1,
      currentCol: 0,
    });
  },

  activateDoubleDown: () => set({ isDoubleDownActive: true }),

  useHint: (hint: HintType, lettersToBurn?: string[]) => {
    const { hintsUsed, cardCountRemaining } = get();
    if (hint === "card_count" && cardCountRemaining <= 0) return;

    set({
      hintsUsed: [...hintsUsed, hint],
      cardCountRemaining: hint === "card_count" ? cardCountRemaining - 1 : cardCountRemaining,
      burnedLetters: hint === "card_count" && lettersToBurn ? lettersToBurn : [],
    });
  },

  resetGame: () =>
    set({
      boardGrid: Array.from({ length: 6 }, () => Array(5).fill("")),
      tileStates: Array.from({ length: 6 }, () => Array(5).fill("empty")),
      keyboardState: {},
      currentRow: 0,
      currentCol: 0,
      isDoubleDownActive: false,
      gameStatus: "IN_PROGRESS",
      gameId: null,
      hintsUsed: [],
      cardCountRemaining: 2,
      burnedLetters: [],
    }),

  setStatus: (status) => set({ gameStatus: status }),
}));
