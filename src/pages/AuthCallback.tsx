import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Flag to ensure we only process the auth callback once
    let isHandled = false;

    const handleAuthCallback = async () => {
      if (isHandled) return;
      isHandled = true;

      try {
        // Parse both hash and search parameters
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        
        const params = new URLSearchParams(search || hash);
        
        // Try to get params from hash if not in search
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        let accessToken = params.get('access_token');
        let refreshToken = params.get('refresh_token');
        
        // If tokens not found in regular params, try parsing hash fragment
        if (!accessToken && window.location.hash.includes('access_token')) {
          const hashParams = new URLSearchParams(hash);
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
        }
        
        // Clean up the URL by removing the hash
        window.history.replaceState(null, '', window.location.pathname);

        if (error) {
          throw new Error(errorDescription || error);
        }

        // Set session immediately if we have tokens
        if (accessToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (sessionError) {
            throw new Error(`Failed to set session: ${sessionError.message}`);
          }
          
          if (!sessionData.session) {
            throw new Error('No session established after setting tokens');
          }
          
          return sessionData.session;
        }

        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error(`Failed to get session: ${sessionError.message}`);
        }

        if (session?.user) {
          // Check if user already has a username set in their profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Continue with the flow even if profile fetch fails
          }

          // Set processing to false to prevent multiple navigations
          setIsProcessing(false);
          
          // Only redirect to username page if user doesn't have a username or it's null
          if (!profile || !profile.username) {
            navigate(`/username?id=${session.user.id}&email=${session.user.email}`, { replace: true });
          } else {
            // User already has a username, redirect to home page
            navigate('/', { replace: true });
          }
        } else {
          throw new Error('No session established');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed', {
          description: error instanceof Error ? error.message : 'Please try again'
        });
        setIsProcessing(false);
        navigate('/login', { replace: true });
      }
    };

    if (isProcessing) {
      handleAuthCallback();
    }

    return () => {
      isHandled = true;
    };
  }, [navigate, isProcessing]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Completing login...</span>
      </div>
    </div>
  );
};

export default AuthCallback;
