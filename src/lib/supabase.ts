import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://adzokgnahnkjoubwryhj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkem9rZ25haG5ram91YndyeWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1Nzk4MTMsImV4cCI6MjA1NzE1NTgxM30.OeW5BTQphpXYZhyun7OnGgdeq71hcduW0J83wIBxrhM';

// Custom fetch with retry logic and better error messages
const customFetch = async (url: string, options: RequestInit): Promise<Response> => {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

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
      if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }

      throw new Error(`Request failed with status: ${response.status}`);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error instanceof Error && error.message.includes('not found')) {
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
    storageKey: 'austin-auth-token',
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: customFetch,
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Initialize session on load
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    console.log('Initial session loaded:', session);
  }
});
