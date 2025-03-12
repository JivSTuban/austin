import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/AuthContext';

const APP_URL = window.location.origin;

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleAuth = async () => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
      
      // Show loading state
      toast.loading('Redirecting to Google...', {
        duration: 2000
      });

    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error('Error signing in with Google', {
        description: error.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative w-[400px] h-[400px] bg-muted flex items-center justify-center border-b border-gray-200">
              <video
                src="/L (1).mp4"
                className="absolute inset-0 w-full h-full object-contain dark:brightness-[0.2] dark:grayscale"
                autoPlay
                playsInline
                muted
                onEnded={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.currentTime = video.duration;
                }}
              />
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome</h1>
                  <p className="text-balance text-muted-foreground">Sign in or create an account</p>
                </div>
                <Button
                  onClick={handleGoogleAuth}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <div className="text-sm text-center text-gray-500">
                  <p>By continuing, you agree to our</p>
                  <div className="space-x-1">
                    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                    <span>and</span>
                    <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
