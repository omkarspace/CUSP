"use client";

import { useState } from "react";

interface ShareCardProps {
  username: string;
  rank: number;
  streak: number;
  peak: number;
}

export function ShareCard({ username, rank, streak, peak }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const shareText = [
    "CUSP",
    `Rank: #${rank} | Hot Streak: ${streak} | Peak: ${peak.toLocaleString()} chips`,
    "On the edge of a win",
  ].join("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="mb-4 space-y-1">
        <p className="font-label text-xs text-ink-muted">
          Your Player Card
        </p>
        <pre className="whitespace-pre-wrap rounded-lg bg-surface-elevated p-3 sm:p-4 font-mono text-xs sm:text-sm leading-relaxed text-ink">
          {shareText}
        </pre>
      </div>
      <button
        onClick={handleCopy}
        className="w-full cursor-pointer rounded-lg border border-gold/40 bg-gold-soft px-4 py-3 sm:py-2 font-label text-xs text-gold transition-colors hover:bg-gold-soft/80 active:scale-[0.97]"
      >
        {copied ? "Copied!" : "Copy Shareable Card"}
      </button>
    </div>
  );
}
