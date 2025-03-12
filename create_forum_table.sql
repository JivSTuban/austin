-- Enable Row Level Security (RLS) on all tables

-- Create profiles table to store user information, linked to auth.users
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT
);

-- Create a policy to allow users to read their own profile
CREATE POLICY "Users can read their own profile." ON profiles FOR
SELECT
    USING (auth.uid() = id);

-- Create a policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile." ON profiles FOR
UPDATE
    USING (auth.uid() = id);

-- Create forum_threads table (with foreign key to profiles)
CREATE TABLE forum_threads (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    replies_count INTEGER NOT NULL DEFAULT 0,
    excerpt TEXT NOT NULL,
    category TEXT NOT NULL
);

-- Create policies for forum_threads
CREATE POLICY "Anyone can read forum threads." ON forum_threads FOR
SELECT
    USING (true);

CREATE POLICY "Authenticated users can create threads." ON forum_threads FOR
INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Create replies table (with foreign keys to forum_threads and profiles)
CREATE TABLE forum_replies (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id) NOT NULL,
    author_id UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    content TEXT NOT NULL
);

ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for replies
CREATE POLICY "Anyone can read replies." ON forum_replies FOR
SELECT
    USING (true);

CREATE POLICY "Authenticated users can create replies." ON forum_replies FOR
INSERT
    WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Users can update their own replies." ON forum_replies FOR
UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies." ON forum_replies FOR
DELETE
  USING (auth.uid() = author_id);

-- Function to update the replies_count on the forum_threads table
CREATE OR REPLACE FUNCTION update_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE forum_threads SET replies_count = replies_count + 1 WHERE id = NEW.thread_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE forum_threads SET replies_count = replies_count - 1 WHERE id = OLD.thread_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Triggers to call the update_replies_count function
CREATE TRIGGER update_replies_count_insert
AFTER INSERT ON forum_replies
FOR EACH ROW
EXECUTE FUNCTION update_replies_count();

CREATE TRIGGER update_replies_count_delete
AFTER DELETE ON forum_replies
FOR EACH ROW
EXECUTE FUNCTION update_replies_count();

-- Create a function to handle signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the handle_new_user function on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
