-- Enable RLS
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;

-- Update forum_threads table to ensure date and replies_count have defaults
ALTER TABLE forum_threads 
  ALTER COLUMN date SET DEFAULT now(),
  ALTER COLUMN replies_count SET DEFAULT 0;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS create_forum_thread_with_profile;
DROP FUNCTION IF EXISTS get_thread_with_profile;

-- Function to create a forum thread with profile check
CREATE OR REPLACE FUNCTION create_forum_thread_with_profile(
    p_user_id UUID,
    p_title TEXT,
    p_excerpt TEXT,
    p_category TEXT,
    p_username TEXT,
    p_avatar_url TEXT
)
RETURNS forum_threads
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_profile_exists INTEGER;
    v_thread forum_threads;
BEGIN
    -- Check if profile exists
    SELECT COUNT(*) INTO v_profile_exists
    FROM profiles
    WHERE id = p_user_id;

    -- Create profile if it doesn't exist
    IF v_profile_exists = 0 THEN
        INSERT INTO profiles (id, username, avatar_url)
        VALUES (p_user_id, p_username, p_avatar_url);
    END IF;

    -- Create thread
    INSERT INTO forum_threads (title, author_id, excerpt, category)
    VALUES (p_title, p_user_id, p_excerpt, p_category)
    RETURNING * INTO v_thread;

    RETURN v_thread;
END;
$$;

-- Function to get thread with profile
CREATE OR REPLACE FUNCTION get_thread_with_profile(p_thread_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    author_id UUID,
    date TIMESTAMPTZ,
    replies_count INTEGER,
    excerpt TEXT,
    category TEXT,
    author_username TEXT,
    author_avatar_url TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.title,
        t.author_id,
        t.date,
        t.replies_count,
        t.excerpt,
        t.category,
        p.username AS author_username,
        p.avatar_url AS author_avatar_url
    FROM forum_threads t
    LEFT JOIN profiles p ON t.author_id = p.id
    WHERE t.id = p_thread_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_forum_thread_with_profile TO authenticated;
GRANT EXECUTE ON FUNCTION get_thread_with_profile TO authenticated;

-- Update policies
DROP POLICY IF EXISTS "Anyone can read forum threads" ON forum_threads;
DROP POLICY IF EXISTS "Authenticated users can create threads" ON forum_threads;

CREATE POLICY "Anyone can read forum threads"
ON forum_threads FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create threads"
ON forum_threads FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- Add indices for better performance
CREATE INDEX IF NOT EXISTS idx_forum_threads_author_id ON forum_threads(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_category ON forum_threads(category);
CREATE INDEX IF NOT EXISTS idx_forum_threads_date ON forum_threads(date DESC);
