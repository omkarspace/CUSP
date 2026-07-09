import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HeroEnter, SectionReveal, StaggerGrid, StaggerItem } from "@/components/landing/animations";
import { GameGridPreview } from "@/components/landing/game-grid";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6">
      <nav className="flex items-center justify-between py-5">
        <span className="text-lg font-semibold tracking-tight text-ink">CUSP</span>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="rounded-lg border border-border px-4 py-2.5 font-label text-xs text-ink-muted transition-all hover:text-ink hover:border-ink/30 active:scale-[0.97]"
          >
            Sign In
          </a>
          <a
            href="/login"
            className="hidden sm:inline-flex rounded-lg bg-accent px-4 py-2.5 font-label text-xs text-white transition-all hover:opacity-90 active:scale-[0.97]"
          >
            Get Started
          </a>
        </div>
      </nav>

      <HeroEnter>
        <section className="flex flex-col items-center py-24 sm:py-32 text-center">
          <span className="font-mono text-[clamp(3.5rem,10vw,6rem)] font-bold leading-[1.05] tracking-[-0.04em] text-ink">
            CUSP
          </span>
          <p className="mt-4 text-[clamp(1.125rem,3vw,1.5rem)] font-medium text-ink-secondary max-w-xl" style={{ textWrap: "balance" }}>
            On the edge of a win
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted max-w-md" style={{ textWrap: "balance" }}>
            Every guess is a transaction. Wager chips on each round, solve the word, collect your payout — or walk away empty.
          </p>
          <a
            href="/login"
            className="mt-10 inline-flex items-center gap-1.5 rounded-lg bg-accent px-7 py-3.5 font-label text-xs text-white transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Start Playing
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </section>
      </HeroEnter>

      <SectionReveal>
        <section className="border-t border-border py-20 sm:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 sm:gap-14 sm:flex-row sm:items-start">
            <div className="flex-shrink-0 w-[200px]">
              <GameGridPreview />
            </div>
            <div className="sm:pt-2">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                The daily word.<br />Real stakes.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary max-w-sm">
                Six rows. Five letters. Each guess costs chips from your escrow. Correct letters lock in payouts. The wrong ones drain your stack. Walk away with your winnings — or double down and chase more.
              </p>
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <span className="font-label text-xs text-ink-muted">Rows</span>
                  <div className="mt-0.5 font-mono text-lg font-semibold text-ink">6</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <span className="font-label text-xs text-ink-muted">Letters</span>
                  <div className="mt-0.5 font-mono text-lg font-semibold text-ink">5</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <span className="font-label text-xs text-ink-muted">Payout</span>
                  <div className="mt-0.5 font-mono text-lg font-semibold text-accent">×Hot Streak</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <section className="border-t border-border py-20 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <StaggerGrid className="grid gap-10 sm:grid-cols-3 sm:gap-8">
              <StaggerItem>
                <div className="flex flex-col items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="7" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3" /><path d="M12 19v3" />
                      <path d="M2 12h3" /><path d="M19 12h3" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-ink">Place Your Bet</h3>
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    Wager chips on each round. Choose your stake, commit to the escrow. Every guess costs — but every correct letter pays.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex flex-col items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-soft text-gold">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M6 8h4" /><path d="M14 8h4" />
                      <path d="M6 12h4" /><path d="M14 12h4" />
                      <path d="M6 16h8" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-ink">Guess the Word</h3>
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    Wordle-style feedback on a 5×6 board. Green locks your payout. Gold means you&apos;re close. Gray means you lose that row&apos;s chips.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex flex-col items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V20" />
                      <path d="M14 14.66V20" />
                      <path d="M4 22V12" />
                      <path d="M20 22V12" />
                      <path d="M12 10V4" />
                      <path d="M8 4l4 4 4-4" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-ink">Climb the Board</h3>
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    Build streaks to multiply payouts. Unlock The Penthouse. Post your weekly earnings to the leaderboard and earn trophies.
                  </p>
                </div>
              </StaggerItem>
            </StaggerGrid>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.15}>
        <section className="border-t border-border py-20 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-6">
                <span className="font-label text-xs text-accent">Daily</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">The Daily Jackpot</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">One shot per day. Fixed 10-chip entry. Your score posts to The Board.</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-6">
                <span className="font-label text-xs text-gold">Infinite</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">The Grind</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">Endless play. Starts easy, gets harder each round. Chips carry over.</p>
              </div>
              <div className="rounded-xl border border-gold/40 bg-gold-soft p-6">
                <span className="font-label text-xs text-gold">High Roller</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">The Penthouse</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">5K chips and a 3-win streak to enter. 2× payouts. The big leagues.</p>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.1}>
        <section className="border-t border-border py-24 sm:py-32">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink" style={{ textWrap: "balance" }}>
              Ready to put chips on the line?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-secondary" style={{ textWrap: "balance" }}>
              Every guess is a transaction. Make it count.
            </p>
            <a
              href="/login"
              className="mt-8 inline-flex items-center gap-1.5 rounded-lg bg-accent px-7 py-3.5 font-label text-xs text-white transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Start Playing
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </SectionReveal>

      <footer className="border-t border-border py-8">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <span className="font-mono text-sm font-semibold tracking-tight text-ink">CUSP</span>
          <div className="flex items-center gap-4">
            <a href="/leaderboard" className="font-label text-xs text-ink-muted transition-colors hover:text-ink">The Board</a>
            <a href="/profile" className="font-label text-xs text-ink-muted transition-colors hover:text-ink">Profile</a>
            <span className="text-xs text-ink-muted">&copy; 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
