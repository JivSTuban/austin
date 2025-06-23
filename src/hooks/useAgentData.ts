import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Types
export interface Agent {
  encodedzuid: string;
  name: string;
  screenname: string;
  businessname: string;
  address1: string;
  address2: string | null;
  city: string;
  postalcode: string;
  state: string;
  email: string;
  phonebusiness: string | null;
  phonecell: string;
  averagevaluethreeyear: number;
  countalltime: number;
  countlastyear: number;
  pricerangethreeyearmax: number;
  pricerangethreeyearmin: number;
  description: string;
  languages: string[];
  specialties: string[];
  ratingsaverage: number;
  ratingscount: number;
  photourl: string;
  brandcolor: string;
  logourl: string;
}

export interface Review {
  reviewid: number;
  encodedzuid: string;
  reviewername: string;
  reviewerscreenname: string;
  rating: number;
  comment: string;
  createdate: string;
  workdescription: string;
  localknowledge: number;
  processexpertise: number;
  responsiveness: number;
  negotiationskills: number;
  reviewerid: string | null;
}

interface AgentData {
  agent: Agent | null;
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  retry: () => void;
}

const FETCH_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

export const useAgentData = (encodedZuid: string): AgentData => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryKey, setRetryKey] = useState(0); // Used to force re-fetch

  const retry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      setRetryKey(prev => prev + 1); // Force effect to re-run
      setError(null);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        if (!encodedZuid) {
          throw new Error('Agent ID is required');
        }

        setIsLoading(true);
        setError(null);

        // Fetch agent data
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select()
          .eq('encodedzuid', encodedZuid)
          .maybeSingle();

        if (agentError) {
          throw agentError;
        }

        if (!agentData) {
          throw new Error('Agent not found');
        }

        if (isMounted) {
          setAgent(agentData as Agent);
        }

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select()
          .eq('encodedzuid', encodedZuid)
          .order('createdate', { ascending: false });

          
        if (reviewsError) {
          throw reviewsError;
        }

        if (isMounted) {
          setReviews(reviewsData as Review[] || []);
          setError(null);
          setRetryCount(0); // Reset retry count on success
        }

      } catch (err) {
        console.error('Error in useAgentData:', err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 
            (err as PostgrestError)?.message || 'An unknown error occurred';
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [encodedZuid, retryKey]); // Include retryKey to force re-fetch

  return { 
    agent, 
    reviews, 
    isLoading, 
    error,
    retryCount,
    maxRetries: MAX_RETRIES,
    retry
  };
};
