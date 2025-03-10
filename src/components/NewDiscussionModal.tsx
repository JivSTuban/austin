
import { useState, useEffect } from 'react';
import { X, Send, Users } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DiscussionData) => void;
}

export interface DiscussionData {
  title: string;
  content: string;
  category: string;
}

const categories = [
  { id: 'first-time-buyers', name: 'First Time Buyers' },
  { id: 'financing', name: 'Mortgage & Financing' },
  { id: 'market-trends', name: 'Market Trends' },
  { id: 'home-improvement', name: 'Home Improvement' },
  { id: 'neighborhood', name: 'Neighborhood Discussion' },
];

const NewDiscussionModal = ({ isOpen, onClose, onSubmit }: NewDiscussionModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('first-time-buyers');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title for your discussion');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Please enter some content for your discussion');
      return;
    }
    
    onSubmit({
      title,
      content,
      category
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setCategory('first-time-buyers');
    
    // Close modal
    onClose();
    
    // Show success toast
    toast.success('Discussion created!', {
      description: 'Your discussion has been posted successfully.',
    });
  };

  if (!isMounted) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
        style={{
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 300ms ease',
        }}
      />
      
      {/* Modal */}
      <div 
        className={cn(
          "bg-white w-full max-w-xl rounded-xl shadow-2xl z-10 overflow-hidden",
          "transform transition-all duration-300",
          isOpen ? "scale-100" : "scale-95"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <h3 className="font-medium text-lg">Start a New Discussion</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your discussion about?"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, questions, or experiences..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-md transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionModal;
