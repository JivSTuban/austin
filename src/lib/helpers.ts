import { supabase } from './supabase';

const log = (...args: any[]) => console.log('[ForumHelpers]', ...args);

export const ensureProfile = async (userId: string, email: string | undefined, avatarUrl: string | undefined) => {
  log('Ensuring profile exists:', { userId, email });

  const { data: profile, error: getProfileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (getProfileError || !profile) {
    log('Creating new profile');
    // Create profile if it doesn't exist
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: email,
        avatar_url: avatarUrl
      });

    if (createError) {
      log('Profile creation error:', createError);
      throw new Error('Failed to create profile');
    }
  }

  return profile;
};

export const createForumThread = async (
  userId: string,
  email: string | undefined,
  avatarUrl: string | undefined,
  data: {
    title: string;
    content: string;
    category: string;
  }
) => {
  log('Creating forum thread:', { userId, email, data });

  try {
    // First ensure profile exists
    await ensureProfile(userId, email, avatarUrl);
    log('Profile ensured');

    // Create thread using stored procedure
    log('Creating thread with stored procedure');
    const { data: thread, error: createError } = await supabase
      .rpc('create_forum_thread_with_profile', {
        p_user_id: userId,
        p_title: data.title,
        p_excerpt: data.content,
        p_category: data.category,
        p_username: email,
        p_avatar_url: avatarUrl
      });

    if (createError) {
      log('Thread creation error:', createError);
      throw new Error('Failed to create thread');
    }

    // Get full thread data with profile
    const { data: fullThread, error: getError } = await supabase
      .rpc('get_thread_with_profile', { p_thread_id: thread.id });

    if (getError) {
      log('Error getting thread details:', getError);
      throw new Error('Failed to get thread details');
    }

    log('Thread created successfully:', fullThread);
    return {
      ...fullThread,
      profiles: [{
        username: email || '',
        avatar_url: avatarUrl || null
      }]
    };
  } catch (error) {
    log('Error in createForumThread:', error);
    throw error;
  }
};
