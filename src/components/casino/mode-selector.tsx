"use client";

import { useRouter } from "next/navigation";

interface ModeSelectorProps {
  bankroll: number;
  heatStreak: number;
}

const modes = [
  {
    id: "DAILY",
    title: "The Daily Jackpot",
    cost: 10,
    desc: "Once per day. Posts to The Board.",
    required: 0,
  },
  {
    id: "INFINITE",
    title: "The Grind",
    cost: 50,
    desc: "Endless mode — starts easy, gets harder.",
    required: 0,
  },
  {
    id: "HIGH_ROLLER",
    title: "The Penthouse",
    cost: 50,
    desc: "5K chips + 3-win Hot Streak required. Hard words, 2x payouts.",
    required: 5000,
  },
];

export function ModeSelector({ bankroll }: ModeSelectorProps) {
  const router = useRouter();

  return (
    <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
      {modes.map((mode) => {
        const locked = bankroll < mode.required;
        return (
          <div
            key={mode.id}
            className={`rounded-xl border bg-surface p-5 sm:p-6 transition-all ${
              locked
                ? "border-border opacity-50"
                : "border-border hover:border-accent active:border-accent"
            }`}
          >
            <h3 className="text-base sm:text-lg font-semibold text-ink">{mode.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{mode.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-label text-xs text-ink-muted">{mode.cost} chips entry</span>
              <button
                onClick={() => router.push(`/lobby?mode=${mode.id}`)}
                disabled={locked}
                className="rounded-lg bg-accent px-4 py-2.5 sm:py-2 font-label text-xs text-white transition-all hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97]"
              >
                {locked ? "Locked" : "Play"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
