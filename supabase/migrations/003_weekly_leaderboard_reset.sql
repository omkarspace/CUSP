-- Weekly leaderboard reset procedure
-- Run this in Supabase SQL Editor
-- Requires pg_cron extension: CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Drop if exists for idempotency
DROP PROCEDURE IF EXISTS reset_weekly_board;

CREATE OR REPLACE PROCEDURE reset_weekly_board()
LANGUAGE plpgsql
AS $$
BEGIN
  -- Award prizes to top 50 based on weekly_chips_earned
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
  INSERT INTO public.trophies (user_id, trophy_id)
  SELECT id, 'board_king'
  FROM profiles
  ORDER BY weekly_chips_earned DESC
  LIMIT 1
  ON CONFLICT (user_id, trophy_id) DO NOTHING;

  -- Reset weekly chips for all remaining players
  UPDATE profiles
  SET weekly_chips_earned = 0
  WHERE weekly_chips_earned > 0;
END;
$$;

-- Schedule with pg_cron every Monday 00:00
-- SELECT cron.schedule('weekly-board-reset', '0 0 * * 1', $$CALL reset_weekly_board();$$);
