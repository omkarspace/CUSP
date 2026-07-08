"use client";

import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = "/dashboard";
    } else {
      // Small feedback instead of basic alert
      const toast = document.getElementById("offline-retry-toast");
      if (toast) {
        toast.style.opacity = "1";
        setTimeout(() => {
          toast.style.opacity = "0";
        }, 2500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink transition-colors duration-200">
      {/* Minimal Header */}
      <nav className="border-b border-border bg-canvas/80 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-ink">CUSP</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto flex min-h-[75vh] max-w-md flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-full rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          {/* Offline Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-rose-soft text-rose dark:bg-dark-rose-soft dark:text-dark-rose border border-rose/20">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.5M5 12.5a10.94 10.94 0 0 1 5.83-2.84M8.5 16.5a4.48 4.48 0 0 1 7 0M12 20h.01" />
            </svg>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              Connection Lost
            </h1>
            <p className="text-sm leading-relaxed text-ink-secondary">
              High-stakes guessing requires a secure link to the house. Please check your internet connection and try joining the tables again.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRetry}
            className="w-full rounded-lg bg-accent px-6 py-3 font-label text-xs text-white transition-all hover:bg-accent-dark active:scale-[0.98]"
          >
            Retry Connection
          </button>
        </div>

        {/* Temporary warning toast */}
        <div
          id="offline-retry-toast"
          style={{ opacity: 0, transition: "opacity 0.2s ease" }}
          className="fixed bottom-6 mx-auto rounded-lg border border-rose bg-rose-soft px-4 py-2 text-xs font-label text-rose"
        >
          Still disconnected. Verify network connection.
        </div>
      </main>
    </div>
  );
}
