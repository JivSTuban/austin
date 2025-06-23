import { supabase } from './supabase';

const log = (...args: unknown[]) => console.log('[ForumHelpers]', ...args);

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

export const updateForumThread = async (
  threadId: number,
  userId: string,
  data: {
    title: string;
    content: string;
    category: string;
  }
) => {
  log('Updating forum thread:', { threadId, userId, data });

  try {
    // First check if user owns this thread
    log('Checking thread ownership');
    const { data: thread, error: getError } = await supabase
      .from('forum_threads')
      .select('author_id')
      .eq('id', threadId)
      .single();

    if (getError) {
      log('Error checking thread ownership:', getError);
      console.error('Full error details:', JSON.stringify(getError));
      throw new Error('Failed to verify thread ownership');
    }

    log('Thread data retrieved:', thread);

    if (!thread) {
      log('Thread not found');
      throw new Error('Thread not found');
    }

    if (thread.author_id !== userId) {
      log('Unauthorized update attempt. Thread author_id:', thread.author_id, 'User ID:', userId);
      throw new Error('You do not have permission to update this thread');
    }

    // Update the thread
    log('Updating thread with data:', data);
    const { error: updateError } = await supabase
      .from('forum_threads')
      .update({
        title: data.title,
        excerpt: data.content,
        category: data.category
      })
      .eq('id', threadId)
      .eq('author_id', userId); // Extra security check

    if (updateError) {
      log('Thread update error:', updateError);
      console.error('Full update error details:', JSON.stringify(updateError));
      throw new Error(`Failed to update thread: ${updateError.message}`);
    }

    log('Thread updated successfully');
    return { success: true, threadId };
  } catch (error) {
    log('Error in updateForumThread:', error);
    throw error;
  }
};

export const deleteForumThread = async (threadId: number, userId: string) => {
  log('Deleting forum thread:', { threadId, userId });

  try {
    // First check if user owns this thread
    const { data: thread, error: getError } = await supabase
      .from('forum_threads')
      .select('author_id')
      .eq('id', threadId)
      .single();

    if (getError) {
      log('Error checking thread ownership:', getError);
      throw new Error('Failed to verify thread ownership');
    }

    if (thread.author_id !== userId) {
      log('Unauthorized delete attempt');
      throw new Error('You do not have permission to delete this thread');
    }

    // Delete the thread
    const { error: deleteError } = await supabase
      .from('forum_threads')
      .delete()
      .eq('id', threadId);

    if (deleteError) {
      log('Thread deletion error:', deleteError);
      throw new Error('Failed to delete thread');
    }

    log('Thread deleted successfully');
    return { success: true };
  } catch (error) {
    log('Error in deleteForumThread:', error);
    throw error;
  }
};
