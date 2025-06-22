import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Review {
  reviewid: number;
  encodedzuid: string | null;
  reviewername: string | null;
  reviewerscreenname: string | null;
  rating: number | null;
  comment: string | null;
  createdate: string | null;
  workdescription: string | null;
  localknowledge: number | null;
  processexpertise: number | null;
  responsiveness: number | null;
  negotiationskills: number | null;
  reviewerid: string | null;
}

export function useReviews(page: number = 1, pageSize: number = 10) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);

      // Get paginated data
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('createdate', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewid: number) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('reviewid', reviewid);

      if (error) throw error;
      toast.success('Review deleted successfully');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, pageSize]);

  return {
    reviews,
    loading,
    totalCount,
    deleteReview,
    refetch: fetchReviews
  };
} 