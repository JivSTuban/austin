import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (error) {
          throw new Error(errorDescription || error);
        }

        // Wait for session to be established with increased retries and delay
        const waitForSession = async (retries = 10, delay = 1000) => {
          for (let i = 0; i < retries; i++) {
            console.log(`Attempt ${i + 1} to get session...`);
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('Session found:', session);
              return session;
            }
            // If we have tokens but no session, try setting them
            if (accessToken && !session && i === 5) {
              console.log('Attempting to set session manually...');
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              });
            }
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          return null;
        };

        // Get the session
        const session = await waitForSession();
        console.log('Session in callback:', session);

        if (session?.user) {
          // Check if user already has a username set in their profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }

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
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

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
