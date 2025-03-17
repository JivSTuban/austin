import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Listing interface based on the schema with title, address, price, beds, baths, sqft, zillow_link, and imageLink
export interface Listing {
  id: number;
  title: string | null;
  address: string;
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
  isLoading: boolean;
  error: string | null;
  fetchListings: (filters?: ListingFilters) => Promise<void>;
  getListing: (id: number) => Promise<Listing | null>;
  createListing: (listing: Omit<Listing, 'id' | 'last_updated_from_zillow'>) => Promise<Listing | null>;
  updateListing: (id: number, updates: Partial<Omit<Listing, 'id' | 'last_updated_from_zillow'>>) => Promise<Listing | null>;
  deleteListing: (id: number) => Promise<boolean>;
}

// Filter interface for querying listings
interface ListingFilters {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  searchTerm?: string;
}

export const useListings = (): ListingsData => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings with optional filters
  const fetchListings = async (filters?: ListingFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('listings')
        .select('*')
        .order('price', { ascending: true, nullsLast: true });

      // Apply filters if provided
      if (filters) {
        if (filters.minPrice) query = query.gte('price', filters.minPrice);
        if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
        if (filters.minBeds) query = query.gte('beds', filters.minBeds);
        if (filters.minBaths) query = query.gte('baths', filters.minBaths);
        if (filters.minSqft) query = query.gte('sqft', filters.minSqft);
        if (filters.searchTerm) {
          query = query.or(
            `address.ilike.%${filters.searchTerm}%,title.ilike.%${filters.searchTerm}%`
          );
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setListings(data as Listing[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        (err as PostgrestError)?.message || 'Failed to fetch listings';
      setError(errorMessage);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get single listing by ID
  const getListing = async (id: number): Promise<Listing | null> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as Listing;
    } catch (err) {
      console.error('Error fetching listing:', err);
      return null;
    }
  };

  // Create new listing
  const createListing = async (
    listing: Omit<Listing, 'id' | 'last_updated_from_zillow'>
  ): Promise<Listing | null> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert(listing)
        .select()
        .single();

      if (error) throw error;

      const newListing = data as Listing;
      setListings(prev => [...prev, newListing]);
      return newListing;
    } catch (err) {
      console.error('Error creating listing:', err);
      return null;
    }
  };

  // Update existing listing
  const updateListing = async (
    id: number,
    updates: Partial<Omit<Listing, 'id' | 'last_updated_from_zillow'>>
  ): Promise<Listing | null> => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedListing = data as Listing;
      setListings(prev =>
        prev.map(listing => (listing.id === id ? updatedListing : listing))
      );
      return updatedListing;
    } catch (err) {
      console.error('Error updating listing:', err);
      return null;
    }
  };

  // Delete listing
  const deleteListing = async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setListings(prev => prev.filter(listing => listing.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting listing:', err);
      return false;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings,
    isLoading,
    error,
    fetchListings,
    getListing,
    createListing,
    updateListing,
    deleteListing,
  };
};