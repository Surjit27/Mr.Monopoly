/*
  # Game Tables Setup

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `role` (text)
      - `money` (integer)
      - `position` (integer)
      - `color` (text)
      - `created_at` (timestamp)
    - `game_state`
      - `id` (uuid, primary key)
      - `current_player` (integer)
      - `game_started` (boolean)
      - `last_dice_roll` (integer)
      - `created_at` (timestamp)
    - `player_assets`
      - `id` (uuid, primary key)
      - `player_id` (uuid, references players)
      - `property_id` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  money integer NOT NULL DEFAULT 5000,
  position integer NOT NULL DEFAULT 0,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create game_state table
CREATE TABLE IF NOT EXISTS game_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_player integer NOT NULL DEFAULT 0,
  game_started boolean NOT NULL DEFAULT false,
  last_dice_roll integer,
  created_at timestamptz DEFAULT now()
);

-- Create player_assets table
CREATE TABLE IF NOT EXISTS player_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players NOT NULL,
  property_id integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_assets ENABLE ROW LEVEL SECURITY;

-- Policies for players table
CREATE POLICY "Users can read all players"
  ON players
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own player"
  ON players
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own player"
  ON players
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for game_state table
CREATE POLICY "Users can read game state"
  ON game_state
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update game state"
  ON game_state
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert game state"
  ON game_state
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for player_assets table
CREATE POLICY "Users can read all assets"
  ON player_assets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own assets"
  ON player_assets
  FOR ALL
  TO authenticated
  USING (
    player_id IN (
      SELECT id FROM players WHERE user_id = auth.uid()
    )
  );