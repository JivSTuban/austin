import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Types
export interface SoldProperty {
  uuid: string;
  address: string;
  year: number;
  city: string;
  date_added: string;
  latest_updated: string;
}

interface SoldPropertiesData {
  properties: SoldProperty[];
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  retry: () => void;
  fetchProperty: (uuid: string) => Promise<SoldProperty | null>;
  createProperty: (property: Omit<SoldProperty, 'uuid' | 'date_added' | 'latest_updated'>) => Promise<SoldProperty | null>;
  updateProperty: (uuid: string, updates: Partial<Omit<SoldProperty, 'uuid' | 'date_added' | 'latest_updated'>>) => Promise<SoldProperty | null>;
  deleteProperty: (uuid: string) => Promise<boolean>;
}

const FETCH_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

export const useSoldProperties = (city?: string): SoldPropertiesData => {
  const [properties, setProperties] = useState<SoldProperty[]>([]);
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
        setIsLoading(true);
        setError(null);
      
        // Build query
        let query = supabase
          .from('soldproperties')
          .select();
        
        // Filter by city if provided
        if (city) {
          query = query.eq('city', city);
        }
        
        // Execute query
        const { data, error: fetchError } = await query
          .order('year', { ascending: false });
        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setProperties(data as SoldProperty[] || []);
          setError(null);
          setRetryCount(0); // Reset retry count on success
        }

      } catch (err) {
        console.error('Error in useSoldProperties:', err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 
            (err as PostgrestError)?.message || 'An unknown error occurred';
          setError(errorMessage);
          
          // Retry logic
          if (retryCount < MAX_RETRIES) {
            retryTimeout = setTimeout(() => {
              if (isMounted) {
                setRetryKey(prev => prev + 1); // Force re-fetch
              }
            }, FETCH_RETRY_DELAY);
          }
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
  }, [city, retryKey, retryCount]); // Include retryKey and retryCount to force re-fetch

  // Fetch a single property by UUID
  const fetchProperty = async (uuid: string): Promise<SoldProperty | null> => {
    try {
      const { data, error } = await supabase
        .from('soldProperties')
        .select()
        .eq('uuid', uuid)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as SoldProperty;
    } catch (err) {
      console.error('Error fetching property:', err);
      return null;
    }
  };

  // Create a new property
  const createProperty = async (
    property: Omit<SoldProperty, 'uuid' | 'date_added' | 'latest_updated'>
  ): Promise<SoldProperty | null> => {
    try {
      const { data, error } = await supabase
        .from('soldProperties')
        .insert(property)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setProperties(prev => [...prev, data as SoldProperty]);
      
      return data as SoldProperty;
    } catch (err) {
      console.error('Error creating property:', err);
      return null;
    }
  };

  // Update an existing property
  const updateProperty = async (
    uuid: string,
    updates: Partial<Omit<SoldProperty, 'uuid' | 'date_added' | 'latest_updated'>>
  ): Promise<SoldProperty | null> => {
    try {
      const { data, error } = await supabase
        .from('soldProperties')
        .update(updates)
        .eq('uuid', uuid)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setProperties(prev => 
        prev.map(property => 
          property.uuid === uuid ? { ...property, ...data } as SoldProperty : property
        )
      );
      
      return data as SoldProperty;
    } catch (err) {
      console.error('Error updating property:', err);
      return null;
    }
  };

  // Delete a property
  const deleteProperty = async (uuid: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('soldProperties')
        .delete()
        .eq('uuid', uuid);

      if (error) {
        throw error;
      }

      // Update local state
      setProperties(prev => prev.filter(property => property.uuid !== uuid));
      
      return true;
    } catch (err) {
      console.error('Error deleting property:', err);
      return false;
    }
  };

  return { 
    properties,
    isLoading, 
    error,
    retryCount,
    maxRetries: MAX_RETRIES,
    retry,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty
  };
};
