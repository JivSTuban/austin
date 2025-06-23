import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send, Clock, Edit, Trash2, X, Check } from 'lucide-react';
import { DeleteReplyModal } from './DeleteReplyModal';

interface Profile {
  username: string;
  avatar_url: string | null;
}

interface Reply {
  id: number;
  content: string;
  date: string;
  author_id: string;
  thread_id: number;
  author: Profile;
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
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState<number | null>(null);

  const fetchReplies = useCallback(async () => {
    try {
      console.log('Fetching replies for thread:', threadId);
      const { data, error } = await supabase
        .from('replies')
        .select('*, author:profiles(username, avatar_url)')
        .eq('thread_id', threadId)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching replies:', error);
        toast.error('Failed to load replies', {
          description: error.message
        });
        return;
      }

      if (!data) {
        console.warn('No data returned from query');
        setReplies([]);
        return;
      }

    
      setReplies(data);
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
      .channel('replies')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'replies',
          filter: `thread_id=eq.${threadId}`
        },
        () => {
          fetchReplies();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
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
      const { data, error } = await supabase
        .from('replies')
        .insert([
          {
            thread_id: threadId,
            author_id: user.id,
            content: newReply.trim()
          }
        ])
        .select();

      if (error) {
        console.error('Error posting reply:', error);
        toast.error('Failed to post reply', {
          description: error.message
        });
        return;
      }

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

  const handleEditReply = (reply: Reply) => {
    setEditingReplyId(reply.id);
    setEditContent(reply.content);
  };

  const handleCancelEdit = () => {
    setEditingReplyId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (replyId: number) => {
    if (!user || !editContent.trim()) {
      toast.error('Please enter a valid reply');
      return;
    }

    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('replies')
        .update({ content: editContent.trim() })
        .eq('id', replyId)
        .eq('author_id', user.id); // Ensure user can only edit their own replies

      if (error) {
        console.error('Error updating reply:', error);
        toast.error('Failed to update reply', {
          description: error.message
        });
        return;
      }

      // Update the reply in state
      setReplies(prevReplies => 
        prevReplies.map(reply => 
          reply.id === replyId 
            ? { ...reply, content: editContent.trim() }
            : reply
        )
      );

      setEditingReplyId(null);
      setEditContent('');
      toast.success('Reply updated successfully');
    } catch (error: unknown) {
      console.error('Full error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to update reply', {
        description: errorMessage
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    if (!user) return;

    setReplyToDelete(replyId);
    setShowDeleteModal(true);
  };

  const confirmDeleteReply = async () => {
    if (!user || !replyToDelete) return;

    setDeletingReplyId(replyToDelete);
    try {
      const { error } = await supabase
        .from('replies')
        .delete()
        .eq('id', replyToDelete)
        .eq('author_id', user.id); // Ensure user can only delete their own replies

      if (error) {
        console.error('Error deleting reply:', error);
        toast.error('Failed to delete reply', {
          description: error.message
        });
        return;
      }

      // Remove the reply from state
      setReplies(prevReplies => prevReplies.filter(reply => reply.id !== replyToDelete));
      toast.success('Reply deleted successfully');
    } catch (error: unknown) {
      console.error('Full error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to delete reply', {
        description: errorMessage
      });
    } finally {
      setDeletingReplyId(null);
      setShowDeleteModal(false);
      setReplyToDelete(null);
    }
  };

  const cancelDeleteReply = () => {
    setShowDeleteModal(false);
    setReplyToDelete(null);
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
                  <AvatarImage src={reply.author?.avatar_url || undefined} />
                  <AvatarFallback>
                    {reply.author?.username?.[0]?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {reply.author?.username || 'Anonymous'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(reply.date)}
                      </div>
                      {/* Edit and Delete buttons for own replies */}
                      {user && user.id === reply.author_id && editingReplyId !== reply.id && (
                        <div className="flex items-center space-x-1">
                          <Button
                            onClick={() => handleEditReply(reply)}
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 h-auto"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteReply(reply.id)}
                            size="sm"
                            variant="ghost"
                            disabled={deletingReplyId === reply.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto disabled:opacity-50"
                          >
                            {deletingReplyId === reply.id ? (
                              <Send className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingReplyId === reply.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Edit your reply..."
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleSaveEdit(reply.id)}
                          className="inline-flex items-center"
                          disabled={savingEdit}
                        >
                          {savingEdit ? (
                            <>
                              <Send className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="inline-flex items-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply form */}
      {user ? (
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
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Please sign in to reply to this discussion.</p>
        </div>
      )}

      {/* Delete confirmation modal */}
      <DeleteReplyModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteReply}
        onConfirm={confirmDeleteReply}
        isDeleting={deletingReplyId !== null}
      />
    </div>
  );
};

export default ThreadReplies;
