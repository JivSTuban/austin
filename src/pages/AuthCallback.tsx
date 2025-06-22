import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get session without manually parsing URL parameters
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error('No session found');
        }

        // Clear URL parameters
        window.history.replaceState(null, '', window.location.pathname);

        console.log('Session established:', session);


        if (session?.user) {
          try {
            // Check if user already has a username set in their profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;

            // Set processing to false AFTER navigation to prevent race conditions
            const targetPath = !profile?.username 
              ? `/username?id=${session.user.id}&email=${session.user.email}`
              : '/';

            navigate(targetPath, { replace: true });
            setIsProcessing(false);

          } catch (error) {
            console.error('Error fetching profile:', error);
            // If profile check fails, default to home page
            navigate('/', { replace: true });
            setIsProcessing(false);
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

    // Cleanup function
    return () => {};
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
