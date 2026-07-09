"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { WordleGrid } from "@/components/game/wordle-grid";
import { VirtualKeyboard } from "@/components/game/virtual-keyboard";
import { EscrowHud } from "@/components/game/escrow-hud";
import { ActionDeck } from "@/components/game/action-deck";
import { GameEndModal } from "@/components/game/game-end-modal";
import { Confetti } from "@/components/game/confetti";
import { useGameStore } from "@/stores/game-store";
import { submitGuess, useHintAction } from "@/actions/game";
import type { HintType } from "@/lib/types";
import { playSound } from "@/lib/sounds";

export default function GameTablePage({ params }: { params: Promise<{ gameId: string }> }) {
  const router = useRouter();
  const [gameId, setGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [shakeRow, setShakeRow] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [endGameData, setEndGameData] = useState<{
    gameMode: string;
    targetWord: string;
    status: "WON" | "BANKRUPT" | "FOLDED";
    finalEscrow: number;
    rowsUsed: number;
    isDoubleDown: boolean;
    hintsUsed: string[];
    entryStake: number;
    insuranceRefund: number;
    hasInsurance: boolean;
  } | null>(null);

  const {
    boardGrid,
    tileStates,
    keyboardState,
    currentRow,
    currentCol,
    currentChips,
    isDoubleDownActive,
    gameStatus,
    hintsUsed,
    cardCountRemaining,
    burnedLetters,
    hydrateFromServer,
    setGameId: storeSetGameId,
    typeLetter,
    deleteLetter,
    submitGuess: storeSubmitGuess,
    activateDoubleDown,
    useHint,
    resetGame,
    setStatus,
  } = useGameStore();

  const [shakeTrigger, setShakeTrigger] = useState(0);
  const prevIsDoubleDown = useRef(false);
  const prevGameStatus = useRef<string>("IN_PROGRESS");
  const prevChips = useRef(currentChips);

  useEffect(() => {
    if (currentChips < prevChips.current) {
      playSound("chip_clink");
    }
    prevChips.current = currentChips;
  }, [currentChips]);

  useEffect(() => {
    if (isDoubleDownActive && !prevIsDoubleDown.current) {
      setShakeTrigger((n) => n + 1);
      playSound("double_down");
    }
    prevIsDoubleDown.current = isDoubleDownActive;
  }, [isDoubleDownActive]);

  useEffect(() => {
    if (gameStatus === "BANKRUPT" && prevGameStatus.current !== "BANKRUPT") {
      setShakeTrigger((n) => n + 1);
      playSound("bankruptcy");
    }
    if (gameStatus === "WON" && prevGameStatus.current !== "WON") {
      playSound("win_jingle");
      setShowConfetti(true);
    }
    if (gameStatus === "FOLDED" && prevGameStatus.current !== "FOLDED") {
      playSound("fold");
    }
    prevGameStatus.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== "IN_PROGRESS" && gameId && !endGameData) {
      const fetchEndData = async () => {
        try {
          const { getGameEndData } = await import("@/actions/game");
          const data = await getGameEndData(gameId);
          setEndGameData(data);
        } catch {
          // fallback
        }
      };
      fetchEndData();
    }
  }, [gameStatus, gameId, endGameData]);

  useEffect(() => {
    params.then((p) => {
      setGameId(p.gameId);
      storeSetGameId(p.gameId);
    });
  }, [params, storeSetGameId]);

  useEffect(() => {
    if (!gameId) return;
    const hydrate = async () => {
      try {
        const { getGameState } = await import("@/actions/game");
        const state = await getGameState(gameId);
        hydrateFromServer(state);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Failed to load game");
      }
    };
    hydrate();
  }, [gameId, hydrateFromServer]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (loading || isRevealing || gameStatus !== "IN_PROGRESS") return;
      typeLetter(key);
      playSound("key_press");
    },
    [loading, isRevealing, gameStatus, typeLetter]
  );

  const handleDelete = useCallback(() => {
    if (loading || isRevealing) return;
    deleteLetter();
  }, [loading, isRevealing, deleteLetter]);

  const handleSubmit = useCallback(async () => {
    if (loading || isRevealing || !gameId) return;
    if (currentCol !== 5) {
      setMessage("Not enough letters");
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
      return;
    }

    const guess = boardGrid[currentRow].join("");
    setLoading(true);
    setIsRevealing(true);

    try {
      playSound("key_enter");
      const result = await submitGuess(gameId, guess, currentRow + 1, isDoubleDownActive);

      storeSubmitGuess(guess, result.tileStates);
      setMessage(result.message);

      if (result.status !== "IN_PROGRESS") {
        setStatus(result.status);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error");
      setShakeRow(true);
      setTimeout(() => setShakeRow(false), 500);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRevealing(false), 500);
    }
  }, [gameId, boardGrid, currentRow, currentCol, isDoubleDownActive, loading, isRevealing, storeSubmitGuess, setStatus]);

  const handleDoubleDown = useCallback(() => {
    activateDoubleDown();
    setMessage("DOUBLE DOWN ACTIVATED - All or nothing!");
  }, [activateDoubleDown]);

  const handleFold = useCallback(async () => {
    if (!gameId) return;
    try {
      const { foldGame } = await import("@/actions/game");
      const result = await foldGame(gameId);
      setStatus("FOLDED");
      setMessage(`Folded. Retained ${result.returnedChips.toLocaleString()} chips.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Fold failed");
    }
  }, [gameId, setStatus]);

  const handleHint = useCallback(
    async (hint: HintType) => {
      if (!gameId) return;
      try {
        playSound("hint_use");
        const result = await useHintAction(gameId, hint);
        useHint(hint, hint === "card_count" ? result.lettersToBurn : undefined);
        setMessage(`Hint applied: ${hint.replace("_", " ")}`);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Hint failed");
      }
    },
    [gameId, useHint]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Enter") handleSubmit();
      else if (e.key === "Backspace") handleDelete();
      else if (/^[a-zA-Z]$/.test(e.key)) handleKeyPress(e.key.toUpperCase());
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit, handleDelete, handleKeyPress]);

  return (
    <>
      <Nav />
      <main className="
        mx-auto max-w-7xl px-3 sm:px-6 py-4
        sm:h-dvh sm:flex sm:flex-col sm:overflow-hidden sm:py-0
      ">
        <div className="
          mx-auto w-full max-w-[500px]
          sm:flex sm:flex-col sm:flex-1 sm:max-w-5xl sm:h-full sm:gap-3 sm:py-4 sm:min-h-0
          space-y-4 sm:space-y-0
        ">
          {/* HUD row */}
          <motion.div
            key={shakeTrigger}
            animate={{ x: [0, -8, 8, -8, 8, -8, 8, -4, 4, -2, 2, 0] }}
            transition={{ duration: 0.8 }}
            className="sm:flex-shrink-0 space-y-4"
          >
          <EscrowHud
            currentChips={currentChips}
            row={currentRow + 1}
            isDoubleDown={isDoubleDownActive}
          />

          {message && (
            <div className="rounded-lg bg-gold-soft px-4 py-2 text-center font-document text-sm text-gold">
              {message}
            </div>
          )}
          </motion.div>

          {/* Middle: grid + actions side by side on web */}
          <div className="
            sm:flex-1 sm:flex sm:items-center sm:justify-center sm:gap-6 sm:min-h-0
          ">
            <div className="flex justify-center sm:flex-shrink-0">
              <WordleGrid
                boardGrid={boardGrid}
                tileStates={tileStates}
                currentRow={currentRow}
                currentCol={currentCol}
                isRevealing={isRevealing}
                shakeRow={shakeRow}
              />
            </div>

            {/* Actions sidebar — desktop only */}
            <div className="hidden sm:block sm:w-44 sm:flex-shrink-0">
              <ActionDeck
                row={currentRow + 1}
                currentChips={currentChips}
                isDoubleDown={isDoubleDownActive}
                hintsUsed={hintsUsed}
                cardCountRemaining={cardCountRemaining}
                onDoubleDown={handleDoubleDown}
                onFold={handleFold}
                onHint={handleHint}
                compact
              />
            </div>
          </div>

          {/* Actions — mobile only, below grid */}
          <div className="sm:hidden">
            <ActionDeck
              row={currentRow + 1}
              currentChips={currentChips}
              isDoubleDown={isDoubleDownActive}
              hintsUsed={hintsUsed}
              cardCountRemaining={cardCountRemaining}
              onDoubleDown={handleDoubleDown}
              onFold={handleFold}
              onHint={handleHint}
            />
          </div>

          <div className="sm:flex-shrink-0 flex justify-center">
            <VirtualKeyboard
              keyboardState={keyboardState}
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onEnter={handleSubmit}
              disabled={loading || isRevealing || gameStatus !== "IN_PROGRESS"}
              burnedLetters={burnedLetters}
            />
          </div>
        </div>
      </main>

      {showConfetti && <Confetti />}

      <GameEndModal
        open={gameStatus !== "IN_PROGRESS"}
        gameMode={endGameData?.gameMode || ""}
        targetWord={endGameData?.targetWord || ""}
        status={(endGameData?.status || gameStatus) as "WON" | "BANKRUPT" | "FOLDED"}
        finalEscrow={endGameData?.finalEscrow || 0}
        rowsUsed={endGameData?.rowsUsed || 0}
        isDoubleDown={endGameData?.isDoubleDown || false}
        hintsUsed={endGameData?.hintsUsed || []}
        entryStake={endGameData?.entryStake || 0}
        insuranceRefund={endGameData?.insuranceRefund || 0}
        hasInsurance={endGameData?.hasInsurance || false}
      />
    </>
  );
}
