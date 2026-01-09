/*
  # Add automatic profile creation trigger

  1. Purpose
    - Automatically creates a profile record when a new user signs up
    - Ensures data integrity between auth.users and public.profiles
    - Prevents foreign key constraint violations

  2. Changes
    - Creates a trigger function to insert profile on user creation
    - Adds trigger to execute function on auth.users insert

  3. Security
    - Function runs with SECURITY DEFINER to bypass RLS
    - Only executes on INSERT to auth.users table
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
