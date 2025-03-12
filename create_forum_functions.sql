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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_forum_thread_with_profile TO authenticated;

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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_thread_with_profile TO authenticated;
