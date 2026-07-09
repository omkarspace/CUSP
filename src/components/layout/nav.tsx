"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "./auth-button";
import { ThemeToggle } from "./theme-toggle";
import { MobileBottomNav } from "./mobile-bottom-nav";

interface NavProps {
  userEmail?: string;
}

const links = [
  { href: "/dashboard", label: "Play" },
  { href: "/leaderboard", label: "The Board" },
  { href: "/profile", label: "Profile" },
];

export function Nav({ userEmail }: NavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
            CUSP
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 font-label transition-colors ${
                    active ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <ThemeToggle />
            <AuthButton email={userEmail} />
          </div>
        </div>
      </nav>

      <MobileBottomNav userEmail={userEmail} />
    </>
  );
}
