import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgentData } from '@/hooks/useAgentData';
import type { Review } from '@/components/ui/client-reviews';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
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
  createdate: string;
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
  updatedAt?: string;
}

const propertyTypes = ['All', 'Single Family', 'Multi-Family', 'Condo', 'Apartment', 'Other'];
const buyerTypes = ['All', 'Buyer', 'Seller', 'Both', 'Other'];

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
  const { user, session } = useAuth();
  const { reviews } = useAgentData('X1-ZUtpaayyyrapzd_82rpg');

  // Same useEffect and handlers from before...
  useEffect(() => {
    try {
      setIsLoading(true);
      if (!reviews || reviews.length === 0) {
        setFilteredReviews([]);
        return;
      }

      let result = ((reviews as unknown) as RawReview[]).map(review => {
        const propertyType = review.workdescription?.toLowerCase().includes('single family') ? 'Single Family' 
          : review.workdescription?.toLowerCase().includes('condo') ? 'Condo'
          : review.workdescription?.toLowerCase().includes('apartment') ? 'Apartment'
          : 'Other';

        const buyerType = review.workdescription?.toLowerCase().startsWith('bought') ? 'Buyer'
          : review.workdescription?.toLowerCase().startsWith('sold') ? 'Seller'
          : review.workdescription?.toLowerCase().includes('bought and sold') ? 'Both'
          : 'Other';
        
        return {
          id: review.reviewerid || crypto.randomUUID(),
          author: review.reviewername || review.reviewerscreenname || "Anonymous",
          rating: review.rating || 0,
          createdate: review.createdate,
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
          workDescription: review.workdescription || '',
          updatedAt: undefined
        };
      });
      
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
      
      result.sort((a, b) => new Date(b.createdate).getTime() - new Date(a.createdate).getTime());
      
      setFilteredReviews(result);
      setError(null);
    } catch (err) {
      console.error('Error filtering reviews:', err);
      setError('Error filtering reviews. Please try again.');
      setFilteredReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [reviews, searchTerm, filterRating, filterPropertyType, filterBuyerType]);

  const hasUserReview = () => {
    return filteredReviews.some(review => review.userId === user?.id);
  };

  const handleReviewSubmit = async (data: {
    rating: number;
    comment: string;
    propertyType: string;
    buyerType: string;
    workDescription: string;
  }) => {
    if (!session?.user) {
      console.error('No authenticated user');
      return;
    }

    try {
      const reviewData = {
        reviewername: user?.user_metadata?.name || user?.email,
        reviewerscreenname: user?.email,
        rating: data.rating,
        comment: data.comment,
        createdate: new Date().toISOString(),
        workdescription: data.workDescription,
        localknowledge: data.rating,
        processexpertise: data.rating,
        responsiveness: data.rating,
        negotiationskills: data.rating,
        reviewerid: session.user.id,
        updatedAt: new Date().toISOString()
      };

      if (editingReview) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('reviewerid', editingReview.id);

        if (updateError) throw updateError;
        
        setFilteredReviews(prev => prev.map(review =>
          review.id === editingReview.id
            ? { 
                ...review,
                rating: data.rating,
                comment: data.comment,
                propertyType: data.propertyType,
                buyerType: data.buyerType,
                workDescription: data.workDescription,
                content: data.comment,
                title: data.workDescription,
                updatedAt: new Date().toISOString()
              }
            : review
        ));
      } else {
        const { error: insertError } = await supabase
          .from('reviews')
          .insert([reviewData]);

        if (insertError) throw insertError;
        
        const newReview: ProcessedReview = {
          id: session.user.id,
          author: reviewData.reviewername || "Anonymous",
          rating: data.rating,
          createdate: reviewData.createdate,
          title: data.workDescription || "Review",
          content: data.comment || "No comment provided",
          propertyType: data.propertyType,
          buyerType: data.buyerType,
          localKnowledge: data.rating,
          processExpertise: data.rating,
          responsiveness: data.rating,
          negotiationSkills: data.rating,
          userId: session.user.id,
          comment: data.comment || "No comment provided",
          workDescription: data.workDescription || "Review",
          updatedAt: reviewData.updatedAt
        };
        setFilteredReviews(prev => [newReview, ...prev]);
      }

      setIsFormOpen(false);
      setEditingReview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please ensure all required fields are filled.');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterRating(null);
    setFilterPropertyType(null);
    setFilterBuyerType(null);
    setIsFilterOpen(false);
  };

  // Same JSX as before...
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">Client Reviews</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-start">
            {session && !hasUserReview() && (
              <ReviewDialog
                isOpen={isFormOpen}
                onOpenChange={setIsFormOpen}
                initialData={editingReview || undefined}
                onSubmit={handleReviewSubmit}
                isEditing={!!editingReview}
              />
            )}
            
            <div className="relative flex-grow sm:max-w-md">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[null, 5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating === null ? 'all' : rating}
                      onClick={() => setFilterRating(rating)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                        filterRating === rating
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      {rating === null ? 'All' : `${rating} ★`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterPropertyType(type)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                        filterPropertyType === type
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="flex flex-wrap gap-2">
                  {buyerTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterBuyerType(type)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                        filterBuyerType === type
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="max-w-5xl mx-auto py-8">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-[640px] rounded-lg bg-gray-200"></div>
            </div>
          ) : (
            <ScrollArea className="h-[640px] rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredReviews.map((review): Review => ({
                  rating: review.rating,
                  reviewer: review.author,
                  roleReviewer: review.propertyType,
                  review: review.content,
                  date: new Date(review.updatedAt || review.createdate).toLocaleDateString()
                })).map(review => (
                  <article
                    key={review.reviewer}
                    className="flex flex-col gap-4 rounded-lg border bg-card p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{review.reviewer}</h3>
                        <p className="text-sm text-muted-foreground">
                          {review.roleReviewer} • {review.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
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
                      </div>
                    </div>
                    <p className="text-pretty">{review.review}</p>
                  </article>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>
    </div>
  );
}
