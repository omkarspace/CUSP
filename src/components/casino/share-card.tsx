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
    "🎰 CUSP - The Board",
    `Rank: #${rank} | Hot Streak: ${streak} 🔥 | Peak: ${peak.toLocaleString()} chips`,
    "Think you can beat me? 👑",
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
    <div className="rounded-xl border border-tile-border/30 bg-casino-surface-low p-6">
      <div className="mb-4 space-y-1">
        <p className="font-heading text-xs uppercase tracking-widest text-text-muted">
          Your Player Card
        </p>
        <pre className="whitespace-pre-wrap rounded-lg bg-casino-surface-high p-4 font-heading text-sm leading-relaxed text-text-primary">
          {shareText}
        </pre>
      </div>
      <button
        onClick={handleCopy}
        className="w-full cursor-pointer rounded-lg border border-neon-green/40 bg-neon-green/10 px-4 py-2 font-heading text-sm font-semibold text-neon-green transition-colors hover:bg-neon-green/20 active:bg-neon-green/30"
      >
        {copied ? "Copied!" : "Copy Shareable Card"}
      </button>
    </div>
  );
}