"use client";

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="mt-8 rounded-lg bg-accent px-6 py-3 font-label text-xs text-white transition-all hover:opacity-90 active:scale-[0.98]"
    >
      Retry
    </button>
  );
}
