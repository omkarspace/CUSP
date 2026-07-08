"use client";

interface DailyWheelProps {
  bankroll: number;
  loginStreak: number;
  todayClaimed: boolean;
  onClaimDaily?: () => void;
}

export function DailyWheel({ bankroll, loginStreak, todayClaimed, onClaimDaily }: DailyWheelProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between sm:justify-start sm:gap-6">
          <div>
            <span className="font-label text-xs text-ink-muted">Bankroll</span>
            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-semibold tracking-tight text-accent">
              {bankroll.toLocaleString()}
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center sm:text-left">
            <span className="font-label text-xs text-ink-muted">Streak</span>
            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-semibold text-gold">
              {loginStreak}
            </div>
          </div>
        </div>
        <button
          onClick={onClaimDaily}
          disabled={todayClaimed || !onClaimDaily}
          className="w-full sm:w-auto rounded-lg bg-gold-soft px-5 py-3 sm:py-2.5 font-label text-xs text-gold transition-all hover:bg-gold-soft/80 disabled:opacity-40 active:scale-[0.97]"
        >
          {todayClaimed ? "Claimed" : "Daily Bonus"}
        </button>
      </div>
    </div>
  );
}
