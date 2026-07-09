-- Add entry_stake column to game_sessions for variable stake support
ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS entry_stake INT NOT NULL DEFAULT 10;
