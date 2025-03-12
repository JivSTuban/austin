import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MessageSquare, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThreadReplies from '@/components/ThreadReplies';
import { useFadeIn } from '@/lib/animations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Thread {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  replies_count: number;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

const ThreadView = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fadeIn = useFadeIn(100, 400);

  const fetchThread = async () => {
    if (!threadId) return;

    try {
      const { data, error } = await supabase
        .from('forum_threads')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('id', threadId)
        .single();

      if (error) throw error;
      setThread(data as Thread);
    } catch (error: any) {
      toast.error('Failed to load thread', {
        description: error.message
      });
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [threadId]);

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'first-time-buyers':
        return 'bg-blue-100 text-blue-700';
      case 'financing':
        return 'bg-green-100 text-green-700';
      case 'market-trends':
        return 'bg-purple-100 text-purple-700';
      case 'home-improvement':
        return 'bg-orange-100 text-orange-700';
      case 'neighborhood':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'first-time-buyers':
        return 'First Time Buyers';
      case 'financing':
        return 'Mortgage & Financing';
      case 'market-trends':
        return 'Market Trends';
      case 'home-improvement':
        return 'Home Improvement';
      case 'neighborhood':
        return 'Neighborhood';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!thread) return null;

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
        <div className="max-w-4xl mx-auto" style={fadeIn}>
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Discussions
          </button>

          {/* Thread header */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg border p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {thread.title}
            </h1>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={thread.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    {thread.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{thread.profiles?.username || 'Anonymous'}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(thread.date)}
                  </div>
                </div>
              </div>

              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(thread.category)}`}>
                {getCategoryName(thread.category)}
              </span>

              <div className="prose prose-blue max-w-none">
                {thread.excerpt}
              </div>
            </div>
          </div>

          {/* Replies section */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Replies ({thread.replies_count})
            </h2>
            <ThreadReplies threadId={thread.id} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ThreadView;
