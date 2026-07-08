"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";

interface NavProps {
  userEmail?: string;
}

const links = [
  { href: "/", label: "Lobby" },
  { href: "/dashboard", label: "Hub" },
  { href: "/leaderboard", label: "The Board" },
  { href: "/profile", label: "Profile" },
];

export function Nav({ userEmail }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-tile-border/30 bg-casino-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-neon-green">
          WORDLE CASINO
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? "text-neon-gold shadow-neon-gold"
                    : "text-text-secondary hover:text-text-primary hover:bg-casino-surface-low"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <AuthButton email={userEmail} />
      </div>
    </nav>
  );
}
