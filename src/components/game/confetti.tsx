"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape: "rect" | "circle";
}

const COLORS = ["#0D7377", "#B8862C", "#EF4444", "#10B981", "#8B5CF6", "#F59E0B", "#3B82F6", "#EC4899"];

const PARTICLE_COUNT = 120;

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2 - 100,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - 8 - Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 6,
        life: 0,
        maxLife: 120 + Math.random() * 60,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    let frame: number;
    const gravity = 0.15;
    const drag = 0.98;

    function tick() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.vy += gravity;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const alpha = 1 - p.life / p.maxLife;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx!.beginPath();
          ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.restore();
      }

      if (particles.length > 0) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
