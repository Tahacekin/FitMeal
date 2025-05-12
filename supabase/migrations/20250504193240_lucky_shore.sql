/*
  # Create user profiles and preferences tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `fitness_goal` (text)
      - `weekly_budget` (numeric)
      - `weight` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `dietary_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `allergies` (text[])
      - `cuisine_preferences` (text[])
      - `meal_complexity` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `favorite_meals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `meal_name` (text)
      - `recipe` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fitness_goal text CHECK (fitness_goal IN ('fit', 'bulk', 'healthy')),
  weekly_budget numeric CHECK (weekly_budget > 0),
  weight numeric CHECK (weight > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dietary_preferences table
CREATE TABLE IF NOT EXISTS dietary_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  allergies text[],
  cuisine_preferences text[],
  meal_complexity text CHECK (meal_complexity IN ('easy', 'medium', 'advanced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create favorite_meals table
CREATE TABLE IF NOT EXISTS favorite_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  meal_name text NOT NULL,
  recipe jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_meals ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for dietary_preferences
CREATE POLICY "Users can view own preferences"
  ON dietary_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON dietary_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own preferences"
  ON dietary_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policies for favorite_meals
CREATE POLICY "Users can view own favorites"
  ON favorite_meals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own favorites"
  ON favorite_meals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON favorite_meals
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dietary_preferences_updated_at
  BEFORE UPDATE ON dietary_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();