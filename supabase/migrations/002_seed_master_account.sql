-- ============================================================
-- CUSP: Finalize Master Account (master@gmail.com)
-- The auth user was already created via the signup API.
-- This confirms the email and seeds the profile.
-- Run in Supabase SQL Editor.
-- ============================================================

-- 1. Confirm the email so login works
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'master@gmail.com'
  AND email_confirmed_at IS NULL;

-- 2. Create the profile with 1000 bankroll
INSERT INTO profiles (
  id,
  username,
  bankroll,
  heat_streak,
  highest_ever_bankroll,
  total_games_played,
  total_wins,
  total_bankruptcies,
  login_streak,
  last_login_date,
  comps_level,
  lifetime_chips_earned,
  weekly_chips_earned
)
SELECT
  u.id,
  'THE_HOUSE',
  1000,
  0,
  1000,
  0,
  0,
  0,
  0,
  NULL,
  'BRONZE',
  0,
  0
FROM auth.users u
WHERE u.email = 'master@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  bankroll = 1000,
  username = 'THE_HOUSE',
  highest_ever_bankroll = GREATEST(profiles.highest_ever_bankroll, 1000);

-- 3. Verify everything
SELECT
  u.id AS user_id,
  u.email,
  u.email_confirmed_at IS NOT NULL AS email_confirmed,
  p.username,
  p.bankroll,
  p.comps_level
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'master@gmail.com';
