"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PwaManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showNetworkToast, setShowNetworkToast] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register service worker and handle updates
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg);

          // Check if worker is already waiting
          if (reg.waiting) {
            setUpdateAvailable(true);
          }

          // Listen for new workers installing
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error("PWA Service worker registration failed:", err);
        });

      // Listen for controllerchange to reload page when updating
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Monitor online / offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowNetworkToast(true);
      const timer = setTimeout(() => setShowNetworkToast(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNetworkToast(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Don't show if already in standalone display mode
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone === true;

      // Also check if we already prompted in this session
      const hasDismissed = sessionStorage.getItem("pwa-prompt-dismissed") === "true";

      if (!isStandalone && !hasDismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User installation choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
    setShowInstallPrompt(false);
  };

  const handleReloadUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <AnimatePresence>
        {/* Custom PWA Install Banner */}
        {showInstallPrompt && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-border bg-surface p-5 shadow-2xl sm:bottom-6"
          >
            <div className="flex gap-4">
              {/* App logo badge */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-dark-surface-elevated border border-accent/20">
                <span className="font-mono text-xl font-bold text-accent">C</span>
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-label text-sm font-semibold text-ink">Install CUSP App</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Wager chips in full-screen standalone mode. Add CUSP to your home screen for near-instant loading and offline fallback support.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleInstallClick}
                    className="rounded-lg bg-accent px-4 py-2 font-label text-[11px] text-white transition-all hover:bg-accent-dark active:scale-[0.97]"
                  >
                    Install Now
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="rounded-lg border border-border px-3 py-2 font-label text-[11px] text-ink-secondary transition-all hover:bg-surface-elevated hover:text-ink active:scale-[0.97]"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Network Connectivity Toast */}
        {showNetworkToast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 180 }}
            className="fixed top-4 left-4 right-4 z-[9999] mx-auto max-w-sm rounded-lg border px-4 py-3 shadow-lg flex items-center gap-3"
            style={{
              backgroundColor: isOnline ? "var(--accent-soft, #E8F4F4)" : "var(--rose-soft, #FDF0F0)",
              borderColor: isOnline ? "var(--accent, #0D7377)" : "var(--rose, #B84A4A)",
              color: isOnline ? "var(--accent-dark, #0A5C5E)" : "var(--rose, #B84A4A)",
            }}
          >
            {isOnline ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="font-label text-xs font-semibold">Connection restored. Back online.</span>
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.5M5 12.5a10.94 10.94 0 0 1 5.83-2.84M8.5 16.5a4.48 4.48 0 0 1 7 0M12 20h.01" />
                </svg>
                <span className="font-label text-xs font-semibold">Offline. Play wagers require a connection.</span>
              </>
            )}
          </motion.div>
        )}

        {/* Update Available Prompt */}
        {updateAvailable && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-gold/30 bg-gold-soft p-4 shadow-2xl text-gold"
          >
            <div className="flex gap-4 items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-label text-sm font-semibold">Update Available</h3>
                <p className="text-xs opacity-90 leading-relaxed">
                  A newer version of the casino table has been downloaded.
                </p>
              </div>
              <button
                onClick={handleReloadUpdate}
                className="rounded-lg bg-gold px-4 py-2 font-label text-[11px] text-white transition-all hover:bg-gold/90 shrink-0 active:scale-[0.97]"
              >
                Reload
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
