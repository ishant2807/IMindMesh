-- ============================================
-- Supabase Authentication Setup
-- ============================================
-- Run this SQL in Supabase SQL Editor to set up authentication

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for profiles table

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role can do everything (for backend)
CREATE POLICY "Service role full access"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- 4. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Create First Admin User
-- ============================================
-- After running the above, create your admin account:
-- 1. Sign up through the app with your email
-- 2. Then run this SQL to make yourself admin:

-- UPDATE profiles
-- SET role = 'admin'
-- WHERE email = 'your-email@example.com';

-- ============================================
-- Verify Setup
-- ============================================
-- Check if profiles table exists:
-- SELECT * FROM profiles;

-- Check policies:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
