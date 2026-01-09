/*
  # Add divider position preference to profiles

  1. Changes
    - Adds `divider_position` column to profiles table
    - Stores user's preferred height for the categories section in the log screen
    - Default value is 140 (pixels), providing reasonable initial spacing

  2. Details
    - Column type: integer (represents height in pixels)
    - Nullable: false (uses default if not set)
    - Default: 140 (balanced starting height for categories section)

  3. Notes
    - This preference is saved when user drags the divider handle
    - Used to restore user's preferred layout on app launch
    - Value represents the height of the categories section above the hour grid
*/

-- Add divider_position column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'divider_position'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN divider_position integer DEFAULT 140 NOT NULL;
  END IF;
END $$;
