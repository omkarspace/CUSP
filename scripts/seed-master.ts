/**
 * Seed script: Creates a master account with 1000 bankroll.
 *
 * Uses the Supabase Auth REST API directly (no service_role / secret key needed).
 * Steps:
 *   1. Signs up master@cusp.game via the /auth/v1/signup endpoint
 *   2. Upserts the profile row with 1000 bankroll via the REST API
 *
 * Usage:  npx tsx scripts/seed-master.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load .env.local ─────────────────────────────────────────────────────────
const envPath = resolve(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const ANON_KEY = env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
const SERVICE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("❌  Missing SUPABASE_URL or PUBLISHABLE_KEY in .env.local");
  process.exit(1);
}

// ── Master account details ──────────────────────────────────────────────────
const MASTER_EMAIL = "master@gmail.com";
const MASTER_PASSWORD = "CuspMaster2026!";
const MASTER_USERNAME = "THE_HOUSE";
const STARTING_BANKROLL = 1000;

async function main() {
  console.log("🎰  Creating master account…\n");

  // ── Step 1: Sign up via Auth REST API ─────────────────────────────────────
  console.log("→ Signing up via Supabase Auth API…");

  const signUpRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
    },
    body: JSON.stringify({
      email: MASTER_EMAIL,
      password: MASTER_PASSWORD,
      data: { username: MASTER_USERNAME },
    }),
  });

  const signUpBody = await signUpRes.json();

  let userId: string;

  if (!signUpRes.ok) {
    // If user already exists, try to sign in instead
    if (
      signUpBody?.msg?.includes("already registered") ||
      signUpBody?.error_description?.includes("already registered") ||
      signUpBody?.message?.includes("already registered") ||
      signUpBody?.code === "user_already_exists"
    ) {
      console.log("⚠️  User already exists — signing in to get user ID…");
      const signInRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
        },
        body: JSON.stringify({
          email: MASTER_EMAIL,
          password: MASTER_PASSWORD,
        }),
      });

      const signInBody = await signInRes.json();
      if (!signInRes.ok) {
        console.error("❌  Sign-in also failed:", JSON.stringify(signInBody, null, 2));
        console.error("\n   The user exists but may have a broken password hash.");
        console.error("   Run the cleanup SQL in 002_seed_master_account.sql first,");
        console.error("   then re-run this script.");
        process.exit(1);
      }

      userId = signInBody.user.id;
    } else {
      console.error("❌  Signup failed:", JSON.stringify(signUpBody, null, 2));
      process.exit(1);
    }
  } else {
    userId = signUpBody.id || signUpBody.user?.id;
    if (!userId) {
      console.error("❌  Unexpected signup response:", JSON.stringify(signUpBody, null, 2));
      process.exit(1);
    }
    console.log(`✅  Auth user created: ${userId}`);
  }

  // ── Step 2: Upsert profile via REST API ───────────────────────────────────
  console.log("→ Upserting profile with 1000 bankroll…");

  // Try with service key first; if it fails, use the access token from sign-in
  const apiKey = SERVICE_KEY || ANON_KEY;

  // Sign in to get a valid access token for the profile upsert
  const tokenRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
    },
    body: JSON.stringify({
      email: MASTER_EMAIL,
      password: MASTER_PASSWORD,
    }),
  });

  const tokenBody = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error("❌  Could not sign in to get access token:", JSON.stringify(tokenBody, null, 2));
    console.error("\n   The user may need email confirmation.");
    console.error("   Run this SQL in the Supabase SQL Editor to confirm the email:");
    console.error(`   UPDATE auth.users SET email_confirmed_at = now() WHERE email = '${MASTER_EMAIL}';`);
    process.exit(1);
  }

  const accessToken = tokenBody.access_token;

  // Upsert profile using the access token
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?on_conflict=id`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: userId,
        username: MASTER_USERNAME,
        bankroll: STARTING_BANKROLL,
        heat_streak: 0,
        highest_ever_bankroll: STARTING_BANKROLL,
        total_games_played: 0,
        total_wins: 0,
        total_bankruptcies: 0,
        login_streak: 0,
        last_login_date: null,
        comps_level: "BRONZE",
        lifetime_chips_earned: 0,
        weekly_chips_earned: 0,
      }),
    }
  );

  if (!profileRes.ok) {
    const err = await profileRes.text();
    console.error("❌  Profile upsert failed:", err);
    process.exit(1);
  }

  console.log("✅  Profile upserted with 1,000 chip bankroll");
  console.log("");
  console.log("╔══════════════════════════════════════════╗");
  console.log("║        🎰  MASTER ACCOUNT READY  🎰      ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(`║  Email:    ${MASTER_EMAIL.padEnd(28)} ║`);
  console.log(`║  Password: ${MASTER_PASSWORD.padEnd(28)} ║`);
  console.log(`║  Username: ${MASTER_USERNAME.padEnd(28)} ║`);
  console.log(`║  Bankroll: ${String(STARTING_BANKROLL).padEnd(28)} ║`);
  console.log(`║  User ID:  ${userId.substring(0, 28).padEnd(28)} ║`);
  console.log("╚══════════════════════════════════════════╝");
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err);
  process.exit(1);
});
