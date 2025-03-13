import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Clock } from 'lucide-react';

// Define the shape of profile data
interface Profile {
  username: string;
  avatar_url: string | null;
}

// Define the shape of a reply from the database
interface Reply {
  id: number;
  content: string;
  created_at: string;
  author_id: string;
  thread_id: number;
  profiles: Profile | null;
}

// Define the shape of raw data from Supabase
interface RawReplyData {
  id: number;
  content: string;
  created_at: string;
  author_id: string;
  thread_id: number;
  profiles: any; // This can be an array or an object depending on the query
}

interface ThreadRepliesProps {
  threadId: number;
}

const ThreadReplies = ({ threadId }: ThreadRepliesProps) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Helper function to extract profile data safely
  const extractProfileData = (profileData: any): Profile => {
    if (!profileData) {
      return { username: 'Anonymous', avatar_url: null };
    }
    
    if (Array.isArray(profileData)) {
      if (profileData.length === 0) {
        return { username: 'Anonymous', avatar_url: null };
      }
      return {
        username: profileData[0]?.username || 'Anonymous',
        avatar_url: profileData[0]?.avatar_url || null
      };
    }
    
    return {
      username: profileData.username || 'Anonymous',
      avatar_url: profileData.avatar_url || null
    };
  };

  const fetchReplies = useCallback(async () => {
    try {
      console.log('Fetching replies for thread:', threadId);
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          id,
          thread_id,
          author_id,
          content,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching replies:', error);
        throw error;
      }

      console.log('Replies data:', data);
      if (data) {
        // Transform the data to match the Reply interface
        const formattedReplies = data.map((rawReply: RawReplyData) => ({
          id: rawReply.id,
          thread_id: rawReply.thread_id,
          author_id: rawReply.author_id,
          content: rawReply.content,
          created_at: rawReply.created_at,
          profiles: extractProfileData(rawReply.profiles)
        }));
        
        setReplies(formattedReplies);
      }
    } catch (error: unknown) {
      console.error('Full error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to load replies', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchReplies();

    // Subscribe to new replies
    const channel = supabase
      .channel('forum_replies')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_replies',
          filter: `thread_id=eq.${threadId}`
        },
        () => {
          fetchReplies();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, fetchReplies]);

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to reply');
      return;
    }
    if (!newReply.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmitting(true);
    try {
      console.log('Submitting reply:', {
        thread_id: threadId,
        author_id: user.id,
        content: newReply.trim()
      });
      
      const { data, error } = await supabase
        .from('forum_replies')
        .insert([
          {
            thread_id: threadId,
            author_id: user.id,
            content: newReply.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error posting reply:', error);
        throw error;
      }

      console.log('Reply posted successfully:', data);
      setNewReply('');
      toast.success('Reply posted successfully');
      await fetchReplies();
    } catch (error: unknown) {
      console.error('Full error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to post reply', {
        description: errorMessage
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-4 border rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {replies.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No replies yet. Be the first to reply!
          </div>
        ) : (
          replies.map((reply) => (
            <div
              key={reply.id}
              className="p-4 border rounded-lg bg-white/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    {reply.profiles?.username?.[0]?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {reply.profiles?.username || 'Anonymous'}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(reply.created_at)}
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply form */}
      {user && (
        <form onSubmit={handleSubmitReply} className="space-y-4">
          <Textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your reply..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center"
            >
              {submitting ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Reply
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ThreadReplies;
