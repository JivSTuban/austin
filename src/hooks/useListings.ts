import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Listing interface based on the schema with title, address, price, beds, baths, sqft, zillow_link, and imageLink
export interface Listing {
  id: number;
  title: string | null;
  address: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  last_updated_from_zillow: string | null;
  sqft: number | null;
  zillow_link: string | null;
  imagelink: string | null;
}

interface ListingsData {
  listings: Listing[];
  loading: boolean;
  totalCount: number;
  addListing: (listing: Omit<Listing, 'id'>) => Promise<void>;
  updateListing: (id: number, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useListings(page: number = 1, pageSize: number = 10) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);

      // Get paginated data
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order('id', { ascending: true });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const addListing = async (listing: Omit<Listing, 'id'>) => {
    try {
      // Get the next ID
      const { data: maxIdData } = await supabase
        .from('listings')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;

      const { error } = await supabase
        .from('listings')
        .insert([{ ...listing, id: nextId }]);

      if (error) throw error;
      toast.success('Listing added successfully');
      await fetchListings();
    } catch (error) {
      console.error('Error adding listing:', error);
      toast.error('Failed to add listing');
    }
  };

  const updateListing = async (id: number, updates: Partial<Listing>) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Listing updated successfully');
      await fetchListings();
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing');
    }
  };

  const deleteListing = async (id: number) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Listing deleted successfully');
      await fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, pageSize]);

  return {
    listings,
    loading,
    totalCount,
    addListing,
    updateListing,
    deleteListing,
    refetch: fetchListings
  };
}