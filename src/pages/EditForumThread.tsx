import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { updateForumThread } from '@/lib/helpers';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

const EditForumThread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categories for the dropdown
  const categories = [
    { value: 'first-time-buyers', label: 'First Time Buyers' },
    { value: 'financing', label: 'Mortgage & Financing' },
    { value: 'market-trends', label: 'Market Trends' },
    { value: 'home-improvement', label: 'Home Improvement' },
    { value: 'neighborhood', label: 'Neighborhood' }
  ];

  // Fetch thread data
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('forum_threads')
          .select('*')
          .eq('id', threadId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError('Thread not found');
          return;
        }
        
        // Check if user is the author
        if (user && data.author_id !== user.id) {
          setError('You do not have permission to edit this thread');
          return;
        }
        
        setTitle(data.title);
        setContent(data.excerpt);
        setCategory(data.category);
      } catch (err: any) {
        console.error('Error fetching thread:', err);
        setError(err.message || 'Failed to load thread');
        toast.error('Error loading thread', {
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchThread();
    }
  }, [threadId, user, authLoading]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to edit a thread');
      return;
    }
    
    if (!title.trim() || !content.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSaving(true);
    
    try {
      await updateForumThread(
        parseInt(threadId as string),
        user.id,
        {
          title: title.trim(),
          content: content.trim(),
          category
        }
      );
      
      toast.success('Thread updated successfully');
      navigate(`/forum/thread/${threadId}`);
    } catch (err: any) {
      console.error('Error updating thread:', err);
      toast.error('Failed to update thread', {
        description: err.message
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse bg-white p-8 rounded-lg shadow-sm">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => navigate('/forum')}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Forum
              </button>
            </div>
            
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => navigate('/forum')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Forum
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate('/forum')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Forum
            </button>
          </div>
          
          <h1 className="text-2xl font-bold mb-6">Edit Thread</h1>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Thread title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                  placeholder="Thread content"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/forum')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center",
                    saving && "opacity-70 cursor-not-allowed"
                  )}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditForumThread;
