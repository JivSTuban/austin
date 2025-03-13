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
        // Get hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || error);
        }

        // Wait for session to be established
        const waitForSession = async (retries = 5, delay = 500) => {
          for (let i = 0; i < retries; i++) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) return session;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          return null;
        };

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
