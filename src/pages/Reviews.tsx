import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/ReviewCard';
import { cn } from '@/lib/utils';
import { useAgentData } from '@/hooks/useAgentData';

const propertyTypes = ['All', 'Single Family', 'Multi-Family', 'Condo', 'Apartment', 'Other'];
const buyerTypes = ['All', 'Buyer', 'Seller', 'Both', 'Other'];

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterPropertyType, setFilterPropertyType] = useState<string | null>(null);
  const [filterBuyerType, setFilterBuyerType] = useState<string | null>(null);
  const { reviews } = useAgentData('X1-ZUtpaayyyrapzd_82rpg');
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Extract property types from work descriptions
  const getPropertyTypeFromDescription = (description: string) => {
    if (!description) return 'Other';
    const desc = description.toLowerCase();
    if (desc.includes('single family')) return 'Single Family';
    if (desc.includes('multiple occupancy')) return 'Multi-Family';
    if (desc.includes('condo')) return 'Condo';
    if (desc.includes('apartment')) return 'Apartment';
    return 'Other';
  };

  const getBuyerTypeFromDescription = (description: string) => {
    if (!description) return 'Other';
    const desc = description.toLowerCase();
    if (desc.startsWith('bought')) return 'Buyer';
    if (desc.startsWith('sold')) return 'Seller';
    if (desc.includes('bought and sold')) return 'Both';
    return 'Other';
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      if (!reviews || reviews.length === 0) {
        setFilteredReviews([]);
        return;
      }

      console.log('Raw reviews:', reviews);
      let result = reviews.map(review => {
        const propertyType = getPropertyTypeFromDescription(review.workDescription || '');
        const buyerType = getBuyerTypeFromDescription(review.workDescription || '');
        
        // Parse and format the date correctly
        let formattedDate = new Date().toISOString();
        try {
          const createDate = new Date(review.createDate);
          if (!isNaN(createDate.getTime())) {
            formattedDate = createDate.toISOString();
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }

        return {
          id: review.reviewId || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique fallback ID
          author: review.reviewerName || review.reviewerScreenName || (review.reviewerName === "" && review.reviewerScreenName === "" ? "Anonymous" : review.reviewerName || review.reviewerScreenName),
          rating: review.rating || 0,
          createdate: formattedDate,
          title: review.workDescription || 'Review',
          content: review.comment || 'No comment provided',
          propertyType,
          buyerType,
          localKnowledge: review.localKnowledge || 0,
          processExpertise: review.processExpertise || 0,
          responsiveness: review.responsiveness || 0,
          negotiationSkills: review.negotiationSkills || 0
        };
      });
      
      // Apply filters
      if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        result = result.filter(review =>
          (review.title?.toLowerCase() || '').includes(lowercasedTerm) ||
          (review.content?.toLowerCase() || '').includes(lowercasedTerm) ||
          (review.author?.toLowerCase() || '').includes(lowercasedTerm)
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
      
      // Sort by date (newest first)
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

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterRating(null);
    setFilterPropertyType(null);
    setFilterBuyerType(null);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            [...Array(4)].map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ))
          ) : filteredReviews.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-lg">
                No reviews found matching your criteria.
              </p>
            </div>
          ) : (
            filteredReviews.map((review: any) => (
              <ReviewCard key={`review-${review.id}`} review={review} index={review.id} />
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;
