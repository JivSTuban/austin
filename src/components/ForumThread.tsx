import { useState } from 'react';
import { MessageSquare, ChevronRight, Clock, User, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { deleteForumThread } from '@/lib/helpers';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';
import { EditDiscussionModal } from './EditDiscussionModal';
import { DeleteDiscussionModal } from './DeleteDiscussionModal';

interface ForumThreadProps {
  thread: {
    id: number;
    title: string;
    author: string | undefined; // Author can be undefined
    date: string;
    replies: number;
    excerpt: string;
    category: string;
    profiles: { username: string; avatar_url: string | null }[];
    author_id?: string; // Changed from user_id to author_id to match database schema
  };
  index: number;
  style?: React.CSSProperties;
  onThreadDeleted?: (threadId: number) => void; // Add callback for thread deletion
}

const ForumThread = ({ thread, index, style, onThreadDeleted }: ForumThreadProps) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 3D card effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 3;
    const rotateX = ((centerY - y) / centerY) * 3;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  // Handle card click
  const handleCardClick = () => {
    navigate(`/forum/thread/${thread.id}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Animation delay based on index
  const animationDelay = `${150 + index * 75}ms`;
  
  // Get category badge color
  const getCategoryColor = (category?: string) => {
    if (!category) return 'bg-gray-100 text-gray-700';
    
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
  
  // Get category display name
  const getCategoryName = (category?: string) => {
    if (!category) return '';
    
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

  // Handle opening edit modal
  const handleOpenEditModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('You must be logged in to edit a thread');
      return;
    }
    
    setIsEditModalOpen(true);
  };

  // Handle opening delete modal
  const handleOpenDeleteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('You must be logged in to delete a thread');
      return;
    }
    
    setIsDeleteModalOpen(true);
  };

  // Check if current user is the author
  const isAuthor = user && thread.author_id && user.id === thread.author_id;

  return (
    <div className="relative block group">
      <div 
        className="card-3d glass rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg group-hover:translate-x-1 border border-gray-100 cursor-pointer"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.2s ease-out',
          opacity: 0,
          animation: `fade-in 0.3s ease forwards ${animationDelay}`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {thread.title}
            </h3>
            <div className="flex items-center">
              {isAuthor && (
                <div className="flex space-x-2 mr-2">
                  <button 
                    onClick={handleOpenEditModal}
                    className="p-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    title="Edit thread"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleOpenDeleteModal}
                    className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                    title="Delete thread"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" />
            </div>
          </div>
          
          {thread.category && (
            <div className="mb-2">
              <span className={cn(
                "inline-block px-2 py-1 rounded-full text-xs font-medium",
                getCategoryColor(thread.category)
              )}>
                {getCategoryName(thread.category)}
              </span>
            </div>
          )}
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{thread.excerpt}</p>
          
          <div className="flex items-center justify-between text-xs mt-3">
            <div className="flex items-center space-x-3">
              <span className="text-gray-500 flex items-center">
                <User className="w-3 h-3 mr-1" />
                <span className="font-medium text-gray-700">
                  {Array.isArray(thread.profiles) 
                    ? thread.profiles.find(profile => profile.username === thread.author)?.username 
                    : thread.profiles?.username || 'Anonymous'}
                </span>
              </span>
              <span className="text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(thread.date)}
              </span>
            </div>
            
            <div className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              <MessageSquare className="w-3 h-3 mr-1" />
              <span>{thread.replies} {thread.replies === 1 ? 'reply' : 'replies'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      <EditDiscussionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          console.log('Edit successful');
          // The real-time subscription will handle the UI update
        }}
        threadId={thread.id}
        initialData={{
          title: thread.title,
          content: thread.excerpt,
          category: thread.category || 'first-time-buyers'
        }}
      />

      {/* Delete Modal */}
      <DeleteDiscussionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        threadId={thread.id}
        threadTitle={thread.title}
        onThreadDeleted={onThreadDeleted}
      />
    </div>
  );
};

export default ForumThread;
