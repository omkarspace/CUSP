const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cusp-game.vercel.app";

const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CUSP",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  description: "On the edge of a win — every guess is a transaction. Wager chips on each round, solve the word, collect your payout.",
  url: siteUrl,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "CUSP", url: siteUrl },
  browserRequirements: "Requires JavaScript",
  screenshot: `${siteUrl}/opengraph-image.png`,
  featureList: [
    "Daily word puzzle with chip wagering",
    "Infinite mode with escalating difficulty",
    "High roller Penthouse mode",
    "Leaderboard with weekly prizes",
    "Power-ups and hints (peek, card count, insurance)",
    "Hot streak multiplier system",
  ],
};

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to play CUSP",
  description: "Wager chips, guess the word, collect your payout.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Place Your Bet", text: "Choose a game mode and stake. Chips go into escrow." },
    { "@type": "HowToStep", position: 2, name: "Guess the Word", text: "Type a 5-letter word. Green tiles lock in payout. Gold means close. Gray means that row's chips are lost." },
    { "@type": "HowToStep", position: 3, name: "Climb the Board", text: "Build streaks to multiply payouts. Unlock The Penthouse. Post weekly earnings to the leaderboard." },
  ],
};

const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question", name: "What is CUSP?",
      acceptedAnswer: { "@type": "Answer", text: "CUSP is a word game where every guess costs chips. Solve the word to win payouts. Choose your stake, manage risk, and climb the leaderboard." },
    },
    {
      "@type": "Question", name: "Is CUSP free to play?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You start with a free bankroll of chips. Additional chips can be earned through daily logins, winning games, and leaderboard prizes." },
    },
    {
      "@type": "Question", name: "What game modes are available?",
      acceptedAnswer: { "@type": "Answer", text: "The Daily Jackpot (once per day), The Grind (infinite mode), and The Penthouse (high roller with 2x payouts)." },
    },
    {
      "@type": "Question", name: "How does the scoring work?",
      acceptedAnswer: { "@type": "Answer", text: "Each row has a cost and payout. Guessing earlier rows pays more. Hot streaks multiply your winnings. Double Down doubles the risk for triple the payout." },
    },
  ],
};

export function JsonLd() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
