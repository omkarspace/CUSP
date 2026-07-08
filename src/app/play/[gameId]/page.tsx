"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { WordleGrid } from "@/components/game/wordle-grid";
import { VirtualKeyboard } from "@/components/game/virtual-keyboard";
import { EscrowHud } from "@/components/game/escrow-hud";
import { ActionDeck } from "@/components/game/action-deck";
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
    }
    if (gameStatus === "FOLDED" && prevGameStatus.current !== "FOLDED") {
      playSound("fold");
    }
    prevGameStatus.current = gameStatus;
  }, [gameStatus]);

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

  const handleFold = useCallback(() => {
    setStatus("FOLDED");
    setMessage("Folded. You preserved your remaining chips.");
  }, [setStatus]);

  const handleHint = useCallback(
    async (hint: HintType) => {
      if (!gameId) return;
      try {
        await useHintAction(gameId, hint);
        useHint(hint);
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
      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-8">
        <div className="mx-auto max-w-[500px] space-y-4 sm:space-y-6">
          <motion.div
            key={shakeTrigger}
            animate={{ x: [0, -8, 8, -8, 8, -8, 8, -4, 4, -2, 2, 0] }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
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

          <div className="flex justify-center">
            <WordleGrid
              boardGrid={boardGrid}
              tileStates={tileStates}
              currentRow={currentRow}
              currentCol={currentCol}
              isRevealing={isRevealing}
              shakeRow={shakeRow}
            />
          </div>

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

          <div className="flex justify-center">
            <VirtualKeyboard
              keyboardState={keyboardState}
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onEnter={handleSubmit}
              disabled={loading || isRevealing || gameStatus !== "IN_PROGRESS"}
            />
          </div>

          {gameStatus !== "IN_PROGRESS" && (
            <div className="rounded-xl border border-border bg-surface p-6 text-center">
              <h2 className="text-2xl font-semibold text-ink">
                {gameStatus === "WON" ? "Winner" : gameStatus === "BANKRUPT" ? "Bankrupt" : "Folded"}
              </h2>
              <p className="mt-2 text-sm text-ink-secondary">{message}</p>
              <button
                onClick={() => {
                  resetGame();
                  router.push("/dashboard");
                }}
                className="mt-4 rounded-lg bg-accent px-6 py-2 font-label text-xs text-white transition-all hover:bg-accent-dark active:scale-[0.98]"
              >
                Back to Hub
              </button>
            </div>
          )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
