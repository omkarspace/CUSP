"use client";

import { useState } from "react";
import { claimDailyLogin } from "@/actions/profile";

const SEGMENTS = [
  { value: 10, color: "#F59E0B" },
  { value: 15, color: "#EF4444" },
  { value: 25, color: "#10B981" },
  { value: 35, color: "#8B5CF6" },
  { value: 50, color: "#3B82F6" },
  { value: 75, color: "#EC4899" },
  { value: 100, color: "#F59E0B" },
  { value: 10, color: "#14B8A6" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

interface DailyWheelProps {
  bankroll: number;
  loginStreak: number;
  todayClaimed: boolean;
}

export function DailyWheel({ bankroll, loginStreak, todayClaimed }: DailyWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{ bonus: number; streak: number } | null>(null);
  const [showResult, setShowResult] = useState(false);

  async function handleSpin() {
    if (spinning || todayClaimed) return;

    setSpinning(true);
    setShowResult(false);
    setResult(null);

    try {
      const data = await claimDailyLogin();

      const matchIndices = SEGMENTS
        .map((s, i) => s.value === data.bonus ? i : -1)
        .filter(i => i >= 0);
      const targetSegment = matchIndices[Math.floor(Math.random() * matchIndices.length)];

      const fullSpins = (3 + Math.floor(Math.random() * 3)) * 360;
      const targetAngle = targetSegment * SEGMENT_ANGLE;
      const currentAngle = rotation % 360;
      const delta = ((targetAngle + 22.5 - currentAngle) % 360 + 360) % 360;
      const totalRotation = rotation + fullSpins + delta;

      setRotation(totalRotation);
      setResult(data);

      setTimeout(() => {
        setShowResult(true);
        setSpinning(false);
      }, 4200);
    } catch {
      setSpinning(false);
    }
  }

  const cx = 100;
  const cy = 100;
  const r = 94;

  const segments = SEGMENTS.map((seg, i) => {
    const startDeg = i * SEGMENT_ANGLE - 90 - SEGMENT_ANGLE / 2;
    const endDeg = i * SEGMENT_ANGLE - 90 + SEGMENT_ANGLE / 2;
    const midDeg = i * SEGMENT_ANGLE - 90;

    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const midRad = (midDeg * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const tr = 56;
    const tx = cx + tr * Math.cos(midRad);
    const ty = cy + tr * Math.sin(midRad);

    const textRot = i * SEGMENT_ANGLE;
    const needsFlip = i * SEGMENT_ANGLE > 90 && i * SEGMENT_ANGLE < 270;
    const finalRot = needsFlip ? textRot + 180 : textRot;

    return { path, color: seg.color, value: seg.value, tx, ty, finalRot, midDeg };
  });

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 w-full max-w-md justify-center sm:justify-start">
          <div className="text-center">
            <span className="font-label text-xs text-ink-muted">Bankroll</span>
            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-semibold tracking-tight text-accent">
              {bankroll.toLocaleString()}
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="font-label text-xs text-ink-muted">Streak</span>
            <div className="mt-0.5 font-mono text-xl sm:text-2xl font-semibold text-gold">
              {loginStreak}
            </div>
          </div>
        </div>

        <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] flex-shrink-0">
          <div
            className="w-full h-full transition-transform duration-[4s] ease-[cubic-bezier(0.17,0.67,0.12,0.99)]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
              {segments.map((seg, i) => (
                <g key={i}>
                  <path d={seg.path} fill={seg.color} stroke="#1a1a2e" strokeWidth="1.5" />
                  <text
                    x={seg.tx}
                    y={seg.ty}
                    transform={`rotate(${seg.finalRot}, ${seg.tx}, ${seg.ty})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontWeight="700"
                    fontSize="16"
                    fontFamily="ui-monospace, monospace"
                  >
                    {seg.value}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <svg width="24" height="20" viewBox="0 0 24 20">
              <polygon points="12,20 0,0 24,0" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <svg width="16" height="16" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="12" fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {showResult && result && (
          <div className="rounded-lg bg-emerald-soft px-5 py-2.5 text-center">
            <p className="font-document text-sm text-emerald">
              +{result.bonus.toLocaleString()} chips{result.streak >= 7 ? " (max streak!)" : ""}
            </p>
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={todayClaimed || spinning}
          className="min-w-[140px] rounded-lg bg-gold-soft px-6 py-3 font-label text-xs text-gold transition-all hover:bg-gold-soft/80 disabled:opacity-40 active:scale-[0.97]"
        >
          {spinning ? "Spinning..." : todayClaimed ? "Claimed Today" : "Spin the Wheel"}
        </button>
      </div>
    </div>
  );
}
