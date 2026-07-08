-- Engagement & retention features
-- Run this in Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_streak INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS comps_level TEXT DEFAULT 'BRONZE';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifetime_chips_earned INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weekly_chips_earned INT DEFAULT 0;

-- Drop if exists for idempotency
DROP TABLE IF EXISTS trophies;

CREATE TABLE trophies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  trophy_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, trophy_id)
);

-- Also add board_king trophy to the trophies table reference
-- board_king is inserted programmatically when weekly leaderboard resets

-- Weekly leaderboard reset SQL (run every Monday 00:00 via pg_cron or manually):
/*
BEGIN;
  -- Award prizes to top 50
  WITH top AS (
    SELECT id,
      CASE
        WHEN ROW_NUMBER() OVER (ORDER BY weekly_chips_earned DESC) = 1 THEN 500
        WHEN ROW_NUMBER() OVER (ORDER BY weekly_chips_earned DESC) <= 3 THEN 200
        WHEN ROW_NUMBER() OVER (ORDER BY weekly_chips_earned DESC) <= 10 THEN 100
        WHEN ROW_NUMBER() OVER (ORDER BY weekly_chips_earned DESC) <= 50 THEN 25
        ELSE 0
      END AS prize
    FROM profiles
    WHERE weekly_chips_earned > 0
    ORDER BY weekly_chips_earned DESC
    LIMIT 50
  )
  UPDATE profiles p
  SET bankroll = p.bankroll + t.prize,
      weekly_chips_earned = 0
  FROM top t
  WHERE p.id = t.id;

  -- Award "Board King" trophy to #1
  INSERT INTO trophies (user_id, trophy_id)
  SELECT id, 'board_king'
  FROM profiles
  ORDER BY weekly_chips_earned DESC
  LIMIT 1
  ON CONFLICT (user_id, trophy_id) DO NOTHING;
COMMIT;
*/

-- Schedule with pg_cron (requires pg_cron extension):
-- SELECT cron.schedule('weekly-board-reset', '0 0 * * 1', $$CALL reset_weekly_board();$$);
-- Or create a procedure:
/*
CREATE OR REPLACE PROCEDURE reset_weekly_board()
LANGUAGE plpgsql AS $$
BEGIN
  -- (paste the SQL above here)
END;
$$;
*/
