"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { AuthButton } from "./auth-button";

interface MobileBottomNavProps {
  userEmail?: string;
}

const items = [
  {
    href: "/dashboard",
    label: "Play",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    href: "/leaderboard",
    label: "Board",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5" />
        <path d="M4 22h16" />
        <path d="M10 14.66V20" />
        <path d="M14 14.66V20" />
        <path d="M4 22V12" />
        <path d="M20 22V12" />
        <path d="M12 10V4" />
        <path d="M8 4h8l-4 4" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
  },
];

export function MobileBottomNav({ userEmail }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname.startsWith("/play/")) return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-canvas/95 backdrop-blur-lg sm:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
                  active ? "text-accent" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.icon}
                <span className="font-label text-[10px]">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-ink-muted hover:text-ink transition-colors"
            aria-label="More options"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="19" cy="12" r="1" fill="currentColor" />
              <circle cx="5" cy="12" r="1" fill="currentColor" />
            </svg>
            <span className="font-label text-[10px]">More</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 sm:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-surface pb-8 sm:hidden"
            >
              <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-label text-xs text-ink-muted">Settings</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-muted">{userEmail || "Signed in"}</span>
                  <AuthButton email={userEmail} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
