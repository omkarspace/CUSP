"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function LoginForm({ error }: { error?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setMessage(null);
  };

  const signInWith = async (provider: "google" | "github") => {
    setLoading(provider);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(mode);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link.");
        setMode("signin");
        resetForm();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Mode toggle */}
      <div className="flex rounded-lg border border-border bg-surface-elevated p-1">
        <button
          onClick={() => { setMode("signin"); setMessage(null); }}
          className={`flex-1 rounded-md px-4 py-2 font-label text-xs transition-colors ${
            mode === "signin"
              ? "bg-accent text-white"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setMode("signup"); setMessage(null); }}
          className={`flex-1 rounded-md px-4 py-2 font-label text-xs transition-colors ${
            mode === "signup"
              ? "bg-accent text-white"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Error / message */}
      {(error || message) && (
        <div
          className={`rounded-lg px-4 py-2 text-center font-label text-xs ${
            message?.includes("Check your email")
              ? "bg-gold-soft text-gold"
              : "bg-rose-soft text-rose"
          }`}
        >
          {error || message}
        </div>
      )}

      {/* Email / Password form */}
      <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block font-label text-xs text-ink-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 sm:py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block font-label text-xs text-ink-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 sm:py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading !== null || !email || !password}
          className="w-full rounded-lg bg-accent px-6 py-3.5 sm:py-3 font-label text-xs text-white transition-all hover:bg-accent-dark disabled:opacity-50 active:scale-[0.97]"
        >
          {loading === mode
            ? "Please wait..."
            : mode === "signup"
            ? "Create Account"
            : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-label text-xs text-ink-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* OAuth buttons */}
      <button
        onClick={() => signInWith("google")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-3.5 sm:py-3 font-label text-xs text-ink transition-colors hover:bg-surface-elevated active:bg-surface-elevated disabled:opacity-50"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        {loading === "google" ? "Connecting..." : "Continue with Google"}
      </button>
      <button
        onClick={() => signInWith("github")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-3.5 sm:py-3 font-label text-xs text-ink transition-colors hover:bg-surface-elevated active:bg-surface-elevated disabled:opacity-50"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
        {loading === "github" ? "Connecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
}
