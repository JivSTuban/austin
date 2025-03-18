import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  // Add a ref to track if auth has been initialized in this component lifecycle
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Skip initialization if it's already done
    if (isInitialized) return;

    const initializeAuth = async () => {
      try {
        // Check if auth has already been initialized in this browser session
        const hasInitialized = sessionStorage.getItem('authInitialized');
        
        if (hasInitialized === 'true') {
          // Auth already initialized, just load from session storage
          const storedSession = sessionStorage.getItem('supabaseSession');
          
          if (storedSession) {
            const parsedSession = JSON.parse(storedSession) as Session | null;
            setSession(parsedSession);
            setUser(parsedSession?.user ?? null);
            setLoading(false);
            setIsInitialized(true);
            return;
          }
          // If no stored session but initialized, we're logged out
          setLoading(false);
          setIsInitialized(true);
          return;
        }
        
        // First-time initialization in this session
        // Check if session exists in session storage
        const storedSession = sessionStorage.getItem('supabaseSession');
        
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as Session | null;
          // Check if the stored session is still valid (not expired)
          const currentTime = Math.floor(Date.now() / 1000);
          const isExpired = parsedSession?.expires_at && parsedSession.expires_at < currentTime;
          
          if (!isExpired) {
            // Use the stored session if it's valid
            setSession(parsedSession);
            setUser(parsedSession?.user ?? null);
            setLoading(false);
            // Mark as initialized
            sessionStorage.setItem('authInitialized', 'true');
            setIsInitialized(true);
            return; // Skip the API call if we have a valid session
          }
          // If expired, remove it and continue to fetch a new one
          sessionStorage.removeItem('supabaseSession');
        }
        
        // Only call getSession API if we don't have a valid stored session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // Store session in session storage
        if (initialSession) {
          sessionStorage.setItem('supabaseSession', JSON.stringify(initialSession));
        }
        
        // Mark as initialized regardless of outcome
        sessionStorage.setItem('authInitialized', 'true');
        setIsInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    // Initialize auth
    initializeAuth();
  }, [isInitialized]); // Only depends on isInitialized, preventing re-runs

  useEffect(() => {
    // Skip if not initialized
    if (!isInitialized) return;
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Update session storage on auth changes
      if (session) {
        sessionStorage.setItem('supabaseSession', JSON.stringify(session));
      } else {
        sessionStorage.removeItem('supabaseSession');
      }

      if (event === 'SIGNED_IN' && !hasShownWelcome) {
        // Ensure profile exists
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select()
            .eq('id', session.user.id)
            .single();

          if (!profile) {
            // Create profile if it doesn't exist
            await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  username: session.user.email,
                  avatar_url: session.user.user_metadata.avatar_url
                }
              ]);
          }
        }

        toast.success("Successfully signed in!", {
          description: `Welcome${session?.user?.email ? ` ${session.user.email}` : ''}!`
        });
        setHasShownWelcome(true);
      } else if (event === 'SIGNED_OUT') {
        setHasShownWelcome(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isInitialized, hasShownWelcome]); // Add isInitialized dependency

  const signOut = async () => {
    try {
      // First clear storages to ensure clean state
      localStorage.clear();
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Reset state
      setSession(null);
      setUser(null);
      setHasShownWelcome(false);
      setIsInitialized(false);

      // Immediately redirect to root path
      window.location.href = '/';

      toast.success("Successfully signed out", {
        description: "You have been logged out of your account"
      });

    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error("Sign out failed", {
        description: error.message
      });
    }
  };

  const value = {
    session,
    user,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };
