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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if session exists in session storage
        const storedSession = sessionStorage.getItem('supabaseSession');
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as Session | null;
          setSession(parsedSession);
          setUser(parsedSession?.user ?? null);
          setLoading(false); // Set loading to false here as we have session from storage
        } else {
          // Get initial session from Supabase
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          // Store session in session storage
          if (initialSession) {
            sessionStorage.setItem('supabaseSession', JSON.stringify(initialSession));
          }
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
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
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [hasShownWelcome]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully signed out", {
      description: "You have been logged out of your account"
    });
  };

  const value = {
    session,
    user,
    signOut,
    loading
  };

  console.log(value);
  

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
