import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Types
export interface RolodexContact {
  id: string;
  name: string;
  company: string;
  number_1: string;
  number_2: string | null;
  email: string;
  notes: string | null;
  area: string;
  website: string | null;
  category: string;
  date_added: string;
  last_updated: string;
}

interface RolodexData {
  contacts: RolodexContact[];
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  retry: () => void;
  fetchContact: (id: string) => Promise<RolodexContact | null>;
  createContact: (contact: Omit<RolodexContact, 'id' | 'date_added' | 'last_updated'>) => Promise<RolodexContact | null>;
  updateContact: (id: string, updates: Partial<Omit<RolodexContact, 'id' | 'date_added' | 'last_updated'>>) => Promise<RolodexContact | null>;
  deleteContact: (id: string) => Promise<boolean>;
}

const FETCH_RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

export const useRolodex = (category?: string): RolodexData => {
  const [contacts, setContacts] = useState<RolodexContact[]>([]);
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
        console.log('Fetching contacts for category:', category);
        // Build query
        let query = supabase
          .from('rolodex')
          .select();
        
        // Filter by category if provided
        if (category) {
          query = query.eq('category', category);
        }
        
        // Execute query
        const { data, error: fetchError } = await query
          .order('name', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setContacts(data as RolodexContact[] || []);
          setError(null);
          setRetryCount(0); // Reset retry count on success
        }

      } catch (err) {
        console.error('Error in useRolodex:', err);
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
  }, [category, retryKey]); // Include retryKey to force re-fetch

  // Fetch a single contact by ID
  const fetchContact = async (id: string): Promise<RolodexContact | null> => {
    try {
      const { data, error } = await supabase
        .from('rolodex')
        .select()
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as RolodexContact;
    } catch (err) {
      console.error('Error fetching contact:', err);
      return null;
    }
  };

  // Create a new contact
  const createContact = async (
    contact: Omit<RolodexContact, 'id' | 'date_added' | 'last_updated'>
  ): Promise<RolodexContact | null> => {
    try {
      const { data, error } = await supabase
        .from('rolodex')
        .insert(contact)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setContacts(prev => [...prev, data as RolodexContact]);
      
      return data as RolodexContact;
    } catch (err) {
      console.error('Error creating contact:', err);
      return null;
    }
  };

  // Update an existing contact
  const updateContact = async (
    id: string,
    updates: Partial<Omit<RolodexContact, 'id' | 'date_added' | 'last_updated'>>
  ): Promise<RolodexContact | null> => {
    try {
      const { data, error } = await supabase
        .from('rolodex')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      setContacts(prev => 
        prev.map(contact => 
          contact.id === id ? { ...contact, ...data } as RolodexContact : contact
        )
      );
      
      return data as RolodexContact;
    } catch (err) {
      console.error('Error updating contact:', err);
      return null;
    }
  };

  // Delete a contact
  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('rolodex')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      return true;
    } catch (err) {
      console.error('Error deleting contact:', err);
      return false;
    }
  };

  return { 
    contacts,
    isLoading, 
    error,
    retryCount,
    maxRetries: MAX_RETRIES,
    retry,
    fetchContact,
    createContact,
    updateContact,
    deleteContact
  };
};