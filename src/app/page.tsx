import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      {/* Nav */}
      <nav className="flex items-center justify-between py-4">
        <span className="text-lg font-semibold tracking-tight text-ink">CUSP</span>
        <a
          href="/login"
          className="rounded-lg border border-border px-4 py-2.5 font-label text-xs text-ink-muted transition-colors hover:text-ink active:scale-[0.97]"
        >
          Sign In
        </a>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center py-24 text-center">
        <h1 className="text-[clamp(3rem,8vw,5rem)] font-semibold leading-[1.05] tracking-tight text-ink">
          CUSP
        </h1>
        <p className="mt-3 text-lg text-ink-secondary">
          On the edge of a win
        </p>
        <a
          href="/login"
          className="mt-10 inline-flex items-center rounded-lg bg-accent px-6 py-3 font-label text-xs text-white transition-all hover:bg-accent-dark active:scale-[0.98]"
        >
          Start Playing
        </a>
      </section>

      {/* How to Play */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <span className="font-label text-xs text-ink-muted">How to Play</span>
          <div className="mt-8 grid gap-8 sm:gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Place Your Bet", desc: "Wager chips on each round. Every guess is a transaction — win big or walk away." },
              { step: "02", title: "Guess the Word", desc: "Six rows. Wordle-style feedback. Each correct letter locks in a payout." },
              { step: "03", title: "Climb the Board", desc: "Build streaks, unlock rooms, and earn your place on the weekly leaderboard." },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <span className="font-label text-xs text-ink-muted">{item.step}</span>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
