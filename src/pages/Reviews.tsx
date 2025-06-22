import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, Filter, Star, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Calendar, TrendingUp, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgentData } from '@/hooks/useAgentData';
import type { Review } from '@/components/ui/client-reviews';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ReviewForm from '@/components/ReviewForm';
import { supabase } from '@/lib/supabase';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ReviewDialog } from '@/components/ReviewDialog';

interface RawReview {
  reviewername: string | null;
  reviewerscreenname: string | null;
  rating: number | null;
  comment: string | null;
  createdate: string;
  workdescription: string | null;
  localknowledge: number | null;
  processexpertise: number | null;
  responsiveness: number | null;
  negotiationskills: number | null;
  reviewerid: string | null;
}

interface ProcessedReview {
  id: string;
  author: string;
  rating: number;
  createDate: string;
  title: string;
  content: string;
  propertyType: string;
  buyerType: string;
  localKnowledge: number;
  processExpertise: number;
  responsiveness: number;
  negotiationSkills: number;
  workDescription: string;
  comment: string;
  userId: string;
}

const propertyTypes = ['All', 'Single Family', 'Multi-Family', 'Condo', 'Apartment', 'Other'];
const buyerTypes = ['All', 'Buyer', 'Seller', 'Both', 'Other'];

// Pagination constants
const REVIEWS_PER_PAGE = 9;

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterPropertyType, setFilterPropertyType] = useState<string | null>(null);
  const [filterBuyerType, setFilterBuyerType] = useState<string | null>(null);
  const [filteredReviews, setFilteredReviews] = useState<ProcessedReview[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ProcessedReview | null>(null);
  const [viewingReview, setViewingReview] = useState<ProcessedReview | null>(null);
  const [realtimeReviews, setRealtimeReviews] = useState<RawReview[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedReviews, setPaginatedReviews] = useState<ProcessedReview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, session } = useAuth();
  const { reviews, error: reviewsError } = useAgentData('X1-ZUtpaayyyrapzd_82rpg');

  // Helper function to process raw reviews
  const processReviews = useCallback((rawReviews: RawReview[]): ProcessedReview[] => {
    return rawReviews.map(review => {
      const propertyType = review.workdescription?.toLowerCase().includes('single family') ? 'Single Family' 
        : review.workdescription?.toLowerCase().includes('condo') ? 'Condo'
        : review.workdescription?.toLowerCase().includes('apartment') ? 'Apartment'
        : review.workdescription?.toLowerCase().includes('multiple occupancy') ? 'Multi-Family'
        : 'Other';

      const buyerType = review.workdescription?.toLowerCase().startsWith('bought') ? 'Buyer'
        : review.workdescription?.toLowerCase().startsWith('sold') ? 'Seller'
        : review.workdescription?.toLowerCase().includes('bought and sold') ? 'Both'
        : 'Other';
      
      return {
        id: review.reviewerid || crypto.randomUUID(),
        author: review.reviewername || review.reviewerscreenname || "Anonymous",
        rating: review.rating || 0,
        createDate: review.createdate,
        title: review.workdescription || 'Review',
        content: review.comment || 'No comment provided',
        propertyType,
        buyerType,
        localKnowledge: review.localknowledge || 0,
        processExpertise: review.processexpertise || 0,
        responsiveness: review.responsiveness || 0,
        negotiationSkills: review.negotiationskills || 0,
        userId: review.reviewerid || '',
        comment: review.comment || '',
        workDescription: review.workdescription || ''
      };
    });
  }, []);

  // Initialize real-time reviews with the initial data
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setRealtimeReviews(reviews as RawReview[]);
    }
  }, [reviews]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('public:reviews', {
        config: {
          broadcast: { self: true }, // Include own changes
          presence: { key: 'reviews_presence' }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: `encodedzuid=eq.X1-ZUtpaayyyrapzd_82rpg`
        },
        (payload) => {
          console.log('Real-time review INSERT:', payload);
          
          setRealtimeReviews(currentReviews => {
            // Check if review already exists to prevent duplicates
            const newReview = payload.new as RawReview;
            const exists = currentReviews.some(review => 
              review.reviewerid === newReview.reviewerid
            );
            
            if (exists) {
              console.log('Review already exists, skipping duplicate');
              return currentReviews;
            }
            
            // Add new review
            return [...currentReviews, newReview];
          });
          
          // Only show toast for reviews from other users
          const newReview = payload.new as RawReview;
          if (user?.id !== newReview.reviewerid) {
            toast.success('New review added!');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reviews',
          filter: `encodedzuid=eq.X1-ZUtpaayyyrapzd_82rpg`
        },
        (payload) => {
          console.log('Real-time review UPDATE:', payload);
          console.log('Old data:', payload.old);
          console.log('New data:', payload.new);
          
          setRealtimeReviews(currentReviews => {
            // Update existing review
            return currentReviews.map(review => 
              review.reviewerid === (payload.new as RawReview).reviewerid 
                ? payload.new as RawReview 
                : review
            );
          });
          
          toast.success('Review updated!');
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'reviews',
          filter: `encodedzuid=eq.X1-ZUtpaayyyrapzd_82rpg`
        },
        (payload) => {
          console.log('Real-time review DELETE:', payload);
          
          setRealtimeReviews(currentReviews => {
            // Remove deleted review
            return currentReviews.filter(review => 
              review.reviewerid !== (payload.old as RawReview).reviewerid
            );
          });
          
          toast.success('Review deleted!');
        }
      )
      .subscribe((status, err) => {
        console.log('Reviews subscription status:', status);
        if (err) {
          console.log('Reviews subscription error:', err);
        }
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to reviews changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('Error subscribing to reviews changes');
          toast.error('Real-time review updates may not work properly');
        } else if (status === 'TIMED_OUT') {
          console.log('Reviews subscription timed out');
          toast.error('Connection timed out - please refresh');
        } else if (status === 'CLOSED') {
          console.log('Reviews subscription closed');
        }
      });

    return () => {
      console.log('Cleaning up reviews subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (reviewsError) {
      setError(reviewsError);
      toast.error('Error loading reviews', {
        description: 'Please try again later'
      });
    }
  }, [reviewsError]);

  useEffect(() => {
    try {
      setIsLoading(true);
      if (!realtimeReviews || realtimeReviews.length === 0) {
        setFilteredReviews([]);
        return;
      }

      let result = processReviews(realtimeReviews);
      
      if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        result = result.filter(review =>
          review.title.toLowerCase().includes(lowercasedTerm) ||
          review.content.toLowerCase().includes(lowercasedTerm) ||
          review.author.toLowerCase().includes(lowercasedTerm)
        );
      }
      
      if (filterRating !== null) {
        result = result.filter(review => review.rating === filterRating);
      }
      
      if (filterPropertyType && filterPropertyType !== 'All') {
        result = result.filter(review => review.propertyType === filterPropertyType);
      }
      
      if (filterBuyerType && filterBuyerType !== 'All') {
        result = result.filter(review => review.buyerType === filterBuyerType);
      }
      
      result.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
      
      setFilteredReviews(result);
      setCurrentPage(1); // Reset to first page when filters change
      setError(null);
    } catch (err) {
      console.error('Error filtering reviews:', err);
      toast.error('Error filtering reviews', {
        description: 'Please try again.'
      });
      setFilteredReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [realtimeReviews, searchTerm, filterRating, filterPropertyType, filterBuyerType, processReviews]);

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    setPaginatedReviews(filteredReviews.slice(startIndex, endIndex));
  }, [filteredReviews, currentPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const totalReviews = filteredReviews.length;
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * REVIEWS_PER_PAGE, totalReviews);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasUserReview = () => {
    if (!user?.id) return false;
    // Check against all reviews, not just filtered ones
    const allProcessedReviews = processReviews(realtimeReviews);
    return allProcessedReviews.some(review => review.userId === user?.id);
  };

  const getUserReview = () => {
    if (!user?.id) return null;
    // Check against all reviews, not just filtered ones
    const allProcessedReviews = processReviews(realtimeReviews);
    return allProcessedReviews.find(review => review.userId === user?.id) || null;
  };

  const handleReviewSubmit = async (data: {
    rating: number;
    comment: string;
    propertyType: string;
    buyerType: string;
    workDescription: string;
  }) => {
    if (!session?.user) {
      toast.error('Authentication required', {
        description: 'Please sign in to submit a review.'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reviewData = {
          reviewername: user?.user_metadata?.name || user?.email || 'Anonymous',
          reviewerscreenname: user?.email || 'Anonymous',
          rating: data.rating || 0,
          comment: data.comment || '',
          workdescription: data.workDescription || '',
          localknowledge: data.rating || 0,
          processexpertise: data.rating || 0,
          responsiveness: data.rating || 0,
          negotiationskills: data.rating || 0,
          reviewerid: session.user.id,
          encodedzuid: 'X1-ZUtpaayyyrapzd_82rpg',
          reviewid: parseInt(Date.now().toString().slice(-9)), // Use last 9 digits of timestamp for integer ID
          createdate: new Date().toISOString() // Database will handle the timestamp format
      };

      if (editingReview) {
        // Optimistic update for editing
        const optimisticReview: RawReview = {
          ...realtimeReviews.find(r => r.reviewerid === editingReview.userId)!,
          ...reviewData
        };
        
        setRealtimeReviews(prevReviews => 
          prevReviews.map(review => 
            review.reviewerid === editingReview.userId ? optimisticReview : review
          )
        );

        // Update existing review
        const { error: updateError } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('reviewerid', editingReview.userId);

        if (updateError) throw updateError;
        
        toast.success('Review updated successfully');
      } else {
        // First check if user already has a review
        const { data: existingReview } = await supabase
          .from('reviews')
          .select('*')
          .eq('reviewerid', session.user.id)
          .eq('encodedzuid', 'X1-ZUtpaayyyrapzd_82rpg')
          .maybeSingle();

        if (existingReview) {
          toast.error('Review exists', {
            description: 'You have already submitted a review. Please edit your existing review instead.'
          });
          return;
        }

        // Insert new review - let real-time subscription handle UI update
        const { error: insertError } = await supabase
          .from('reviews')
          .insert([reviewData]);

        if (insertError) {
          throw insertError;
        }
        
        toast.success('Review submitted successfully');
      }

      setIsFormOpen(false);
      setEditingReview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        description: 'Please ensure all required fields are filled.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewUserId: string) => {
    if (!session?.user || session.user.id !== reviewUserId) {
      toast.error('Unauthorized', {
        description: 'You can only delete your own reviews.'
      });
      return;
    }

    try {
      // Optimistic update - remove from state immediately
      const reviewToDelete = realtimeReviews.find(r => r.reviewerid === reviewUserId);
      setRealtimeReviews(prevReviews => 
        prevReviews.filter(review => review.reviewerid !== reviewUserId)
      );

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('reviewerid', reviewUserId)
        .eq('encodedzuid', 'X1-ZUtpaayyyrapzd_82rpg');

      if (error) {
        // Revert optimistic update on error
        if (reviewToDelete) {
          setRealtimeReviews(prevReviews => [...prevReviews, reviewToDelete]);
        }
        throw error;
      }
      
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review', {
        description: 'Please try again later.'
      });
    }
  };

  const handleEditReview = (review: ProcessedReview) => {
    if (!session?.user || session.user.id !== review.userId) {
      toast.error('Unauthorized', {
        description: 'You can only edit your own reviews.'
      });
      return;
    }
    
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const handleViewReview = (review: ProcessedReview) => {
    setViewingReview(review);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterRating(null);
    setFilterPropertyType(null);
    setFilterBuyerType(null);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Client Reviews</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our clients say about their real estate experience
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredReviews.length > 0 
                    ? (filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length).toFixed(1)
                    : '0'
                  }
                </p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredReviews.filter(r => r.rating >= 4).length}
                </p>
                <p className="text-sm text-gray-600">4+ Star Reviews</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((filteredReviews.filter(r => r.rating >= 4).length / Math.max(filteredReviews.length, 1)) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-grow">
              <div className="relative flex-grow max-w-md bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border-0 shadow-none focus:ring-0 focus:border-0 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg transition-colors bg-white shadow-sm",
                  isFilterOpen ? "bg-blue-50 border-blue-200 text-blue-700" : "hover:bg-gray-50"
                )}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {(filterRating !== null || filterPropertyType || filterBuyerType) && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            {session && !hasUserReview() && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Write a Review
              </Button>
            )}
          </div>
        </div>

        {isFilterOpen && (
          <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Reviews</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[null, 5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating === null ? 'all' : rating}
                      onClick={() => setFilterRating(rating)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                        filterRating === rating
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {rating === null ? 'All Ratings' : (
                        <span className="flex items-center gap-1">
                          {rating} <Star className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterPropertyType(type)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                        filterPropertyType === type
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
                <div className="flex flex-wrap gap-2">
                  {buyerTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterBuyerType(type)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                        filterBuyerType === type
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {totalReviews > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {startIndex}-{endIndex} of {totalReviews} reviews
              {(searchTerm || filterRating !== null || filterPropertyType || filterBuyerType) && (
                <span className="text-blue-600 ml-1">
                  (filtered)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="mb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedReviews.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {error ? 'Error loading reviews' : 'No reviews found'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {error 
                    ? 'Please try again later'
                    : searchTerm || filterRating !== null || filterPropertyType || filterBuyerType
                      ? 'Try adjusting your filters to see more reviews'
                      : 'Be the first to share your experience working with Austin'
                  }
                </p>
                {!error && session && !hasUserReview() && (
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Write the First Review
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReviews.map((review, index) => (
                <article
                  key={`${review.userId}-${index}`}
                  className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col"
                  onClick={() => handleViewReview(review)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {review.author}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(review.createDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={cn(
                            "transition-colors",
                            i < review.rating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "fill-gray-200 text-gray-200"
                          )}
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {review.rating}
                      </span>
                    </div>
                  </div>

                  {/* Property Type Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {review.propertyType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                      {review.buyerType}
                    </span>
                  </div>

                  {/* Work Description */}
                  <div className="mb-3">
                    <p className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-2 rounded-lg">
                      {review.workDescription}
                    </p>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 flex-grow mb-4">
                    {review.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                      Click to read full review →
                    </span>
                    
                    {/* Edit/Delete buttons for review author */}
                    {session?.user?.id === review.userId && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditReview(review);
                          }}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(review.userId);
                          }}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center">
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "w-10 h-10 bg-white border-gray-200",
                          currentPage === pageNum 
                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                            : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 bg-white hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleReviewSubmit}
        initialData={editingReview ? {
          rating: editingReview.rating,
          comment: editingReview.comment,
          propertyType: editingReview.propertyType,
          buyerType: editingReview.buyerType,
          workDescription: editingReview.workDescription
        } : undefined}
        isEditing={!!editingReview}
        isSubmitting={isSubmitting}
      />

      {/* View Review Modal */}
      {viewingReview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingReview(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingReview.author}</h2>
                  <p className="text-gray-600">{viewingReview.propertyType} • {new Date(viewingReview.createDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setViewingReview(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={cn(
                        "transition-colors",
                        i < viewingReview.rating 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{viewingReview.rating}/5</span>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Work Description</h3>
                <p className="text-blue-600 bg-blue-50 p-3 rounded-lg">{viewingReview.workDescription}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Review</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{viewingReview.content}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Transaction Type</p>
                  <p className="font-semibold">{viewingReview.buyerType}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Property Type</p>
                  <p className="font-semibold">{viewingReview.propertyType}</p>
                </div>
              </div>
              
              {session?.user?.id === viewingReview.userId && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setViewingReview(null);
                      handleEditReview(viewingReview);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Review
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setViewingReview(null);
                      handleDeleteReview(viewingReview.userId);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
