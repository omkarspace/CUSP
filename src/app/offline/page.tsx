"use client";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted">
          <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.5M5 12.5a10.94 10.94 0 0 1 5.83-2.84M8.5 16.5a4.48 4.48 0 0 1 7 0M12 20h.01" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-ink">No Connection</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
        Wager rounds require a network connection. Check your connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-8 rounded-lg bg-accent px-6 py-3 font-label text-xs text-white transition-all hover:opacity-90 active:scale-[0.98]"
      >
        Retry
      </button>
    </main>
  );
}
