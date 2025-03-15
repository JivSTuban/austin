import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Custom fetch with retry logic and better error messages
const customFetch = async (url: string, options: RequestInit): Promise<Response> => {
  const maxRetries = Number(import.meta.env.VITE_NEXT_PUBLIC_API_RETRY_MAX) || 3;
  const baseDelay = Number(import.meta.env.VITE_NEXT_PUBLIC_API_RETRY_DELAY) || 1000; // 1 second

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Handle different response statuses
      if (response.ok) {
        return response;
      }

      // Special handling for common error cases
      if (response.status === 404) {
        throw new Error('Resource not found. Please check the data exists.');
      }
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(`Invalid request: ${errorData.message || 'Unknown error'}`);
      }
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token.');
      }
      if (response.status === 403) {
        throw new Error('Forbidden: Insufficient permissions.');
      }
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }

      throw new Error(`Request failed with status: ${response.status}`);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error instanceof Error && 
         (error.message.includes('not found') || 
          error.message.includes('Invalid Refresh Token'))) {
        throw error;
      }

      // On last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw new Error(`Failed after ${maxRetries} attempts. ${lastError.message}`);
      }

      // Otherwise wait and retry
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Unknown error occurred');
};

// Create Supabase client with custom fetch
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: import.meta.env.VITE_NEXT_PUBLIC_AUTH_STORAGE_KEY || 'austin-auth-token',
    autoRefreshToken: false, // Disable automatic token refresh to avoid errors when no valid token exists
    detectSessionInUrl: false, // Disable automatic session detection in URL
  },
  global: {
    fetch: customFetch,
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Initialize session on load with error handling
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    console.log('Initial session loaded:', session.user.email);
  } else {
    console.log('No active session found');
  }
}).catch(error => {
  console.warn('Error loading initial session:', error.message);
});

// Add a helper function to check if user is logged in
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
};
