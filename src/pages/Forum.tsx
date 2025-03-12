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
        throw error;
      }

      if (data) {
        // Type casting to ensure data matches Thread interface
        setFilteredThreads(data as Thread[]);
      }
    } catch (error: any) {
      toast.error('Error fetching threads', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
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
        thread.profiles[0]?.username?.toLowerCase().includes(lowercasedTerm)
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
      const { data: authState, error: authError } = await supabase.auth.getUser();
      // Log the entire authState object to inspect its structure
      log('Auth state response:', authState);
      const user = authState?.data?.user;

      if (authError || !authState?.data?.user) {
        const error = authError || new Error("User not authenticated");
        log('Auth error:', error);
        throw error;
      }

      log('Calling createForumThread helper');
      const thread = await createForumThread(
        user.id,
        user.email,
        user.user_metadata?.avatar_url,
        data
      );

      log('Thread created:', thread);
      setFilteredThreads(prevThreads => [{
        ...thread,
        profiles: [{
          username: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || null
        }]
      } as Thread, ...prevThreads]);
      setIsModalOpen(false);
      toast.success('Discussion created successfully!');
      log('State updated');

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
      <Navbar />
      
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
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                  disabled={isCreatingDiscussion}
                >
                  {isCreatingDiscussion ? (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Discussion
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Sign In to Post
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-8" style={getStyle(4)}>
            <button
              onClick={() => setActiveTab('discussions')}
              className={cn(
                "px-4 py-3 font-medium text-sm -mb-px transition-colors",
                activeTab === 'discussions'
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              )}
            >
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Discussions
              </div>
            </button>
            <button
              onClick={() => setActiveTab('survey')}
              className={cn(
                "px-4 py-3 font-medium text-sm -mb-px transition-colors",
                activeTab === 'survey'
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              )}
            >
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Survey
              </div>
            </button>
          </div>

          {/* Discussions tab content */}
          {activeTab === 'discussions' && (
            <>
              {/* Search bar */}
              <div
                className="relative mb-8 transition-all transform hover:scale-[1.01] focus-within:scale-[1.01]"
                style={{
                  ...getStyle(5),
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
                />
              </div>

              {/* Thread list */}
              { (filteredThreads.length > 0) ? (
                <div className="space-y-4">
                  {filteredThreads.map((thread, index) => (
                    <ForumThread
                      key={thread.id}
                      thread={{
                        id: thread.id,
                        title: thread.title,
                        author: thread.profiles[0]?.username, // Pass author's username
                        date: thread.date,
                        replies: thread.replies_count, // Pass replies count
                        excerpt: thread.excerpt,
                        category: thread.category,
                        profiles: thread.profiles, // Pass the profiles array
                      }}
                      index={index}
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
            </>
          )}

          {/* Survey tab content */}
          {activeTab === 'survey' && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8" style={getStyle(0)}>
                <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text">Home Buyer Experience Survey</h2>
                <p className="text-gray-600">
                  Help us understand the challenges faced by first-time home buyers by sharing your experience
                </p>
              </div>

              <div style={getStyle(1)}>
                <SurveyForm />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* New Discussion Modal */}
      <NewDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDiscussion}
      />
    </div>
  );
};

export default Forum;
