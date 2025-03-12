import { useState, useEffect } from 'react';
import { ArrowLeft, PlusCircle, Search, Filter, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ForumThread from '@/components/ForumThread';
import SurveyForm from '@/components/SurveyForm';
import { NewDiscussionModal, type DiscussionData } from '@/components/NewDiscussionModal';
import { cn } from '@/lib/utils';
import { useFadeIn, useStaggeredFadeIn } from '@/lib/animations';
import { useAuth } from '@/lib/AuthContext';
import { createForumThread } from '@/lib/helpers';

interface Thread {
  id: number;
  title: string;
  author_id: string;
  date: string;
  replies_count: number;
  excerpt: string;
  category: string;
  profiles: { username: string; avatar_url: string | null }[]; // Join with profiles table, it's an array
}

const Forum = () => {
  const { user, loading: checkingAuth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [activeTab, setActiveTab] = useState('discussions');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const navigate = useNavigate();
  const fadeIn = useFadeIn(100, 400);
  const { getStyle } = useStaggeredFadeIn(5, 150, 100);

  // Fetch threads from Supabase
  const fetchThreads = async () => {
    setLoading(true);
    try {
      log('Fetching forum threads');
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          id,
          title,
          author_id,
          date,
          replies_count,
          excerpt,
          category,
          profiles (username, avatar_url)
        `)
        .order('date', { ascending: false });

      if (error) {
        log('Error fetching threads:', error);
        throw error;
      }

      log('Threads fetched successfully:', data?.length || 0, 'threads');
      if (data) {
        // Type casting to ensure data matches Thread interface
        setFilteredThreads(data as Thread[]);
      } else {
        log('No threads returned');
        setFilteredThreads([]);
      }
    } catch (error: any) {
      log('Error in fetchThreads:', error);
      console.error('Full fetch error:', error);
      toast.error('Error fetching threads', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    
    // Set up real-time subscription for forum_threads
    const subscription = supabase
      .channel('forum_threads_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'forum_threads' },
        (payload) => {
          log('Real-time: New thread inserted', payload);
          const newThread = payload.new as Thread;
          
          // Fetch the profile information for the new thread
          const fetchProfileForThread = async () => {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', newThread.author_id)
                .single();
                
              if (error) throw error;
              
              // Add the new thread to the state with profile information
              setFilteredThreads(prevThreads => [
                {
                  ...newThread,
                  profiles: data ? [data] : []
                } as Thread,
                ...prevThreads
              ]);
            } catch (error) {
              console.error('Error fetching profile for new thread:', error);
              // Still add the thread even if profile fetch fails
              setFilteredThreads(prevThreads => [
                {
                  ...newThread,
                  profiles: []
                } as Thread,
                ...prevThreads
              ]);
            }
          };
          
          fetchProfileForThread();
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'forum_threads' },
        (payload) => {
          log('Real-time: Thread updated', payload);
          const updatedThread = payload.new as Thread;
          
          setFilteredThreads(prevThreads => 
            prevThreads.map(thread => 
              thread.id === updatedThread.id ? 
                { ...updatedThread, profiles: thread.profiles } : 
                thread
            )
          );
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'forum_threads' },
        (payload) => {
          log('Real-time: Thread deleted', payload);
          const deletedThreadId = payload.old.id;
          
          setFilteredThreads(prevThreads => 
            prevThreads.filter(thread => thread.id !== deletedThreadId)
          );
        }
      )
      .subscribe();
      
    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter threads based on search term (client-side filtering)
  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();

    const filterThreads = (threads: Thread[]) => {
      if (!lowercasedTerm) {
        return threads;
      }
      return threads.filter((thread) =>
        thread.title.toLowerCase().includes(lowercasedTerm) ||
        thread.excerpt.toLowerCase().includes(lowercasedTerm) ||
        (thread.profiles && Array.isArray(thread.profiles) && thread.profiles[0]?.username?.toLowerCase().includes(lowercasedTerm))
      );
    };

    setFilteredThreads(filterThreads(filteredThreads));
  }, [searchTerm, filteredThreads]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const log = (...args: any[]) => console.log('[Forum]', ...args);

  const handleCreateDiscussion = async (data: DiscussionData) => {
    log('Creating discussion:', data);
    setIsCreatingDiscussion(true);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      log('User from auth context:', user);
      
      log('Calling createForumThread helper');
      const thread = await createForumThread(
        user.id,
        user.email,
        user.user_metadata?.avatar_url,
        data
      );

      log('Thread created:', thread);
      // We don't need to manually update the state here anymore
      // as the real-time subscription will handle it
      setIsModalOpen(false);
      toast.success('Discussion created successfully!');
      log('State will be updated via real-time subscription');

    } catch (error: any) {
      log('Error creating discussion:', error);
      console.error('Full error:', error);
      toast.error('Error creating discussion', {
        description: error.message,
      });
    } finally {
      setIsCreatingDiscussion(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="pt-24 pb-16 px-6 flex-grow"
        style={{
          backgroundImage: `
            radial-gradient(at 100% 0%, hsla(220, 100%, 85%, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(240, 100%, 85%, 0.1) 0px, transparent 50%)
          `,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-6xl mx-auto" style={fadeIn}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-2"
                style={getStyle(0)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <h1
                className="text-3xl md:text-4xl font-semibold tracking-tight mb-1 bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text"
                style={getStyle(1)}
              >
                Homebuyers Community
              </h1>
              <p
                className="text-gray-600"
                style={getStyle(2)}
              >
                Connect with other home buyers, share experiences, and get advice
              </p>
            </div>

            <div className="flex items-center space-x-2" style={getStyle(3)}>
              {checkingAuth ? (
                <button
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Loading...
                </button>
              ) : user ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:from-blue-700 hover:to-blue-600 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Start Discussion
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login', { state: { from: '/forum' } })}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:from-blue-700 hover:to-blue-600 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Sign in to Post
                </button>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6" style={getStyle(4)}>
            <button
              onClick={() => setActiveTab('discussions')}
              className={cn(
                "px-4 py-2 font-medium text-sm transition-colors relative",
                activeTab === 'discussions' 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Discussions
              </div>
              {activeTab === 'discussions' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
          
          {/* Search bar */}
          <div className="mb-6 relative" style={getStyle(4)}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading discussions...</p>
              </div>
            ) : (
              /* Thread list */
              { (filteredThreads.length > 0) ? (
                <div className="space-y-4">
                  {filteredThreads.map((thread, index) => (
                    <ForumThread
                      key={`forum-thread-${thread.id}`}
                      thread={{
                        id: thread.id,
                        title: thread.title,
                        author: thread.profiles && Array.isArray(thread.profiles) && thread.profiles[0]?.username ? thread.profiles[0].username : 'Unknown', // Pass author's username with fallback
                        date: thread.date,
                        replies: thread.replies_count, // Pass replies count
                        excerpt: thread.excerpt,
                        category: thread.category,
                        profiles: thread.profiles && Array.isArray(thread.profiles) ? thread.profiles : [], // Pass the profiles array with fallback
                        user_id: thread.author_id // Pass the author_id as user_id
                      }}
                      index={index}
                      currentUserId={user?.id} // Pass current user ID to check if user is the author
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm"
                  style={fadeIn}
                >
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No discussions found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any discussions matching your search. Try different keywords or start a new discussion.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-md hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            )}
          </div>
          
          {/* Survey form */}
          <div className="mb-12">
            <SurveyForm />
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* New discussion modal */}
      <NewDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDiscussion}
        isSubmitting={isCreatingDiscussion}
      />
    </div>
  );
};

export default Forum;
